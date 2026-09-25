import json
from typing import Dict, Any
from app.services.mcda_engine import mcda_engine
from app.services.arbitrage_engine import arbitrage_engine
from app.services.seed_service import seed_service
from app.services.agromet_engine import agromet_engine
from app.services.fertilizer_engine import fertilizer_engine
from app.services.vision_pathology import vision_engine
from app.schemas.crop_schemas import CropRecommendationRequest
from app.schemas.market_schemas import ArbitrageRequest

AGENT_TOOLS_SCHEMA = [
    {
        "name": "recommend_crops",
        "description": "Recommends top crops using NPK, pH, soil texture, and acreage via TOPSIS MCDA",
        "parameters": {
            "type": "object",
            "properties": {
                "nitrogen": {"type": "number", "description": "Soil N in kg/ha"},
                "phosphorus": {"type": "number", "description": "Soil P in kg/ha"},
                "potassium": {"type": "number", "description": "Soil K in kg/ha"},
                "ph": {"type": "number", "description": "Soil pH 4.5-9.0"},
                "soil_texture": {"type": "string", "enum": ["Laterite", "Alluvial", "Clay Loam", "Black Cotton", "Sandy Loam"]},
                "acreage": {"type": "number", "default": 1.0}
            },
            "required": ["nitrogen", "phosphorus", "potassium", "ph", "soil_texture"]
        }
    },
    {
        "name": "get_market_forecast",
        "description": "Returns 90-day time-series price projections and Hold vs. Sell strategy",
        "parameters": {
            "type": "object",
            "properties": {
                "crop": {"type": "string", "default": "Arecanut"}
            },
            "required": ["crop"]
        }
    },
    {
        "name": "calculate_mandi_arbitrage",
        "description": "Calculates spatial road freight and net bonus profit across regional APMC mandis",
        "parameters": {
            "type": "object",
            "properties": {
                "crop": {"type": "string", "default": "Arecanut"},
                "quantity_quintals": {"type": "number", "default": 25.0}
            },
            "required": ["crop", "quantity_quintals"]
        }
    },
    {
        "name": "generate_agro_forecast",
        "description": "Fetches 14-day weather forecast, Koleroga 72h spore risk index, and foliar spraying window",
        "parameters": {
            "type": "object",
            "properties": {
                "lat": {"type": "number", "default": 13.0032},
                "lng": {"type": "number", "default": 75.2954}
            }
        }
    },
    {
        "name": "check_seed_bank_stock",
        "description": "Finds nearest RSK or KVK seed hubs with SATHI tags and 50% DBT subsidies",
        "parameters": {
            "type": "object",
            "properties": {
                "crop": {"type": "string", "default": "Arecanut"},
                "radius_km": {"type": "number", "default": 50.0}
            }
        }
    },
    {
        "name": "diagnose_crop_disease",
        "description": "Diagnoses leaf symptoms and gives chemical, traditional (Kotte Kattuva), and bio prescriptions",
        "parameters": {
            "type": "object",
            "properties": {
                "symptoms": {"type": "string", "description": "e.g., rotting fruit, water-soaked lesions"}
            },
            "required": ["symptoms"]
        }
    },
    {
        "name": "calculate_fertilizer_schedule",
        "description": "Computes exact commercial 50kg bag counts for Urea, DAP, and MOP",
        "parameters": {
            "type": "object",
            "properties": {
                "crop": {"type": "string", "default": "Arecanut"},
                "acreage": {"type": "number", "default": 1.0}
            },
            "required": ["crop"]
        }
    }
]

async def execute_tool(tool_name: str, args: Dict[str, Any]) -> Any:
    if tool_name == "recommend_crops":
        req = CropRecommendationRequest(
            nitrogen=args.get("nitrogen", 100),
            phosphorus=args.get("phosphorus", 40),
            potassium=args.get("potassium", 140),
            ph=args.get("ph", 5.8),
            soil_texture=args.get("soil_texture", "Laterite"),
            acreage=args.get("acreage", 1.0)
        )
        crops = mcda_engine.recommend(req)
        return [c.model_dump() for c in crops[:3]]

    elif tool_name == "get_market_forecast":
        res = arbitrage_engine.get_90day_forecast(args.get("crop", "Arecanut"))
        return res.model_dump()

    elif tool_name == "calculate_mandi_arbitrage":
        req = ArbitrageRequest(
            commodity=args.get("crop", "Arecanut"),
            quantity_quintals=args.get("quantity_quintals", 25.0)
        )
        res = arbitrage_engine.calculate_arbitrage(req)
        return res.model_dump()

    elif tool_name == "generate_agro_forecast":
        res = await agromet_engine.get_advisory(args.get("lat", 13.0032), args.get("lng", 75.2954))
        return res.model_dump()

    elif tool_name == "check_seed_bank_stock":
        res = seed_service.find_nearby_hubs(13.0032, 75.2954, args.get("radius_km", 50.0), args.get("crop"))
        return [h.model_dump() for h in res]

    elif tool_name == "diagnose_crop_disease":
        res = await vision_engine.diagnose_leaf(None, args.get("symptoms", "Arecanut"))
        return res.model_dump()

    elif tool_name == "calculate_fertilizer_schedule":
        # Standard arecanut NPK 100-40-140
        sched = fertilizer_engine.calculate_schedule(100, 40, 140, args.get("acreage", 1.0))
        return sched.model_dump()

    return {"error": f"Tool {tool_name} not found"}
