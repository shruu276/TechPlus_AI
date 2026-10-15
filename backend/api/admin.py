import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from backend.database.connection import get_db
from backend.database.models import Opportunity, AppSettings, UserProfile, SavedOpportunity, Notification
from backend.models.schemas import OpportunityCreate, OpportunityUpdate
from backend.database.seed_data import seed_database
from backend.ingestion.event_ingester import run_ingestion_pipeline
from backend.ai.gemini_service import is_gemini_configured, get_gemini_api_key

router = APIRouter(prefix="/api/admin", tags=["admin"])

class ApiKeyUpdate(BaseModel):
    api_key: str

@router.post("/opportunities")
def create_opportunity(data: OpportunityCreate, db: Session = Depends(get_db)):
    op = Opportunity(
        title=data.title,
        organizer=data.organizer,
        description=data.description,
        event_type=data.event_type,
        topics=json.dumps(data.topics),
        date=data.date,
        start_time=data.start_time or "09:00 AM",
        end_time=data.end_time or "05:00 PM",
        location=data.location,
        mode=data.mode,
        eligibility=data.eligibility,
        fee=data.fee,
        registration_deadline=data.registration_deadline,
        registration_url=data.registration_url,
        source_url=data.source_url,
        source_name=data.source_name,
        status=data.status,
        is_demo=False,
        what_you_will_learn=json.dumps(data.what_you_will_learn or []),
        skills_gained=json.dumps(data.skills_gained or []),
        career_areas=json.dumps(data.career_areas or [])
    )
    db.add(op)
    db.commit()
    db.refresh(op)
    return {"status": "created", "id": op.id}

@router.put("/opportunities/{opportunity_id}")
def update_opportunity(opportunity_id: int, data: OpportunityUpdate, db: Session = Depends(get_db)):
    op = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    if data.title is not None:
        op.title = data.title
    if data.organizer is not None:
        op.organizer = data.organizer
    if data.description is not None:
        op.description = data.description
    if data.event_type is not None:
        op.event_type = data.event_type
    if data.topics is not None:
        op.topics = json.dumps(data.topics)
    if data.date is not None:
        op.date = data.date
    if data.start_time is not None:
        op.start_time = data.start_time
    if data.end_time is not None:
        op.end_time = data.end_time
    if data.location is not None:
        op.location = data.location
    if data.mode is not None:
        op.mode = data.mode
    if data.eligibility is not None:
        op.eligibility = data.eligibility
    if data.fee is not None:
        op.fee = data.fee
    if data.registration_deadline is not None:
        op.registration_deadline = data.registration_deadline
    if data.registration_url is not None:
        op.registration_url = data.registration_url
    if data.status is not None:
        op.status = data.status

    db.commit()
    return {"status": "updated", "id": op.id}

@router.delete("/opportunities/{opportunity_id}")
def delete_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    op = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    db.delete(op)
    db.commit()
    return {"status": "deleted", "id": opportunity_id}

@router.post("/opportunities/{opportunity_id}/close")
def mark_opportunity_closed(opportunity_id: int, db: Session = Depends(get_db)):
    op = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    op.status = "Registration Closed"
    db.commit()
    return {"status": "marked_closed", "id": op.id}

@router.post("/reset-demo-data")
def reset_demo_data(db: Session = Depends(get_db)):
    """
    Clears all opportunities and reseeds fresh demo data relative to current time.
    """
    db.query(SavedOpportunity).delete()
    db.query(Opportunity).delete()
    db.query(Notification).delete()
    db.commit()

    seed_database(db)
    count = db.query(Opportunity).count()
    return {"status": "success", "message": f"Successfully reseeded {count} demo opportunities"}

@router.post("/run-ingestion")
def trigger_ingestion(db: Session = Depends(get_db)):
    return run_ingestion_pipeline(db)

@router.get("/ai-status")
def get_ai_status(db: Session = Depends(get_db)):
    has_key = is_gemini_configured(db)
    active_key = get_gemini_api_key(db)
    masked_key = f"{active_key[:6]}...{active_key[-4:]}" if (active_key and len(active_key) > 10) else None

    return {
        "gemini_configured": has_key,
        "active_engine": "Google Gemini LLM" if has_key else "TechPulse Local AI Engine (Fallback Mode)",
        "masked_key": masked_key,
        "fallback_ready": True
    }

@router.post("/set-api-key")
def set_api_key(data: ApiKeyUpdate, db: Session = Depends(get_db)):
    setting = db.query(AppSettings).filter(AppSettings.key == "gemini_api_key").first()
    if setting:
        setting.value = data.api_key.strip()
    else:
        setting = AppSettings(key="gemini_api_key", value=data.api_key.strip())
        db.add(setting)
    db.commit()
    return {"status": "updated", "gemini_configured": bool(data.api_key.strip())}
