# app/routes/chat_routes.py
from fastapi import APIRouter, HTTPException
from app.models.chat_model import ChatRequest, ChatResponse
from app.services.chat_services import generate_response_from_model

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        ai_response = generate_response_from_model(req.message)
        return ChatResponse(message=req.message, response=ai_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
