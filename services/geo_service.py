import os
import time
import random
from pathlib import Path
from collections import defaultdict
from typing import Dict, List

import requests
from dotenv import load_dotenv
from textblob import TextBlob


# ---------------------------------------------------------
# LOAD ENV
# ---------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

NEWSDATA_API_KEY = os.getenv("NEWSDATA_API_KEY")
NEWSDATA_ENDPOINT = "https://newsdata.io/api/1/news"

print("🔑 NewsData API Loaded:", NEWSDATA_API_KEY[:6] if NEWSDATA_API_KEY else "NOT FOUND")

# ---------------------------------------------------------
# COUNTRY CENTER COORDINATES (Extended Global Set)
# ---------------------------------------------------------
COUNTRY_COORDS = {
    "UNITED STATES OF AMERICA": (37.0902, -95.7129),
    "CANADA": (56.1304, -106.3468),
    "MEXICO": (23.6345, -102.5528),
    "BRAZIL": (-14.235, -51.9253),
    "ARGENTINA": (-38.4161, -63.6167),
    "UNITED KINGDOM": (55.3781, -3.4360),
    "FRANCE": (46.2276, 2.2137),
    "GERMANY": (51.1657, 10.4515),
    "ITALY": (41.8719, 12.5674),
    "SPAIN": (40.4637, -3.7492),
    "RUSSIA": (61.5240, 105.3188),
    "INDIA": (20.5937, 78.9629),
    "CHINA": (35.8617, 104.1954),
    "JAPAN": (36.2048, 138.2529),
    "SOUTH KOREA": (35.9078, 127.7669),
    "AUSTRALIA": (-25.2744, 133.7751),
    "SOUTH AFRICA": (-30.5595, 22.9375),
    "NIGERIA": (9.0820, 8.6753),
    "SAUDI ARABIA": (23.8859, 45.0792),
    "UAE": (23.4241, 53.8478),
    "INDONESIA": (-0.7893, 113.9213),
    "TURKEY": (38.9637, 35.2433),
    "IRAN": (32.4279, 53.6880),
    "ISRAEL": (31.0461, 34.8516),
    "UKRAINE": (48.3794, 31.1656),
    "POLAND": (51.9194, 19.1451),
    "SWEDEN": (60.1282, 18.6435),
    "NORWAY": (60.4720, 8.4689),
    "GLOBAL": (20.0, 0.0),
}


# ---------------------------------------------------------
# CACHE CONFIG
# ---------------------------------------------------------
CACHE_DURATION = 60 * 15
_geo_cache = {"timestamp": 0, "data": None}


# ---------------------------------------------------------
# MULTI-RISK QUERY ENGINE
# ---------------------------------------------------------
RISK_QUERIES = {
    "supply": "global supply chain disruption logistics delay",
    "war": "war conflict military tension country",
    "trade": "trade restriction tariff export import ban",
    "climate": "flood drought hurricane climate disaster",
    "energy": "oil gas energy crisis electricity shortage"
}


# ---------------------------------------------------------
# DEVELOPMENT FALLBACK DATA
# ---------------------------------------------------------
def generate_mock_geo_data():
    print("🧪 Using DEVELOPMENT fallback geo data")

    results = []

    for country, coords in COUNTRY_COORDS.items():
        if country == "GLOBAL":
            continue

        supply = round(random.uniform(0.2, 0.7), 3)
        war = round(random.uniform(0.1, 0.8), 3)
        trade = round(random.uniform(0.2, 0.6), 3)
        climate = round(random.uniform(0.1, 0.5), 3)
        energy = round(random.uniform(0.2, 0.7), 3)

        final_risk = round((supply + war + trade + climate + energy) / 5, 3)

        results.append({
            "country": country,
            "lat": coords[0],
            "lng": coords[1],
            "supply_risk": supply,
            "war_risk": war,
            "trade_risk": trade,
            "climate_risk": climate,
            "energy_risk": energy,
            "final_risk": final_risk,
            "risk_score": final_risk,
            "GeoRiskScore": final_risk
        })

    return results


# ---------------------------------------------------------
# FETCH NEWS
# ---------------------------------------------------------
def _fetch_news(query: str) -> List[dict]:
    try:
        params = {
            "apikey": NEWSDATA_API_KEY,
            "q": query,
            "language": "en",
        }

        print(f"🌍 Fetching news for: {query}")
        response = requests.get(NEWSDATA_ENDPOINT, params=params, timeout=15)
        response.raise_for_status()

        return response.json().get("results", [])

    except Exception as e:
        print("❌ NEWS API ERROR:", e)
        return []


def _sentiment_score(text: str) -> float:
    if not text:
        return 0.0
    return float(TextBlob(text).sentiment.polarity)


# ---------------------------------------------------------
# MAIN GEO ENGINE
# ---------------------------------------------------------
def analyze_geopolitical_risk() -> List[Dict]:

    global _geo_cache
    current_time = time.time()

    if (
        _geo_cache["data"] is not None
        and current_time - _geo_cache["timestamp"] < CACHE_DURATION
    ):
        print("⚡ Using cached geo risk data")
        return _geo_cache["data"]

    print("🧠 Running fresh geopolitical risk analysis...")

    country_risk_map: Dict[str, Dict[str, List[float]]] = defaultdict(lambda: defaultdict(list))

    for risk_type, query in RISK_QUERIES.items():
        articles = _fetch_news(query)

        for art in articles:
            country_data = art.get("country")

            if isinstance(country_data, list):
                country_list = country_data
            else:
                country_list = [country_data]

            for country in country_list:
                if not country:
                    country = "GLOBAL"

                country = country.upper()

                text = ". ".join(filter(None, [
                    art.get("title"),
                    art.get("description"),
                    art.get("content"),
                ]))

                sentiment = _sentiment_score(text)
                country_risk_map[country][risk_type].append(sentiment)

    # 🚨 FALLBACK IF API RETURNS NOTHING
    if len(country_risk_map) == 0:
        return generate_mock_geo_data()

    results = []

    for country, risks in country_risk_map.items():

        risk_scores = {}

        for rtype in RISK_QUERIES.keys():
            scores = risks.get(rtype, [])
            if scores:
                avg_sent = sum(scores) / len(scores)
                norm_sent = (avg_sent + 1) / 2
                risk_scores[rtype] = round(1 - norm_sent, 3)
            else:
                risk_scores[rtype] = 0.0

        final_risk = round(sum(risk_scores.values()) / len(risk_scores), 3)
        lat, lng = COUNTRY_COORDS.get(country, COUNTRY_COORDS["GLOBAL"])

        results.append({
            "country": country,
            "lat": lat,
            "lng": lng,
            "supply_risk": risk_scores["supply"],
            "war_risk": risk_scores["war"],
            "trade_risk": risk_scores["trade"],
            "climate_risk": risk_scores["climate"],
            "energy_risk": risk_scores["energy"],
            "final_risk": final_risk,
            "risk_score": final_risk,
            "GeoRiskScore": final_risk
        })

    results.sort(key=lambda x: x["final_risk"], reverse=True)

    _geo_cache["timestamp"] = current_time
    _geo_cache["data"] = results

    print("✅ Geo risk analysis complete & cached")

    return results