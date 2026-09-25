import json
import os
import math
import numpy as np
from typing import List, Dict, Tuple
from app.core.config import settings
from app.schemas.crop_schemas import (
    CropRecommendationRequest,
    RecommendedCrop,
    CropMatchRadar,
    EconomicsProjection
)
from app.services.fertilizer_engine import fertilizer_engine

class MCDAEngine:
    def __init__(self):
        self.crops_data = self._load_crop_benchmarks()

    def _load_crop_benchmarks(self) -> List[Dict]:
        filepath = os.path.join(settings.DATA_DIR, "crop_benchmarks.json")
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def recommend(self, req: CropRecommendationRequest) -> List[RecommendedCrop]:
        if not self.crops_data:
            return []

        results = []

        for crop in self.crops_data:
            # 1. Soil Affinity (pH and Texture compatibility)
            ph_min = crop.get("ph_min", 5.5)
            ph_max = crop.get("ph_max", 7.5)
            if ph_min <= req.ph <= ph_max:
                ph_score = 100.0
            else:
                ph_diff = min(abs(req.ph - ph_min), abs(req.ph - ph_max))
                ph_score = max(0.0, 100.0 - (ph_diff * 35.0))

            textures = [t.lower() for t in crop.get("soil_textures", [])]
            texture_score = 100.0 if req.soil_texture.lower() in textures else 45.0
            soil_affinity = round((ph_score * 0.5) + (texture_score * 0.5), 1)

            # 2. NPK Affinity (Normalized Distance)
            opt_n = crop.get("optimal_n_kg_ha", 100)
            opt_p = crop.get("optimal_p_kg_ha", 50)
            opt_k = crop.get("optimal_k_kg_ha", 50)

            n_dev = min(1.0, abs(req.nitrogen - opt_n) / max(opt_n, 1))
            p_dev = min(1.0, abs(req.phosphorus - opt_p) / max(opt_p, 1))
            k_dev = min(1.0, abs(req.potassium - opt_k) / max(opt_k, 1))

            npk_affinity = round(max(10.0, 100.0 - ((n_dev * 0.35 + p_dev * 0.35 + k_dev * 0.30) * 100.0)), 1)

            # 3. Climate Match (Default baseline for coastal/peninsular region)
            climate_match = 92.0 if "Laterite" in crop.get("soil_textures", []) or "Clay Loam" in crop.get("soil_textures", []) else 78.0

            # 4. Water Security
            water_security = 88.0

            # Composite TOPSIS Suitability Score (0 - 100)
            suitability_score = round(
                (soil_affinity * 0.30) + (npk_affinity * 0.35) + (climate_match * 0.20) + (water_security * 0.15),
                1
            )

            # Economics Projections
            expected_yield = round(crop.get("expected_yield_qtl_acre", 15.0) * req.acreage, 1)
            cost = round(crop.get("cost_per_acre_inr", 25000) * req.acreage, 2)
            price_qtl = crop.get("avg_market_price_qtl", 2500)
            gross_revenue = round(expected_yield * price_qtl, 2)
            net_profit = round(gross_revenue - cost, 2)
            roi = round((net_profit / cost) * 100.0, 1) if cost > 0 else 0.0

            # Commercial Bag Calculations
            schedule = fertilizer_engine.calculate_schedule(
                opt_n, opt_p, opt_k, req.acreage
            )

            results.append(
                RecommendedCrop(
                    id=crop["id"],
                    crop_name=crop["crop_name"],
                    scientific_name=crop["scientific_name"],
                    suitability_score=suitability_score,
                    match_radar=CropMatchRadar(
                        soil_affinity=soil_affinity,
                        climate_match=climate_match,
                        npk_affinity=npk_affinity,
                        water_security=water_security
                    ),
                    economics=EconomicsProjection(
                        expected_yield_quintals=expected_yield,
                        gross_revenue_inr=gross_revenue,
                        cultivation_cost_inr=cost,
                        net_profit_inr=net_profit,
                        roi_percentage=roi
                    ),
                    sowing_season=crop.get("sowing_season", "Kharif"),
                    optimal_window="June 15 - July 10 (Earliest: June 01, Cut-off: July 25)",
                    recommended_varieties=crop.get("recommended_varieties", []),
                    companion_crops=crop.get("companion_crops", []),
                    fertilizer_schedule=schedule
                )
            )

        # Rank by suitability score descending
        results.sort(key=lambda x: x.suitability_score, reverse=True)
        return results

mcda_engine = MCDAEngine()
