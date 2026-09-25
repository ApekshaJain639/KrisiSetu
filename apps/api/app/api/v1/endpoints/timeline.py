from fastapi import APIRouter
from app.schemas.timeline_schemas import TimelineEvaluationRequest, TimelineEvaluationResponse
from app.services.timeline_tracker import timeline_tracker

router = APIRouter()

@router.post("/evaluate-delta", response_model=TimelineEvaluationResponse)
def evaluate_crop_health_delta(req: TimelineEvaluationRequest):
    return timeline_tracker.evaluate_trajectory(req)
