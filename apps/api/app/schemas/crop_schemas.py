from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class CropRecommendationRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=500, description="Soil Nitrogen (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=500, description="Soil Phosphorus (kg/ha)")
    potassium: float = Field(..., ge=0, le=500, description="Soil Potassium (kg/ha)")
    ph: float = Field(..., ge=4.0, le=9.5, description="Soil pH level (4.5 - 9.0)")
    soil_texture: str = Field(..., description="Alluvial, Black Cotton, Clay Loam, Laterite, Sandy Loam")
    acreage: float = Field(default=1.0, ge=0.1, description="Farm acreage in acres")
    latitude: Optional[float] = Field(default=13.00, description="Farm latitude")
    longitude: Optional[float] = Field(default=75.29, description="Farm longitude")

class FertilizerSplit(BaseModel):
    basal_bags: float
    vegetative_30das_bags: float
    flowering_60das_bags: float

class FertilizerSchedule(BaseModel):
    urea_50kg_bags: float
    dap_50kg_bags: float
    mop_50kg_bags: float
    splits: Dict[str, FertilizerSplit]

class CropMatchRadar(BaseModel):
    soil_affinity: float
    climate_match: float
    npk_affinity: float
    water_security: float

class EconomicsProjection(BaseModel):
    expected_yield_quintals: float
    gross_revenue_inr: float
    cultivation_cost_inr: float
    net_profit_inr: float
    roi_percentage: float

class RecommendedCrop(BaseModel):
    id: str
    crop_name: str
    scientific_name: str
    suitability_score: float
    match_radar: CropMatchRadar
    economics: EconomicsProjection
    sowing_season: str
    optimal_window: str
    recommended_varieties: List[str]
    companion_crops: List[str]
    fertilizer_schedule: FertilizerSchedule

class CropRecommendationResponse(BaseModel):
    crops: List[RecommendedCrop]
    detected_agro_climatic_zone: str
