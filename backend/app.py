import logging
import sys
import os

# ---------------------------------------------------------
# ADD PROJECT ROOT TO PYTHON PATH
# ---------------------------------------------------------
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(ROOT_DIR)

# ---------------------------------------------------------
# FASTAPI IMPORTS
# ---------------------------------------------------------
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---------------------------------------------------------
# PROJECT SERVICES IMPORTS
# ---------------------------------------------------------
from models.demand_model import predict_demand, train_or_load_model
from services.esg_service import compute_esg_scores
from services.geo_service import analyze_geopolitical_risk
from services.optimization_service import optimize_supply_chain
from services.scenario_service import run_scenario   # ⭐ NEW IMPORT

# ---------------------------------------------------------
# LOGGING
# ---------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------
# FASTAPI INIT
# ---------------------------------------------------------
app = FastAPI(
    title="AI-Driven Geo-Political and ESG-Aware Supply Chain Platform",
    version="1.0.0",
    description=(
        "Predict demand, evaluate ESG risk, analyze geopolitical news risk, "
        "and recommend optimal suppliers and routes."
    ),
)

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# STARTUP
# ---------------------------------------------------------
@app.on_event("startup")
def startup_event() -> None:
    """
    Warm up models and services on startup to reduce first-request latency.
    """
    train_or_load_model()

# ---------------------------------------------------------
# DEMAND FORECAST
# ---------------------------------------------------------
@app.get("/forecast-demand")
def forecast_demand():
    """
    Predict product demand using the ML model.
    """
    df = predict_demand()
    return {
        "items": df.to_dict(orient="records"),
        "count": len(df),
    }

# ---------------------------------------------------------
# ESG SCORES
# ---------------------------------------------------------
@app.get("/esg-score")
def esg_score():
    """
    Get ESG scores and supplier/company risk ranking.
    """
    df = compute_esg_scores()
    return {
        "items": df.to_dict(orient="records"),
        "count": len(df),
    }

# ---------------------------------------------------------
# GEO RISK
# ---------------------------------------------------------
@app.get("/geo-risk")
def geo_risk():
    """
    Analyze geopolitical risk using news + sentiment + caching.
    """
    try:
        data = analyze_geopolitical_risk()
        return {
            "items": data,
            "count": len(data),
        }
    except Exception as e:
        logger.error(f"Geo risk error: {e}", exc_info=True)
        return {
            "items": [],
            "count": 0,
            "error": str(e),
        }

# ---------------------------------------------------------
# SUPPLY CHAIN OPTIMIZATION
# ---------------------------------------------------------
@app.get("/optimize-supply-chain")
def optimize_supply_chain_endpoint():
    """
    Combine demand, ESG, and geopolitical risk
    to produce optimization recommendations.
    """
    try:
        logger.info("Optimize supply chain endpoint called")

        result = optimize_supply_chain()

        logger.info("Optimization completed successfully")
        return result

    except Exception as e:
        logger.error(f"Error in optimization: {e}", exc_info=True)
        return {
            "best_suppliers": [],
            "recommended_routes": [],
            "risk_summary": [],
            "message": f"Error during optimization: {str(e)}"
        }

# ---------------------------------------------------------
# SCENARIO INPUT MODEL
# ---------------------------------------------------------
class ScenarioRequest(BaseModel):
    demand_multiplier: float = 1.0
    fuel_cost_multiplier: float = 1.0
    excluded_regions: list[str] | None = None
    min_esg_score: float | None = None
    max_geo_risk: float | None = None


# ---------------------------------------------------------
# SCENARIO SIMULATION
# ---------------------------------------------------------
@app.post("/optimize-scenario")
def optimize_scenario(request: ScenarioRequest):
    """
    Run supply chain optimization under custom scenario conditions.
    """
    try:
        logger.info("Scenario optimization triggered")

        result = run_scenario(
            demand_multiplier=request.demand_multiplier,
            fuel_cost_multiplier=request.fuel_cost_multiplier,
            excluded_regions=request.excluded_regions,
            min_esg_score=request.min_esg_score,
            max_geo_risk=request.max_geo_risk
        )

        return result

    except Exception as e:
        logger.error(f"Scenario optimization error: {e}", exc_info=True)
        return {
            "baseline_results": {},
            "scenario_results": {},
            "message": f"Scenario simulation failed: {str(e)}"
        }

# ---------------------------------------------------------
# ROOT
# ---------------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "AI Supply Chain Platform API is running",
        "endpoints": [
            "/forecast-demand",
            "/esg-score",
            "/geo-risk",
            "/optimize-supply-chain",
            "/optimize-scenario",   # ⭐ NEW ENDPOINT
        ],
    }