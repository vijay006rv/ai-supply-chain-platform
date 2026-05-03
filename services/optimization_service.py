import logging
from typing import Dict

import pandas as pd

from backend.data_loader import load_datasets
from models.demand_model import predict_demand
from services.esg_service import compute_esg_scores
from services.geo_service import analyze_geopolitical_risk
from services.location_resolver import resolve_country, country_to_region

logger = logging.getLogger(__name__)


# ---------------------------------------------------------
# SAFE NORMALIZATION
# ---------------------------------------------------------
def _normalize_series(series: pd.Series) -> pd.Series:

    if series is None or len(series) == 0:
        return pd.Series([0.5] * len(series))

    s = pd.to_numeric(series, errors="coerce")

    min_v = s.min()
    max_v = s.max()

    if pd.isna(min_v) or pd.isna(max_v) or max_v == min_v:
        return pd.Series([0.5] * len(s), index=s.index)

    return (s - min_v) / (max_v - min_v)


# ---------------------------------------------------------
# MAIN OPTIMIZER
# ---------------------------------------------------------
def optimize_supply_chain() -> Dict:

    logger.info("Starting supply chain optimization...")

    try:
        supply_chain_df, esg_df_raw = load_datasets()
    except Exception as e:
        logger.error(f"Dataset load failed: {e}")
        return {
            "best_suppliers": [],
            "recommended_routes": [],
            "risk_summary": [],
            "message": "Dataset loading failed"
        }

    # -----------------------------------------------------
    # DEMAND FORECAST
    # -----------------------------------------------------
    demand_df = predict_demand(supply_chain_df)

    supply_chain_df = supply_chain_df.merge(
        demand_df[["SKU", "PredictedDemand"]],
        on="SKU",
        how="left"
    )

    # -----------------------------------------------------
    # SUPPLIER AGGREGATION
    # -----------------------------------------------------
    supplier_agg = (
        supply_chain_df.groupby(["Supplier name", "Location"], as_index=False)
        .agg({
            "PredictedDemand": "sum",
            "Manufacturing costs": "mean",
            "Costs": "mean"
        })
        .rename(columns={"Costs": "LogisticsCost"})
    )

    # -----------------------------------------------------
    # LOCATION → COUNTRY → REGION
    # -----------------------------------------------------
    supplier_agg["Country"] = supplier_agg["Location"].apply(resolve_country)
    supplier_agg["ResolvedRegion"] = supplier_agg["Country"].apply(country_to_region)

    # -----------------------------------------------------
    # ESG INTEGRATION
    # -----------------------------------------------------
    esg_scores = compute_esg_scores()

    if not esg_scores.empty:

        esg_col = None

        if "ESG_Total" in esg_scores.columns:
            esg_col = "ESG_Total"

        elif "ESG_Overall" in esg_scores.columns:
            esg_col = "ESG_Overall"

        if esg_col and "Region" in esg_scores.columns:

            esg_region = (
                esg_scores.groupby("Region", as_index=False)
                .agg({esg_col: "mean"})
                .rename(columns={esg_col: "Region_ESG_Total"})
            )

            supplier_agg = supplier_agg.merge(
                esg_region,
                left_on="ResolvedRegion",
                right_on="Region",
                how="left"
            )

            # If merge produced Region_ESG_Total, fill NAs with median; otherwise fallback to 0.5
            if "Region_ESG_Total" in supplier_agg.columns:
                median_esg = supplier_agg["Region_ESG_Total"].median()
                supplier_agg["Region_ESG_Total"] = supplier_agg["Region_ESG_Total"].fillna(
                    median_esg
                )
            else:
                supplier_agg["Region_ESG_Total"] = 0.5
        else:
            # Missing expected columns in ESG data; use neutral score
            supplier_agg["Region_ESG_Total"] = 0.5
    else:
        # No ESG data at all; use neutral score
        supplier_agg["Region_ESG_Total"] = 0.5

    # -----------------------------------------------------
    # GEO RISK INTEGRATION (robust to API failures)
    # -----------------------------------------------------
    try:
        geo_list = analyze_geopolitical_risk()
        geo_full_df = pd.DataFrame(geo_list) if geo_list else pd.DataFrame()
        logger.info(f"Geo risk records: {len(geo_full_df)}")
    except Exception as e:
        logger.warning(f"Geopolitical risk analysis failed: {e}. Continuing without geo data.")
        geo_full_df = pd.DataFrame()

    geo_df = geo_full_df.copy()

    if not geo_df.empty and "country" in geo_df.columns:

        geo_df["GeoCountry"] = geo_df["country"]

        # detect correct risk column
        if "risk_score" in geo_df.columns:
            geo_df["GeoRiskScore"] = geo_df["risk_score"]

        elif "final_risk" in geo_df.columns:
            geo_df["GeoRiskScore"] = geo_df["final_risk"]

        else:
            geo_df["GeoRiskScore"] = 0.5

        geo_df = geo_df[["GeoCountry", "GeoRiskScore"]]

        supplier_agg = supplier_agg.merge(
            geo_df,
            left_on="Country",
            right_on="GeoCountry",
            how="left"
        )

        # After merge, ensure we have a clean GeoRiskScore column
        if "GeoRiskScore" in supplier_agg.columns:
            median_geo = supplier_agg["GeoRiskScore"].median()
            supplier_agg["GeoRiskScore"] = supplier_agg["GeoRiskScore"].fillna(median_geo)
        else:
            supplier_agg["GeoRiskScore"] = 0.5
    else:
        # No geo data at all; neutral geo risk
        supplier_agg["GeoRiskScore"] = 0.5

    # -----------------------------------------------------
    # SCORING
    # -----------------------------------------------------
    supplier_agg["DemandScore"] = _normalize_series(supplier_agg["PredictedDemand"])

    supplier_agg["CostScore"] = 1 - _normalize_series(
        supplier_agg["Manufacturing costs"] + supplier_agg["LogisticsCost"]
    )

    supplier_agg["ESGScore"] = _normalize_series(supplier_agg["Region_ESG_Total"])

    supplier_agg["GeoSafetyScore"] = 1 - _normalize_series(
        supplier_agg["GeoRiskScore"]
    )

    supplier_agg["CompositeScore"] = (
        0.4 * supplier_agg["DemandScore"]
        + 0.25 * supplier_agg["CostScore"]
        + 0.2 * supplier_agg["ESGScore"]
        + 0.15 * supplier_agg["GeoSafetyScore"]
    )

    # -----------------------------------------------------
    # TOP SUPPLIERS
    # -----------------------------------------------------
    top_suppliers_df = supplier_agg.sort_values(
        "CompositeScore",
        ascending=False
    ).head(5)

    best_suppliers = []

    for _, row in top_suppliers_df.iterrows():

        try:
            best_suppliers.append({
                "supplier_name": row.get("Supplier name", "Unknown"),
                "location": row.get("Location", "Unknown"),
                "composite_score": float(row.get("CompositeScore", 0.5)),
                "predicted_demand": float(row.get("PredictedDemand", 0.0)),
                "avg_manufacturing_cost": float(row.get("Manufacturing costs", 0.0)),
                "avg_logistics_cost": float(row.get("LogisticsCost", 0.0)),
                "esg_score": float(row.get("ESGScore", 0.5)),
                "geo_safety_score": float(row.get("GeoSafetyScore", 0.5)),
            })
        except Exception as e:
            logger.warning(f"Failed to append supplier row to best_suppliers: {e}")

    # Fallback: if for some reason best_suppliers is still empty but we have data,
    # create a minimal set from the first few supplier rows so the dashboard shows something.
    if not best_suppliers and not supplier_agg.empty:
        logger.warning("best_suppliers list is empty; using fallback suppliers from aggregated data.")
        fallback_df = supplier_agg.head(5)
        for _, row in fallback_df.iterrows():
            best_suppliers.append({
                "supplier_name": row.get("Supplier name", "Unknown"),
                "location": row.get("Location", "Unknown"),
                "composite_score": float(row.get("CompositeScore", 0.5)),
                "predicted_demand": float(row.get("PredictedDemand", 0.0)),
                "avg_manufacturing_cost": float(row.get("Manufacturing costs", 0.0)),
                "avg_logistics_cost": float(row.get("LogisticsCost", 0.0)),
                "esg_score": float(row.get("ESGScore", 0.5)),
                "geo_safety_score": float(row.get("GeoSafetyScore", 0.5)),
            })

    # -----------------------------------------------------
    # ROUTES
    # -----------------------------------------------------
    route_agg = (
        supply_chain_df.groupby(
            ["Routes", "Transportation modes", "Shipping carriers"],
            as_index=False
        )
        .agg({"Costs": "mean"})
        .rename(columns={"Costs": "avg_cost"})
        .sort_values("avg_cost")
        .head(5)
    )

    # Map dataframe columns to API-friendly keys expected by the frontend
    recommended_routes = []
    for _, row in route_agg.iterrows():
        recommended_routes.append(
            {
                "route": str(row.get("Routes", "")),
                "mode": str(row.get("Transportation modes", "")),
                "carrier": str(row.get("Shipping carriers", "")),
                "avg_cost": float(row.get("avg_cost", 0.0)),
            }
        )

    # -----------------------------------------------------
    # RISK SUMMARY (ESG + Geo)
    # -----------------------------------------------------
    risk_summary = []

    # ESG risk: companies with lowest ESG totals (higher risk)
    if not esg_scores.empty:
        try:
            score_col = "ESG_Total" if "ESG_Total" in esg_scores.columns else "ESG_Overall"
            if score_col in esg_scores.columns:
                # Lower ESG score → higher risk
                worst_esg = esg_scores.sort_values(score_col, ascending=True).head(3)
                for _, row in worst_esg.iterrows():
                    risk_summary.append(
                        {
                            "type": "ESG",
                            "region": str(row.get("Region", "Unknown")),
                            "entity": str(row.get("CompanyName", row.get("CompanyID", "Unknown"))),
                            "risk_level": "High",
                            "score": float(row.get(score_col, 0.0)),
                            "details": f"ESG score {float(row.get(score_col, 0.0)):.1f}",
                        }
                    )
        except Exception as e:
            logger.warning(f"Failed to build ESG risk summary: {e}")

    # Geo risk: countries with highest risk_score / final_risk
    if not geo_full_df.empty:
        try:
            if "risk_score" in geo_full_df.columns:
                geo_score_col = "risk_score"
            elif "final_risk" in geo_full_df.columns:
                geo_score_col = "final_risk"
            else:
                geo_score_col = None

            if geo_score_col:
                worst_geo = geo_full_df.sort_values(geo_score_col, ascending=False).head(3)
                for _, row in worst_geo.iterrows():
                    score_val = float(row.get(geo_score_col, 0.0))
                    risk_level = "High" if score_val > 0.7 else "Medium"
                    risk_summary.append(
                        {
                            "type": "Geopolitical",
                            "region": str(row.get("country", "Unknown")),
                            "entity": str(row.get("country", "Unknown")),
                            "risk_level": risk_level,
                            "score": score_val,
                            "details": f"Geo risk score {score_val:.2f}; sentiment={row.get('avg_sentiment', 0):.2f}, articles={int(row.get('articles', 0))}",
                        }
                    )
        except Exception as e:
            logger.warning(f"Failed to build geopolitical risk summary: {e}")

    # -----------------------------------------------------
    # STRATEGY MESSAGE (AI recommendation)
    # -----------------------------------------------------
    strategy_parts = []

    if best_suppliers:
        top = best_suppliers[0]
        strategy_parts.append(
            f"Prioritize {top['supplier_name']} in {top['location']} "
            f"(composite score {top['composite_score']:.3f}, "
            f"predicted demand ~{top['predicted_demand']:.0f} units) "
            "to meet near-term demand efficiently."
        )

    if recommended_routes:
        r0 = recommended_routes[0]
        strategy_parts.append(
            f"Route shipments via {r0['route']} using {r0['mode']} with carrier {r0['carrier']} "
            f"to minimize logistics cost (avg cost {r0['avg_cost']:.2f})."
        )

    # Highlight top risk items (up to 2) if available
    if risk_summary:
        high_risks = [r for r in risk_summary if r.get("risk_level") == "High"] or risk_summary
        focus = high_risks[:2]
        risk_msgs = [
            f"{r['type']} risk in {r['region']} (score {r['score']:.2f})"
            for r in focus
        ]
        strategy_parts.append(
            "Monitor " + " and ".join(risk_msgs) + " while executing this plan."
        )

    if not strategy_parts:
        final_message = "AI optimization completed using Demand + ESG + Geo risk analysis."
    else:
        final_message = " ".join(strategy_parts)

    logger.info("Optimization completed successfully")

    return {
        "best_suppliers": best_suppliers,
        "recommended_routes": recommended_routes,
        "risk_summary": risk_summary,
        "message": final_message,
    }