from fastapi import APIRouter, File, UploadFile, Form, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.scan_record import ScanRecord
from app.schemas.timeline_schemas import PathologyDiagnosisResponse
from app.services.vision_pathology import vision_engine

router = APIRouter()

@router.post("/diagnose")
async def diagnose_crop_leaf(
    file: Optional[UploadFile] = File(None),
    crop_hint: str = Form("Arecanut"),
    farmer_id: Optional[int] = Form(None),
    taluk: Optional[str] = Form("Puttur"),
    db: AsyncSession = Depends(get_db)
):
    image_bytes = await file.read() if file else None
    result = await vision_engine.diagnose_leaf(image_bytes, crop_hint)

    # Persist diagnosis in SQLite database
    scan = ScanRecord(
        farmer_id=farmer_id or 1,
        disease_name=result.detected_disease,
        pathogen="Phytophthora meadii" if "Koleroga" in result.detected_disease else "Crop Pathogen",
        confidence=result.confidence_pct,
        dsi_score=result.severity_index_pct,
        taluk=taluk or "Puttur",
        treatment_recommended=result.prescription_chemical,
        recovery_status="INITIAL_DETECTION"
    )
    db.add(scan)
    await db.commit()
    await db.refresh(scan)

    return {
        "scan_id": scan.id,
        "crop_name": result.crop_name,
        "detected_disease": result.detected_disease,
        "disease_name": result.detected_disease,
        "pathogen": scan.pathogen,
        "confidence_pct": result.confidence_pct,
        "confidence_score": round(result.confidence_pct / 100.0, 4),
        "severity_index_pct": result.severity_index_pct,
        "dsi_severity_score": round(result.severity_index_pct),
        "gradcam_heatmap_url": result.gradcam_heatmap_url or "/images/gradcam_sample_overlay.png",
        "prescription_chemical": result.prescription_chemical,
        "prescription_traditional": result.prescription_traditional,
        "prescription_bio": result.prescription_bio,
        "prescriptions": {
            "chemical": result.prescription_chemical,
            "traditional": result.prescription_traditional,
            "bio": result.prescription_bio,
        }
    }
