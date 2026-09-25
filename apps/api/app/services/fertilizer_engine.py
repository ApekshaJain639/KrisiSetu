import math
from typing import Dict
from app.schemas.crop_schemas import FertilizerSchedule, FertilizerSplit

class FertilizerEngine:
    @staticmethod
    def calculate_schedule(n_req_kg: float, p_req_kg: float, k_req_kg: float, acreage: float = 1.0) -> FertilizerSchedule:
        """
        Calculates exact commercial 50kg bag counts for Urea (46% N), DAP (18:46:0), and MOP (60% K).
        Takes into account the Nitrogen already provided by DAP.
        """
        total_p_needed = p_req_kg * acreage
        total_n_needed = n_req_kg * acreage
        total_k_needed = k_req_kg * acreage
        
        # 1. DAP satisfies Phosphorus first (46% P2O5)
        dap_kg = total_p_needed / 0.46
        dap_bags = round(dap_kg / 50.0, 1)
        
        # 2. Nitrogen supplied by DAP (18% N)
        n_supplied_by_dap = dap_kg * 0.18
        
        # 3. Remaining Nitrogen satisfied by Urea (46% N)
        n_remaining = max(0.0, total_n_needed - n_supplied_by_dap)
        urea_kg = n_remaining / 0.46
        urea_bags = round(urea_kg / 50.0, 1)
        
        # 4. MOP satisfies Potassium (60% K2O)
        mop_kg = total_k_needed / 0.60
        mop_bags = round(mop_kg / 50.0, 1)
        
        # 5. Split Application Schedule:
        # Basal: 100% DAP + 50% MOP + 25% Urea
        # Vegetative (30 DAS): 50% Urea + 25% MOP
        # Flowering / Panicle (60 DAS): 25% Urea + 25% MOP
        splits = {
            "DAP": FertilizerSplit(
                basal_bags=dap_bags,
                vegetative_30das_bags=0.0,
                flowering_60das_bags=0.0
            ),
            "Urea": FertilizerSplit(
                basal_bags=round(urea_bags * 0.25, 1),
                vegetative_30das_bags=round(urea_bags * 0.50, 1),
                flowering_60das_bags=round(urea_bags * 0.25, 1)
            ),
            "MOP": FertilizerSplit(
                basal_bags=round(mop_bags * 0.50, 1),
                vegetative_30das_bags=round(mop_bags * 0.25, 1),
                flowering_60das_bags=round(mop_bags * 0.25, 1)
            )
        }
        
        return FertilizerSchedule(
            urea_50kg_bags=urea_bags,
            dap_50kg_bags=dap_bags,
            mop_50kg_bags=mop_bags,
            splits=splits
        )

fertilizer_engine = FertilizerEngine()
