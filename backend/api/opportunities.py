import json
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import Opportunity, UserProfile, SavedOpportunity, RegistrationTracking
from backend.models.schemas import (
    OpportunityResponse, 
    TrackRegistrationRequest, 
    TrackRegistrationResponse
)
from backend.ai.matcher import calculate_match_score
from backend.ai.deadline_engine import evaluate_deadline
from backend.ingestion.event_ingester import run_ingestion_pipeline

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])

def serialize_opportunity(op: Opportunity, profile: UserProfile, is_saved: bool = False, db: Optional[Session] = None) -> dict:
    match_data = calculate_match_score(op, profile)
    dl = match_data["deadline_info"]

    topics = json.loads(op.topics) if isinstance(op.topics, str) else op.topics
    what_learn = json.loads(op.what_you_will_learn) if op.what_you_will_learn and isinstance(op.what_you_will_learn, str) else (op.what_you_will_learn or [])
    skills = json.loads(op.skills_gained) if op.skills_gained and isinstance(op.skills_gained, str) else (op.skills_gained or [])
    career = json.loads(op.career_areas) if op.career_areas and isinstance(op.career_areas, str) else (op.career_areas or [])

    # Registration tracking flags
    is_user_registered = False
    user_opened_reg = False
    if db:
        user_actions = db.query(RegistrationTracking).filter(
            RegistrationTracking.user_id == 1,
            RegistrationTracking.opportunity_id == op.id
        ).all()
        for a in user_actions:
            if a.action_type == "USER_MARKED_REGISTERED":
                is_user_registered = True
            elif a.action_type == "PAGE_OPENED":
                user_opened_reg = True

    return {
        "id": op.id,
        "title": op.title,
        "organizer": op.organizer,
        "description": op.description,
        "event_type": op.event_type,
        "topics": topics,
        "date": op.date,
        "start_time": op.start_time or "09:00 AM",
        "end_time": op.end_time or "05:00 PM",
        "location": op.location,
        "mode": op.mode,
        "eligibility": op.eligibility,
        "fee": op.fee,
        "fee_display": "Free" if op.fee == 0 else f"₹{op.fee}",
        "registration_deadline": op.registration_deadline,
        
        # Official URLs
        "registration_url": op.registration_url,
        "official_website_url": op.official_website_url,
        "source_url": op.source_url,
        "source_name": op.source_name,
        "source_verified": getattr(op, "source_verified", True),
        "data_mode": getattr(op, "data_mode", "demo"),
        "registration_status": dl.get("registration_status", "OPEN"),

        "status": op.status,
        "is_demo": getattr(op, "is_demo", True),
        "what_you_will_learn": what_learn,
        "skills_gained": skills,
        "career_areas": career,
        "match_score": match_data["match_score"],
        "urgency_badge": dl["badge_label"],
        "urgency_text": dl["urgency_text"],
        "urgency_rank": dl["urgency_rank"],
        "verdict": match_data["verdict"],
        "reasons": match_data["reasons"],
        "why_attend_explanation": match_data["why_attend_explanation"],
        "ratings": match_data["ratings"],
        "is_saved": is_saved,
        "is_user_registered": is_user_registered,
        "user_opened_registration": user_opened_reg
    }

@router.get("", response_model=List[OpportunityResponse])
def get_opportunities(
    topic: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    cost: Optional[str] = Query(None),  # 'free', 'paid'
    date_filter: Optional[str] = Query(None),  # 'today', 'this_week', 'this_month'
    status: Optional[str] = Query(None),  # 'open', 'closing_soon', 'urgent', 'closed'
    organizer: Optional[str] = Query(None),
    data_mode: Optional[str] = Query(None),  # 'all', 'live', 'demo'
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("match"),  # 'match', 'urgency', 'date', 'fee'
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    saved_ids = set(r.opportunity_id for r in db.query(SavedOpportunity.opportunity_id).filter(SavedOpportunity.user_id == 1).all())

    query = db.query(Opportunity)

    # Data Mode Filter (Section 10)
    if data_mode and data_mode.lower() != "all":
        if data_mode.lower() == "live":
            query = query.filter(Opportunity.data_mode == "live")
        elif data_mode.lower() == "demo":
            query = query.filter(Opportunity.data_mode == "demo")

    # Search filter
    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        query = query.filter(
            (Opportunity.title.ilike(term)) |
            (Opportunity.description.ilike(term)) |
            (Opportunity.organizer.ilike(term)) |
            (Opportunity.topics.ilike(term)) |
            (Opportunity.location.ilike(term))
        )

    # Event Type
    if event_type and event_type != "All":
        query = query.filter(Opportunity.event_type == event_type)

    # Cost
    if cost == "free":
        query = query.filter(Opportunity.fee == 0)
    elif cost == "paid":
        query = query.filter(Opportunity.fee > 0)

    # Location
    if location and location != "All":
        if location.lower() == "online":
            query = query.filter((Opportunity.location.ilike("%online%")) | (Opportunity.mode.ilike("%online%")))
        else:
            query = query.filter(Opportunity.location.ilike(f"%{location}%"))

    # Organizer
    if organizer and organizer != "All":
        query = query.filter(Opportunity.organizer.ilike(f"%{organizer}%"))

    results = query.all()
    serialized = []

    now = datetime.now()
    now_date = now.date()

    for op in results:
        is_saved = op.id in saved_ids
        data = serialize_opportunity(op, profile, is_saved, db)

        # Topic filter
        if topic and topic != "All":
            if not any(topic.lower() in t.lower() for t in data["topics"]):
                continue

        # Status filter
        if status and status != "All":
            u_rank = data["urgency_rank"]
            if status == "urgent" and u_rank not in [1, 2]:
                continue
            elif status == "closing_soon" and u_rank not in [1, 2, 3]:
                continue
            elif status == "open" and u_rank == 5:
                continue
            elif status == "closed" and u_rank != 5:
                continue

        # Date filter
        if date_filter and date_filter != "all":
            try:
                op_d = datetime.strptime(op.date, "%Y-%m-%d").date()
                if date_filter == "today" and op_d != now_date:
                    continue
                elif date_filter == "this_week" and not (now_date <= op_d <= now_date + timedelta(days=7)):
                    continue
                elif date_filter == "this_month" and not (now_date <= op_d <= now_date + timedelta(days=30)):
                    continue
            except Exception:
                pass

        serialized.append(data)

    # Sorting
    if sort_by == "urgency":
        serialized.sort(key=lambda x: (x["urgency_rank"], -x["match_score"]))
    elif sort_by == "date":
        serialized.sort(key=lambda x: x["date"])
    elif sort_by == "fee":
        serialized.sort(key=lambda x: x["fee"])
    else:  # match
        serialized.sort(key=lambda x: (-x["match_score"], x["urgency_rank"]))

    return serialized

@router.post("/{opportunity_id}/track-registration", response_model=TrackRegistrationResponse)
def track_registration_click(
    opportunity_id: int, 
    payload: TrackRegistrationRequest, 
    db: Session = Depends(get_db)
):
    """
    Section 18: Record registration click locally without assuming user successfully registered.
    """
    op = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    tracking = RegistrationTracking(
        user_id=1,
        opportunity_id=opportunity_id,
        action_type=payload.action_type
    )
    db.add(tracking)
    db.commit()

    return {
        "status": "success",
        "opportunity_id": opportunity_id,
        "action_type": payload.action_type,
        "clicked_at": tracking.clicked_at,
        "message": "Registration page opened. Complete your registration on the official website."
    }

@router.post("/{opportunity_id}/mark-registered")
def mark_user_registered(opportunity_id: int, db: Session = Depends(get_db)):
    """
    Section 19: Allows user to manually mark an opportunity as registered.
    """
    op = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    existing = db.query(RegistrationTracking).filter(
        RegistrationTracking.user_id == 1,
        RegistrationTracking.opportunity_id == opportunity_id,
        RegistrationTracking.action_type == "USER_MARKED_REGISTERED"
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "unmarked", "is_registered": False}
    else:
        new_mark = RegistrationTracking(
            user_id=1,
            opportunity_id=opportunity_id,
            action_type="USER_MARKED_REGISTERED"
        )
        db.add(new_mark)
        db.commit()
        return {"status": "marked", "is_registered": True}

@router.post("/live-search", response_model=List[OpportunityResponse])
def trigger_live_search(
    query: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Section 11: Live Search — runs ingestion from permitted/public sources,
    removes duplicates, and returns live opportunities with AI match scoring.
    """
    run_ingestion_pipeline(db)
    # Return live opportunities
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    saved_ids = set(r.opportunity_id for r in db.query(SavedOpportunity.opportunity_id).filter(SavedOpportunity.user_id == 1).all())
    
    live_ops = db.query(Opportunity).filter(Opportunity.data_mode == "live").all()
    results = [serialize_opportunity(op, profile, op.id in saved_ids, db) for op in live_ops]
    results.sort(key=lambda x: (-x["match_score"], x["urgency_rank"]))
    return results

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    ops = db.query(Opportunity).all()
    topics = set()
    types = set()
    locations = set()
    organizers = set()

    for op in ops:
        types.add(op.event_type)
        locations.add(op.location.split(",")[0].strip())
        organizers.add(op.organizer.split("&")[0].strip())
        try:
            t_list = json.loads(op.topics) if isinstance(op.topics, str) else op.topics
            for t in t_list:
                topics.add(t)
        except Exception:
            pass

    return {
        "topics": sorted(list(topics)),
        "event_types": sorted(list(types)),
        "locations": sorted(list(locations)),
        "organizers": sorted(list(organizers))
    }

@router.get("/{opportunity_id}", response_model=OpportunityResponse)
def get_opportunity_details(opportunity_id: int, db: Session = Depends(get_db)):
    op = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    is_saved = db.query(SavedOpportunity).filter(
        SavedOpportunity.user_id == 1,
        SavedOpportunity.opportunity_id == op.id
    ).first() is not None
    return serialize_opportunity(op, profile, is_saved, db)
