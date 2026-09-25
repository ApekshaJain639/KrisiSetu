from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.geo_engine import geo_engine

router = APIRouter()

class AcreageRequest(BaseModel):
    coordinates: List[List[float]] # [[lng, lat], ...]

class ZoneDetectRequest(BaseModel):
    latitude: float
    longitude: float

class ReverseGeocodeRequest(BaseModel):
    latitude: float
    longitude: float

@router.post("/zone-detect")
def detect_agro_zone(req: ZoneDetectRequest):
    return geo_engine.detect_zone(req.latitude, req.longitude)

@router.post("/acreage")
def calculate_acreage(req: AcreageRequest):
    return geo_engine.calculate_acreage_from_polygon(req.coordinates)

@router.post("/reverse-geocode")
def reverse_geocode_post(req: ReverseGeocodeRequest):
    """Resolves latitude and longitude to Karnataka taluk, district, and agro-climatic zone"""
    return geo_engine.reverse_geocode(req.latitude, req.longitude)

@router.get("/reverse-geocode")
def reverse_geocode_get(
    lat: float = Query(12.7687, description="Latitude"),
    lng: float = Query(75.2071, description="Longitude")
):
    """Resolves GPS coordinates to Karnataka taluk, district, and agro-climatic zone"""
    return geo_engine.reverse_geocode(lat, lng)
