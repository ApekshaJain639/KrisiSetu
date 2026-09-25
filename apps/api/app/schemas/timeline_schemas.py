from pydantic import BaseModel
from typing import Optional, List

class PathologyDiagnosisResponse(BaseModel):
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
