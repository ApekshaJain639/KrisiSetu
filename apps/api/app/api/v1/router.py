from fastapi import APIRouter
from app.api.v1.endpoints import (
    crops,
    seeds,
    market,
    location,
    weather,
    pathology,
    timeline,
    copilot,
    iot,
    webhooks,
    admin,
    auth,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Farmer/Admin Login"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin & District Agriculture Officer Console"])
api_router.include_router(crops.router, prefix="/crops", tags=["Crop Recommendation (Module 1)"])
api_router.include_router(seeds.router, prefix="/seeds", tags=["Seed Bank & E-Bazaar (Module 2)"])
api_router.include_router(market.router, prefix="/market", tags=["Market Arbitrage & Pooling (Module 3)"])
api_router.include_router(location.router, prefix="/location", tags=["GPS Location Intelligence (Module 4)"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather Risk & Climate (Module 5)"])
api_router.include_router(copilot.router, prefix="/copilot", tags=["Kisan Mitra Copilot (Module 6)"])
api_router.include_router(pathology.router, prefix="/pathology", tags=["Leaf Pathology Lab"])
api_router.include_router(timeline.router, prefix="/timeline", tags=["Crop Health Timeline"])
api_router.include_router(iot.router, prefix="/iot", tags=["AIoT Smart Farming Hub"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["WhatsApp Accountability Engine"])
