from fastapi import APIRouter, Request, Response, Query
from app.core.config import settings

router = APIRouter()

@router.get("/whatsapp")
def verify_whatsapp_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
    hub_verify_token: str = Query(None, alias="hub.verify_token")
):
    if hub_mode == "subscribe" and hub_verify_token == settings.WHATSAPP_VERIFY_TOKEN:
        return Response(content=hub_challenge, media_type="text/plain")
    return Response(content="Verification failed", status_code=403)

@router.post("/whatsapp")
async def receive_whatsapp_message(request: Request):
    data = await request.json()
    # Process incoming farmer response: e.g. "ಸಿಂಪಡಿಸಿದ್ದೇನೆ" (Done) or photo upload
    return {"status": "RECEIVED", "processed": True}
