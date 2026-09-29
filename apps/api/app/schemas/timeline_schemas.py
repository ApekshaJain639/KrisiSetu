from pydantic import BaseModel
from typing import Optional, List

class PathologyDiagnosisResponse(BaseModel):
    is_valid_plant: bool = True
    detected_object: Optional[str] = "Plant / Agricultural Crop Leaf"
    rejection_reason: Optional[str] = None
    plant_probability_pct: Optional[float] = 96.0
    crop_name: str
    detected_disease: str
    confidence_pct: float
    severity_index_pct: float
    gradcam_heatmap_url: Optional[str] = None
    prescription_chemical: str
    prescription_traditional: str
    prescription_bio: str

class TimelineEvaluationRequest(BaseModel):
    initial_severity_pct: float
    followup_severity_pct: float
    days_elapsed: int

class TimelineEvaluationResponse(BaseModel):
    initial_severity: float
    followup_severity: float
    delta_severity: float
    trajectory: str # IMPROVING, STATIC, WORSENING
    advisory_status: str
    recommended_action: str
