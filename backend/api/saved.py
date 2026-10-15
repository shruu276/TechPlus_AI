from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import SavedOpportunity, Opportunity, UserProfile, Notification
from backend.models.schemas import SavedOpportunityCreate, SavedOpportunityResponse
from backend.api.opportunities import serialize_opportunity

router = APIRouter(prefix="/api/saved", tags=["saved"])

@router.get("", response_model=List[SavedOpportunityResponse])
def get_saved_opportunities(db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    saved_items = db.query(SavedOpportunity).filter(SavedOpportunity.user_id == 1).order_by(SavedOpportunity.saved_at.desc()).all()

    results = []
    for s in saved_items:
        op = db.query(Opportunity).filter(Opportunity.id == s.opportunity_id).first()
        op_data = serialize_opportunity(op, profile, is_saved=True, db=db) if op else None
        results.append({
            "id": s.id,
            "opportunity_id": s.opportunity_id,
            "reminder_days_before": s.reminder_days_before,
            "reminder_enabled": s.reminder_enabled,
            "saved_at": s.saved_at,
            "opportunity": op_data
        })
    return results

@router.post("", response_model=SavedOpportunityResponse)
def save_opportunity(data: SavedOpportunityCreate, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    op = db.query(Opportunity).filter(Opportunity.id == data.opportunity_id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    existing = db.query(SavedOpportunity).filter(
        SavedOpportunity.user_id == 1,
        SavedOpportunity.opportunity_id == data.opportunity_id
    ).first()

    if existing:
        existing.reminder_days_before = data.reminder_days_before
        existing.reminder_enabled = True
        db.commit()
        db.refresh(existing)
        saved_obj = existing
    else:
        saved_obj = SavedOpportunity(
            user_id=1,
            opportunity_id=data.opportunity_id,
            reminder_days_before=data.reminder_days_before,
            reminder_enabled=True
        )
        db.add(saved_obj)
        db.commit()
        db.refresh(saved_obj)

    # Automatically create a confirmation notification in the notification center
    op_serialized = serialize_opportunity(op, profile, is_saved=True, db=db)
    days_before = data.reminder_days_before
    new_notif = Notification(
        user_id=1,
        opportunity_id=op.id,
        title=f"⏰ Reminder Set: {op.title[:45]}...",
        message=f"You will be alerted {days_before} day{'s' if days_before > 1 else ''} before registration closes. {op_serialized['urgency_badge']}: {op_serialized['urgency_text']}",
        notification_type="reminder_set",
        urgency="urgent" if op_serialized["urgency_rank"] in [1, 2] else "closing_soon",
        is_read=False
    )
    db.add(new_notif)
    db.commit()

    return {
        "id": saved_obj.id,
        "opportunity_id": saved_obj.opportunity_id,
        "reminder_days_before": saved_obj.reminder_days_before,
        "reminder_enabled": saved_obj.reminder_enabled,
        "saved_at": saved_obj.saved_at,
        "opportunity": op_serialized
    }

@router.delete("/{opportunity_id}")
def unsave_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    item = db.query(SavedOpportunity).filter(
        SavedOpportunity.user_id == 1,
        SavedOpportunity.opportunity_id == opportunity_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Saved item not found")
    db.delete(item)
    db.commit()
    return {"status": "removed", "opportunity_id": opportunity_id}

@router.put("/{opportunity_id}/reminder")
def update_reminder(opportunity_id: int, reminder_days_before: int, db: Session = Depends(get_db)):
    item = db.query(SavedOpportunity).filter(
        SavedOpportunity.user_id == 1,
        SavedOpportunity.opportunity_id == opportunity_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Saved item not found")
    item.reminder_days_before = reminder_days_before
    db.commit()
    return {"status": "updated", "reminder_days_before": reminder_days_before}
