from typing import Optional

import pandas as pd

from backend.data_loader import load_datasets


def compute_esg_scores(esg_df: Optional[pd.DataFrame] = None) -> pd.DataFrame:
    """
    Compute ESG scores and rank suppliers/companies by ESG risk.

    ESG score is calculated as:
        ESG = ESG_Environmental + ESG_Social + ESG_Governance

    Returns:
        DataFrame with columns:
         - CompanyID
         - CompanyName
         - Region
         - ESG_Environmental
         - ESG_Social
         - ESG_Governance
         - ESG_Total
         - ESG_RiskRank (1 = best ESG, higher = worse)
    """
    _, base_esg_df = load_datasets() if esg_df is None else (None, esg_df)

    df = base_esg_df.copy()
    df.columns = [str(c).strip() for c in df.columns]

    # Ensure required columns exist
    required_cols = ["ESG_Environmental", "ESG_Social", "ESG_Governance"]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Column '{col}' missing from ESG dataset")

    df["ESG_Total"] = (
        df["ESG_Environmental"].astype(float)
        + df["ESG_Social"].astype(float)
        + df["ESG_Governance"].astype(float)
    )

    # Lower ESG_Total could either mean better or worse depending on convention.
    # Here, assume higher is better ESG performance → lower risk.
    df["ESG_RiskRank"] = df["ESG_Total"].rank(ascending=False, method="dense").astype(int)

    # Aggregate to the latest year per company for a concise supplier view
    if "Year" in df.columns and "CompanyID" in df.columns:
        df_sorted = df.sort_values(["CompanyID", "Year"], ascending=[True, False])
        df_latest = df_sorted.groupby("CompanyID", as_index=False).first()
    else:
        df_latest = df

    columns_to_return = [
        c
        for c in [
            "CompanyID",
            "CompanyName",
            "Industry",
            "Region",
            "Year",
            "ESG_Environmental",
            "ESG_Social",
            "ESG_Governance",
            "ESG_Total",
            "ESG_RiskRank",
        ]
        if c in df_latest.columns
    ]

    return df_latest[columns_to_return].sort_values("ESG_RiskRank")


__all__ = ["compute_esg_scores"]

