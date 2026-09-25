from app.schemas.timeline_schemas import (
    TimelineEvaluationRequest,
    TimelineEvaluationResponse
)

class TimelineTracker:
    @staticmethod
    def evaluate_trajectory(req: TimelineEvaluationRequest) -> TimelineEvaluationResponse:
        """
        Computes delta severity: ΔSeverity = Followup_Severity - Initial_Severity.
        - Δ <= -5%: IMPROVING (Fungicide regimen active and effective)
        - -5% < Δ < +5%: STATIC / UNCERTAIN (Pathogen growth arrested, monitor 48h)
        - Δ >= +5%: WORSENING (Treatment failure or chemical resistance, escalate to KVK)
        """
        delta = round(req.followup_severity_pct - req.initial_severity_pct, 1)

        if delta <= -5.0:
            trajectory = "IMPROVING"
            advisory = "Treatment is actively working! Lesion area has reduced."
            action = "Continue the prescribed Bordeaux / bio-spray regimen for another 5 days. No chemical escalation required."
        elif delta >= 5.0:
            trajectory = "WORSENING"
            advisory = "Warning: Pathogen necrosis is spreading despite treatment!"
            action = "Switch chemical class immediately (Rotate to systemic fungicide: Dimethomorph + Mancozeb). Direct alert sent to KVK scientist."
        else:
            trajectory = "STATIC / UNCERTAIN"
            advisory = "Spore spread arrested, but no significant necrotic tissue regeneration yet."
            action = "Maintain observation. Repeat photo scan in 72 hours."

        return TimelineEvaluationResponse(
            initial_severity=req.initial_severity_pct,
            followup_severity=req.followup_severity_pct,
            delta_severity=delta,
            trajectory=trajectory,
            advisory_status=advisory,
            recommended_action=action
        )

timeline_tracker = TimelineTracker()
