import os
import pickle
from typing import Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

from backend.data_loader import load_datasets


MODELS_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(MODELS_DIR, "demand_model.pkl")


TARGET_COLUMN = "Number of products sold"


def _prepare_features(
    df: pd.DataFrame,
) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Prepare features and target for demand forecasting.

    Currently uses a simple feature set:
    - All numeric columns except the target as features
    - Target: 'Number of products sold'
    """
    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"Target column '{TARGET_COLUMN}' not found in supply chain data")

    df = df.copy()

    # Select numeric columns
    numeric_df = df.select_dtypes(include=[np.number])

    if TARGET_COLUMN not in numeric_df.columns:
        # Ensure target is numeric; try to coerce if needed
        df[TARGET_COLUMN] = pd.to_numeric(df[TARGET_COLUMN], errors="coerce")
        numeric_df = df.select_dtypes(include=[np.number])

    y = numeric_df[TARGET_COLUMN]
    X = numeric_df.drop(columns=[TARGET_COLUMN])

    # Basic NA handling (should already be handled in data_loader, but keep as safety)
    X = X.fillna(X.mean())
    y = y.fillna(y.mean())

    return X, y


def train_or_load_model(force_retrain: bool = False) -> XGBRegressor:
    """
    Train an XGBoost regression model for demand forecasting or load an existing one.
    """
    if not force_retrain and os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        return model

    supply_chain_df, _ = load_datasets()
    X, y = _prepare_features(supply_chain_df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="reg:squarederror",
        random_state=42,
    )

    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    # Persist the trained model
    os.makedirs(MODELS_DIR, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    return model


def predict_demand(input_data: Optional[pd.DataFrame] = None) -> pd.DataFrame:
    """
    Predict product demand.

    If input_data is None, predictions are generated for the full supply_chain dataset.

    Returns:
        DataFrame with at least:
         - 'SKU'
         - 'PredictedDemand'
    """
    model = train_or_load_model()

    if input_data is None:
        supply_chain_df, _ = load_datasets()
        data_df = supply_chain_df
    else:
        data_df = input_data.copy()

    X, _ = _prepare_features(data_df)
    preds = model.predict(X)

    result = pd.DataFrame({"PredictedDemand": preds})

    # Attach SKU/product type if available for easier frontend consumption
    if "SKU" in data_df.columns:
        result["SKU"] = data_df["SKU"].values
    if "Product type" in data_df.columns:
        result["ProductType"] = data_df["Product type"].values

    return result


__all__ = ["train_or_load_model", "predict_demand", "MODEL_PATH"]

