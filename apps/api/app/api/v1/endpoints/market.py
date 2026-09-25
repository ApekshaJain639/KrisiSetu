from fastapi import APIRouter, Query
from typing import Optional, Dict, Any
from app.schemas.market_schemas import (
    ArbitrageRequest,
    ArbitrageResponse,
    PriceForecastResponse,
    BatchPoolingCluster
)
from app.services.arbitrage_engine import arbitrage_engine
from app.services.dbscan_pooling import batch_pooler
from app.services.enam_market_service import enam_market_service

router = APIRouter()

@router.post("/arbitrage", response_model=ArbitrageResponse)
def calculate_spatial_arbitrage(req: ArbitrageRequest):
    return arbitrage_engine.calculate_arbitrage(req)

@router.get("/forecast-90d", response_model=PriceForecastResponse)
def get_price_forecast(commodity: str = Query("Arecanut")):
    return arbitrage_engine.get_90day_forecast(commodity)

@router.get("/batch-pool", response_model=BatchPoolingCluster)
def get_batch_pooling_cluster(
    lat: float = Query(13.0032),
    lng: float = Query(75.2954),
    crop: str = Query("Arecanut")
):
    return batch_pooler.find_or_create_cluster(lat, lng, crop)

@router.get("/live-enam")
async def get_live_enam_prices(commodity: Optional[str] = Query("All")):
    """
    Fetches real-time commodity prices from eNAM / data.gov.in Open Government Data API
    for Karnataka mandis (Puttur, Shivamogga, Sirsi, Mangaluru, etc.)
    """
    return await enam_market_service.get_live_market_rates(commodity)

@router.get("/ai-prediction")
def get_ai_price_prediction(
    commodity: str = Query("Arecanut"),
    current_price: float = Query(51200.0)
):
    """
    AI Predictive Modeling: generates 90-day seasonal price trajectories,
    hold-vs-sell recommendations, and confidence intervals.
    """
    return enam_market_service.predict_market_price(commodity, current_price)
