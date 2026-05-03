import os
from typing import Tuple

import pandas as pd


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


def _load_csv(path: str) -> pd.DataFrame:
    """Load a CSV file into a DataFrame with basic parsing options."""
    return pd.read_csv(path)


def _clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Perform basic cleaning:
    - Strip whitespace from column names
    - Drop fully duplicate rows
    - For numeric columns: fill missing with column mean
    - For non-numeric columns: fill missing with mode (most frequent)
    """
    if df is None or df.empty:
        return df

    # Normalize column names
    df = df.copy()
    df.columns = [str(c).strip() for c in df.columns]

    # Remove duplicate rows
    df.drop_duplicates(inplace=True)

    # Handle missing values
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            if df[col].isnull().any():
                df[col] = df[col].fillna(df[col].mean())
        else:
            if df[col].isnull().any():
                mode_series = df[col].mode()
                if not mode_series.empty:
                    df[col] = df[col].fillna(mode_series.iloc[0])
                else:
                    df[col] = df[col].fillna("Unknown")

    return df


def load_datasets() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Load and clean the core datasets for the platform.

    Returns:
        supply_chain_df: transactional & logistics data
        esg_df: company ESG and financial data
    """
    supply_chain_path = os.path.join(DATA_DIR, "supply_chain_data.csv")
    esg_path = os.path.join(DATA_DIR, "company_esg_financial_dataset.csv")

    if not os.path.exists(supply_chain_path):
        raise FileNotFoundError(f"supply_chain_data.csv not found at {supply_chain_path}")
    if not os.path.exists(esg_path):
        raise FileNotFoundError(
            f"company_esg_financial_dataset.csv not found at {esg_path}"
        )

    supply_chain_df = _clean_dataframe(_load_csv(supply_chain_path))
    esg_df = _clean_dataframe(_load_csv(esg_path))

    return supply_chain_df, esg_df


__all__ = ["load_datasets"]

