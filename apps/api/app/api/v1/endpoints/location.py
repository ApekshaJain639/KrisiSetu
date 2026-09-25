from fastapi import APIRouter, Query, UploadFile, File, Form, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import json
from app.core.database import get_db
from app.models.parcel import Parcel
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

@router.get("/soilgrids")
async def get_soilgrids_data(
    lat: float = Query(12.7687, description="Latitude (e.g. Ujire/Puttur)"),
    lng: float = Query(75.2071, description="Longitude")
):
    """Fetches modelled soil baseline properties at 250m resolution from ISRIC SoilGrids"""
    return await geo_engine.get_soilgrids_profile(lat, lng)

@router.get("/hydrogeology")
def get_hydrogeology_data(
    lat: float = Query(12.7687, description="Latitude"),
    lng: float = Query(75.2071, description="Longitude")
):
    """Fetches Central Ground Water Board (CGWB) aquifer stress and ICAR Zone XII telemetry"""
    return geo_engine.get_hydrogeology_telemetry(lat, lng)

@router.post("/ocr-rtc")
async def upload_rtc_document(
    file: Optional[UploadFile] = File(None),
    lat: float = Form(12.7687),
    lng: float = Form(75.2071),
    farmer_id: Optional[int] = Form(1),
    db: AsyncSession = Depends(get_db)
):
    """
    Uploads Karnataka RTC (Pahani) or e-Swathu document image, OCRs survey number,
    owner name, and area, auto-generates geodesic polygon boundary, and records parcel in DB.
    """
    file_bytes = await file.read() if file else b""
    filename = file.filename if file else "rtc_sample.jpg"

    result = await geo_engine.ocr_bhoomi_rtc(file_bytes, filename, lat, lng)

    # Persist or update parcel record in SQLite database
    new_parcel = Parcel(
        farmer_id=farmer_id or 1,
        parcel_name=f"Survey #{result.get('survey_no')} ({result.get('village')})",
        acreage=result.get("extracted_acreage", 4.2),
        soil_type=result.get("soil_classification", "Laterite / red coastal"),
        ph=5.8,
        nitrogen=115.0,
        phosphorus=42.0,
        potassium=138.0,
        primary_crop=result.get("crops_registered", "Arecanut + Pepper"),
        avg_ndvi=0.78,
        aquifer_stress="Safe (6.2m bgl)",
        geometry_geojson=json.dumps({
            "type": "Polygon",
            "coordinates": [result.get("boundary_polygon", [])]
        })
    )
    db.add(new_parcel)
    await db.commit()
    await db.refresh(new_parcel)

    result["saved_parcel_id"] = new_parcel.id
    return result
