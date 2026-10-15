from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import UserProfile
from backend.models.schemas import ChatQueryRequest, ChatQueryResponse
from backend.ai.rag_service import process_rag_query

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("", response_model=ChatQueryResponse)
def handle_chat_message(request: ChatQueryRequest, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    result = process_rag_query(request.query, db, profile)
    return result
