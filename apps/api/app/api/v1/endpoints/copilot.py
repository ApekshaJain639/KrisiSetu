import httpx
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from app.core.config import settings
from app.services.agent_copilot import copilot

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    language: str = "kn"

class SarvamTTSRequest(BaseModel):
    text: str
    target_language_code: str = "kn-IN"
    speaker: str = "amol" # Natural Kannada voice
    pitch: float = 0.0
    pace: float = 1.0

@router.post("/chat-stream")
async def chat_copilot_stream(req: ChatRequest):
    return StreamingResponse(
        copilot.chat_stream(req.query, req.language),
        media_type="text/event-stream"
    )

@router.get("/sarvam-status")
def get_sarvam_status():
    """Returns Sarvam AI integration configuration & model status"""
    has_key = bool(settings.SARVAM_API_KEY)
    return {
        "engine": "Sarvam AI (India's Sovereign Voice AI)",
        "configured": has_key,
        "asr_model": "saarika:v2",
        "tts_model": "bulbul:v1",
        "primary_language": "kn-IN (Kannada)",
        "speakers": ["amol", "ananya"],
        "status": "READY" if has_key else "OPTIONAL_KEY_READY (Web Speech Fallback Active)",
        "portal_url": "https://console.sarvam.ai/"
    }

@router.post("/sarvam-stt")
async def sarvam_speech_to_text(
    file: UploadFile = File(...),
    language_code: str = Form("kn-IN"),
    model: str = Form("saarika:v2"),
    api_key: Optional[str] = Form(None)
):
    """
    Proxies speech-to-text request to Sarvam AI Saarika v2 ASR model.
    """
    key = api_key or settings.SARVAM_API_KEY
    if not key:
        raise HTTPException(
            status_code=400,
            detail="Sarvam AI API key is not configured. Set SARVAM_API_KEY or use Web Speech API."
        )

    file_bytes = await file.read()
    headers = {"api-subscription-key": key}
    files = {"file": (file.filename or "audio.wav", file_bytes, file.content_type or "audio/wav")}
    data = {"language_code": language_code, "model": model}

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post("https://api.sarvam.ai/speech-to-text", headers=headers, files=files, data=data)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.text)
            return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Sarvam AI ASR proxy error: {str(e)}")

@router.post("/sarvam-tts")
async def sarvam_text_to_speech(
    req: SarvamTTSRequest,
    api_key: Optional[str] = None
):
    """
    Proxies text-to-speech request to Sarvam AI Bulbul v1 TTS model.
    """
    key = api_key or settings.SARVAM_API_KEY
    if not key:
        raise HTTPException(
            status_code=400,
            detail="Sarvam AI API key is not configured. Set SARVAM_API_KEY or use Web Speech API."
        )

    headers = {
        "api-subscription-key": key,
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": [req.text],
        "target_language_code": req.target_language_code,
        "speaker": req.speaker,
        "pitch": req.pitch,
        "pace": req.pace,
        "loudness": 1.5,
        "model": "bulbul:v1"
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post("https://api.sarvam.ai/text-to-speech", headers=headers, json=payload)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.text)
            return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Sarvam AI TTS proxy error: {str(e)}")
