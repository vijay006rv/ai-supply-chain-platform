import pandas as pd
from services.optimization_service import optimize_supply_chain


def run_scenario(
    demand_multiplier=1.0,
    fuel_cost_multiplier=1.0,
    excluded_regions=None,
    min_esg_score=None,
    max_geo_risk=None,
):
    """
    Runs a supply chain optimization scenario with user-defined constraints.
    """

    # Get baseline optimization results
    baseline = optimize_supply_chain()

    best_suppliers = baseline.get("best_suppliers", [])

    scenario_suppliers = []

    for supplier in best_suppliers:

        supplier_copy = supplier.copy()

        # Apply demand multiplier
        if "PredictedDemand" in supplier_copy:
            supplier_copy["PredictedDemand"] = (
                supplier_copy["PredictedDemand"] * demand_multiplier
            )

        # Apply fuel cost multiplier
        if "LogisticsCost" in supplier_copy:
            supplier_copy["LogisticsCost"] = (
                supplier_copy["LogisticsCost"] * fuel_cost_multiplier
            )

        # Apply ESG filter
        if min_esg_score:
            if supplier_copy.get("ESGScore", 0) < min_esg_score:
                continue

        # Apply Geo risk filter
        if max_geo_risk:
            if supplier_copy.get("GeoRisk", 1) > max_geo_risk:
                continue

        # Apply region exclusion
        if excluded_regions:
            if supplier_copy.get("Region") in excluded_regions:
                continue

        scenario_suppliers.append(supplier_copy)

    return {
        "baseline_results": baseline,
        "scenario_results": {
            "best_suppliers": scenario_suppliers
        },
        "message": "Scenario simulation completed"
    }