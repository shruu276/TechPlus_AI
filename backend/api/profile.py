import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import UserProfile
from backend.models.schemas import UserProfileResponse, UserProfileUpdate
from backend.database.seed_data import get_demo_student_profile

router = APIRouter(prefix="/api/profile", tags=["profile"])

def serialize_profile(profile: UserProfile) -> dict:
    return {
        "id": profile.id,
        "name": profile.name,
        "branch": profile.branch,
        "year": profile.year,
        "college": profile.college,
        "graduation_year": profile.graduation_year,
        "interests": json.loads(profile.interests) if isinstance(profile.interests, str) else profile.interests,
        "preferred_event_types": json.loads(profile.preferred_event_types) if isinstance(profile.preferred_event_types, str) else profile.preferred_event_types,
        "preferred_locations": json.loads(profile.preferred_locations) if isinstance(profile.preferred_locations, str) else profile.preferred_locations,
        "budget_preference": profile.budget_preference
    }

@router.get("", response_model=UserProfileResponse)
def get_user_profile(db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    if not profile:
        profile_data = get_demo_student_profile()
        profile = UserProfile(**profile_data)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return serialize_profile(profile)

@router.put("", response_model=UserProfileResponse)
def update_user_profile(data: UserProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    if not profile:
        profile = UserProfile(id=1)
        db.add(profile)

    if data.name is not None:
        profile.name = data.name
    if data.branch is not None:
        profile.branch = data.branch
    if data.year is not None:
        profile.year = data.year
    if data.college is not None:
        profile.college = data.college
    if data.graduation_year is not None:
        profile.graduation_year = data.graduation_year
    if data.interests is not None:
        profile.interests = json.dumps(data.interests)
    if data.preferred_event_types is not None:
        profile.preferred_event_types = json.dumps(data.preferred_event_types)
    if data.preferred_locations is not None:
        profile.preferred_locations = json.dumps(data.preferred_locations)
    if data.budget_preference is not None:
        profile.budget_preference = data.budget_preference

    db.commit()
    db.refresh(profile)
    return serialize_profile(profile)

@router.post("/reset-cie-demo", response_model=UserProfileResponse)
def reset_cie_demo_profile(db: Session = Depends(get_db)):
    """
    Instantly resets the profile to the exact CIE-3 benchmark profile:
    Computer Engineering | Third Year | AI + Robotics + IoT + Cloud | Pune + Online
    """
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    demo_data = get_demo_student_profile()
    if profile:
        for k, v in demo_data.items():
            setattr(profile, k, v)
    else:
        profile = UserProfile(**demo_data)
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return serialize_profile(profile)
