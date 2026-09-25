from fastapi import APIRouter, Query
from app.schemas.weather_schemas import WeatherAdvisoryResponse, CurrentWeatherReport
from app.services.agromet_engine import agromet_engine

router = APIRouter()

@router.get("/current", response_model=CurrentWeatherReport)
async def get_current_weather(
    lat: float = Query(12.7687, description="Latitude"),
    lng: float = Query(75.2071, description="Longitude")
):
    """Returns live Open-Meteo current weather report for specific GPS coordinates"""
    return await agromet_engine.get_current_weather(lat, lng)

@router.get("/advisory", response_model=WeatherAdvisoryResponse)
async def get_weather_advisory(
    lat: float = Query(12.7687, description="Latitude"),
    lng: float = Query(75.2071, description="Longitude")
):
    """Returns comprehensive agro-met risk advisory and 14-day forecasts from Open-Meteo"""
    return await agromet_engine.get_advisory(lat, lng)
