from pydantic import BaseModel
from typing import List, Dict, Optional

class CurrentWeatherReport(BaseModel):
    temperature_c: float
    apparent_temp_c: float
    relative_humidity_pct: int
    precipitation_mm: float
    rain_mm: float
    weather_code: int
    weather_description: str
    weather_description_kn: str
    wind_speed_kmh: float
    wind_direction_deg: int
    cloud_cover_pct: int
    surface_pressure_hpa: float
    is_day: bool
    source: str = "Open-Meteo API (WMO Standard)"
    updated_at: str

class DailyWeatherForecast(BaseModel):
    date: str
    max_temp_c: float
    min_temp_c: float
    rain_probability_pct: int
    rainfall_volume_mm: float
    wind_speed_kmh: float
    solar_radiation_mj: float
    et0_evapotranspiration_mm: float

class HazardGauge(BaseModel):
    name: str
    score_pct: float
    status: str # LOW, MODERATE, HIGH, SEVERE
    description: str

class WeatherAdvisoryResponse(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = "Puttur · Dakshina Kannada"
    current_weather: Optional[CurrentWeatherReport] = None
    hazard_gauges: Dict[str, HazardGauge]
    koleroga_72h_warning: bool
    koleroga_risk_description: str
    foliar_spraying_score_today: float
    best_spraying_hours: List[str]
    smart_irrigation_recommendation: str
    daily_forecasts: List[DailyWeatherForecast]
