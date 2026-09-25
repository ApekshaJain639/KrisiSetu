from fastapi import APIRouter
from app.schemas.crop_schemas import CropRecommendationRequest, CropRecommendationResponse
from app.services.mcda_engine import mcda_engine
from app.services.geo_engine import geo_engine

router = APIRouter()

@router.post("/recommend", response_model=CropRecommendationResponse)
def get_crop_recommendations(req: CropRecommendationRequest):
    crops = mcda_engine.recommend(req)
    zone_info = geo_engine.detect_zone(req.latitude or 13.0, req.longitude or 75.29)
    return CropRecommendationResponse(
        crops=crops,
        detected_agro_climatic_zone=zone_info.get("zone_name", "West Coast Plains and Ghats Region")
    )
