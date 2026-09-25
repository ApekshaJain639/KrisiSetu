import json
import os
import math
from typing import Dict, Any, List
from shapely.geometry import shape, Point, Polygon
from app.core.config import settings

class GeoEngine:
    REGIONAL_CENTROIDS = {
        "Puttur": {"lat": 12.7661, "lng": 75.2014, "district": "Dakshina Kannada", "kannada": "ಪುತ್ತೂರು"},
        "Belthangady": {"lat": 13.0032, "lng": 75.2954, "district": "Dakshina Kannada", "kannada": "ಬೆಳ್ತಂಗಡಿ"},
        "Ujire": {"lat": 12.9890, "lng": 75.3280, "district": "Dakshina Kannada", "kannada": "ಉಜಿರೆ"},
        "Sullia": {"lat": 12.5600, "lng": 75.3888, "district": "Dakshina Kannada", "kannada": "ಸುಳ್ಯ"},
        "Bantwal": {"lat": 12.8906, "lng": 75.0345, "district": "Dakshina Kannada", "kannada": "ಬಂಟ್ವಾಳ"},
        "Mangaluru": {"lat": 12.9141, "lng": 74.8560, "district": "Dakshina Kannada", "kannada": "ಮಂಗಳೂರು"},
        "Moodabidri": {"lat": 13.0722, "lng": 74.9972, "district": "Dakshina Kannada", "kannada": "ಮೂಡುಬಿದಿರೆ"},
        "Kadaba": {"lat": 12.7842, "lng": 75.4332, "district": "Dakshina Kannada", "kannada": "ಕಡಬ"},
        "Karkala": {"lat": 13.2144, "lng": 74.9961, "district": "Udupi", "kannada": "ಕಾರ್ಕಳ"},
        "Udupi": {"lat": 13.3409, "lng": 74.7421, "district": "Udupi", "kannada": "ಉಡುಪಿ"},
        "Kundapura": {"lat": 13.6267, "lng": 74.6938, "district": "Udupi", "kannada": "ಕುಂದಾಪುರ"},
        "Sirsi": {"lat": 14.6195, "lng": 74.8354, "district": "Uttara Kannada", "kannada": "ಶಿರಸಿ"},
        "Shivamogga": {"lat": 13.9299, "lng": 75.5681, "district": "Shivamogga", "kannada": "ಶಿವಮೊಗ್ಗ"},
        "Madikeri": {"lat": 12.4244, "lng": 75.7382, "district": "Kodagu", "kannada": "ಮಡಿಕೇರಿ"},
    }

    def __init__(self):
        self.zones_geojson = self._load_zones()

    def _load_zones(self) -> Dict[str, Any]:
        filepath = os.path.join(settings.DATA_DIR, "icar_zones.geojson")
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"features": []}

    def _haversine_km(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    def reverse_geocode(self, lat: float, lng: float) -> Dict[str, Any]:
        """Finds closest Karnataka agricultural taluk and district from GPS coords"""
        closest_taluk = "Puttur"
        min_dist = float("inf")
        meta = self.REGIONAL_CENTROIDS["Puttur"]

        for name, data in self.REGIONAL_CENTROIDS.items():
            dist = self._haversine_km(lat, lng, data["lat"], data["lng"])
            if dist < min_dist:
                min_dist = dist
                closest_taluk = name
                meta = data

        zone = self.detect_zone(lat, lng)

        return {
            "latitude": lat,
            "longitude": lng,
            "taluk": closest_taluk,
            "taluk_kn": meta["kannada"],
            "district": meta["district"],
            "formatted_location": f"{closest_taluk} · {meta['district']}",
            "formatted_location_kn": f"{meta['kannada']} · {meta['district']}",
            "distance_to_taluk_km": min_dist,
            "agro_climatic_zone": zone.get("zone_name", "West Coast Plains and Ghats Region"),
            "source": "KrishiSetu Regional Geocoder"
        }

    def detect_zone(self, lat: float, lng: float) -> Dict[str, Any]:
        pt = Point(lng, lat)
        for feature in self.zones_geojson.get("features", []):
            try:
                poly = shape(feature["geometry"])
                if poly.contains(pt):
                    return feature["properties"]
            except Exception:
                continue

        # Default fallback for Coastal Karnataka / Western Ghats if outside exact boundary
        return {
            "zone_no": 12,
            "zone_name": "West Coast Plains and Ghats Region",
            "states": "Karnataka (Coastal & Malnad - Dakshina Kannada, Udupi, Uttara Kannada), Kerala, Goa",
            "climate": "Humid to per-humid tropical, heavy monsoon rainfall (2000-3500mm)",
            "soil": "Laterite, red loam, coastal alluvium"
        }

    def calculate_acreage_from_polygon(self, coordinates: List[List[float]]) -> Dict[str, float]:
        if len(coordinates) < 3:
            return {"acres": 1.0, "hectares": 0.405, "perimeter_m": 250.0}

        poly = Polygon(coordinates)
        area_deg = poly.area
        area_m2 = area_deg * (111000 * 111000 * 0.97)
        acres = round(area_m2 / 4046.86, 2)
        hectares = round(acres * 0.404686, 2)
        perimeter_m = round(poly.length * 111000, 1)

        return {
            "acres": max(0.1, acres),
            "hectares": max(0.04, hectares),
            "perimeter_m": perimeter_m
        }

geo_engine = GeoEngine()
