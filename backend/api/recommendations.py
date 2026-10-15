from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import Opportunity, UserProfile, SavedOpportunity
from backend.models.schemas import OpportunityResponse
from backend.api.opportunities import serialize_opportunity

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

@router.get("", response_model=List[OpportunityResponse])
def get_recommendations(db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    saved_ids = set(r.opportunity_id for r in db.query(SavedOpportunity.opportunity_id).filter(SavedOpportunity.user_id == 1).all())
    ops = db.query(Opportunity).all()

    results = []
    for op in ops:
        is_saved = op.id in saved_ids
        data = serialize_opportunity(op, profile, is_saved, db=db)
        # Only recommend open opportunities by default
        if data["urgency_rank"] != 5:
            results.append(data)

    # Sort by match score descending
    results.sort(key=lambda x: (-x["match_score"], x["urgency_rank"]))
    return results

@router.get("/dont-miss", response_model=List[OpportunityResponse])
def get_dont_miss_opportunities(db: Session = Depends(get_db)):
    """
    Opportunities where Match Score > 75% AND registration is closing soon (rank 1, 2, or 3).
    """
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    saved_ids = set(r.opportunity_id for r in db.query(SavedOpportunity.opportunity_id).filter(SavedOpportunity.user_id == 1).all())
    ops = db.query(Opportunity).all()

    urgent_high_match = []
    for op in ops:
        is_saved = op.id in saved_ids
        data = serialize_opportunity(op, profile, is_saved, db=db)
        if data["match_score"] >= 75 and data["urgency_rank"] in [1, 2, 3]:
            urgent_high_match.append(data)

    # Sort primarily by urgency rank, then by match score
    urgent_high_match.sort(key=lambda x: (x["urgency_rank"], -x["match_score"]))
    return urgent_high_match

@router.get("/closing-soon", response_model=List[OpportunityResponse])
def get_closing_soon_opportunities(db: Session = Depends(get_db)):
    """
    All active opportunities sorted strictly by deadline urgency.
    """
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    saved_ids = set(r.opportunity_id for r in db.query(SavedOpportunity.opportunity_id).filter(SavedOpportunity.user_id == 1).all())
    ops = db.query(Opportunity).all()

    closing_soon = []
    for op in ops:
        is_saved = op.id in saved_ids
        data = serialize_opportunity(op, profile, is_saved, db=db)
        if data["urgency_rank"] in [1, 2, 3]:
            closing_soon.append(data)

    closing_soon.sort(key=lambda x: (x["urgency_rank"], -x["match_score"]))
    return closing_soon
