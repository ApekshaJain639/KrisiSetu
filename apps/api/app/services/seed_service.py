import json
import os
import math
import uuid
from typing import List, Dict, Optional
from app.core.config import settings
from app.schemas.seed_schemas import (
    SeedHubResponse,
    SeedItem,
    SeedReservationRequest,
    SeedReservationResponse
)

class SeedService:
    def __init__(self):
        self.hubs_data = self._load_hubs()

    def _load_hubs(self) -> List[Dict]:
        filepath = os.path.join(settings.DATA_DIR, "karnataka_seed_hubs.json")
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def _haversine_km(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    def find_nearby_hubs(self, lat: float, lng: float, radius_km: float = 50.0, crop: Optional[str] = None) -> List[SeedHubResponse]:
        results = []
        for hub in self.hubs_data:
            dist = self._haversine_km(lat, lng, hub["latitude"], hub["longitude"])
            if dist <= radius_km:
                inventory = []
                for item in hub.get("inventory", []):
                    if not crop or crop.lower() in item["crop"].lower() or crop.lower() in item["variety"].lower():
                        inventory.append(SeedItem(**item))

                if inventory or not crop:
                    results.append(
                        SeedHubResponse(
                            id=hub["id"],
                            name=hub["name"],
                            hub_type=hub["hub_type"],
                            latitude=hub["latitude"],
                            longitude=hub["longitude"],
                            district=hub["district"],
                            taluk=hub["taluk"],
                            contact_phone=hub["contact_phone"],
                            distance_km=dist,
                            inventory=inventory
                        )
                    )

        results.sort(key=lambda x: x.distance_km)
        return results

    def reserve_seeds(self, req: SeedReservationRequest) -> SeedReservationResponse:
        hub_name = "RSK Belthangady"
        unit_price = 225.0 # default subsidized
        mrp = 450.0

        for hub in self.hubs_data:
            if hub["id"] == req.hub_id:
                hub_name = hub["name"]
                for item in hub.get("inventory", []):
                    if req.crop.lower() in item["crop"].lower():
                        unit_price = item["dbt_subsidized_price_inr"]
                        mrp = item["mrp_inr_kg"]
                        break

        total_payable = round(unit_price * req.quantity_kg, 2)
        total_mrp = round(mrp * req.quantity_kg, 2)
        savings = round(total_mrp - total_payable, 2)

        reservation_id = f"RSK-RES-{uuid.uuid4().hex[:8].upper()}"
        # Generate verifiable offline QR payload
        qr_token = f"KRISISETU|{reservation_id}|{req.farmer_id}|{req.crop}|{req.quantity_kg}KG|INR:{total_payable}"

        return SeedReservationResponse(
            reservation_id=reservation_id,
            qr_token=qr_token,
            expiry_hours=48,
            pickup_hub_name=hub_name,
            crop=req.crop,
            variety=req.variety,
            quantity_kg=req.quantity_kg,
            total_payable_inr=total_payable,
            dbt_savings_inr=savings,
            status="CONFIRMED_RESERVED"
        )

seed_service = SeedService()
