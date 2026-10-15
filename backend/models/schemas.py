from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class OpportunityResponse(BaseModel):
    id: int
    title: str
    organizer: str
    description: str
    event_type: str
    topics: List[str]
    date: str
    start_time: Optional[str] = "09:00 AM"
    end_time: Optional[str] = "05:00 PM"
    location: str
    mode: str
    eligibility: str
    fee: int
    fee_display: str
    registration_deadline: str
    
    # Official URL architecture
    registration_url: Optional[str] = None
    official_website_url: Optional[str] = None
    source_url: Optional[str] = None
    source_name: str
    source_verified: bool = True
    data_mode: str = "demo"  # 'demo' or 'live'
    registration_status: str = "OPEN"  # OPEN, CLOSING_SOON, URGENT, LAST_CHANCE, CLOSED
    
    status: str
    is_demo: bool
    what_you_will_learn: List[str] = []
    skills_gained: List[str] = []
    career_areas: List[str] = []
    match_score: Optional[int] = None
    urgency_badge: Optional[str] = None
    urgency_text: Optional[str] = None
    urgency_rank: Optional[int] = None
    verdict: Optional[str] = None
    reasons: Optional[List[str]] = None
    why_attend_explanation: Optional[str] = None
    ratings: Optional[Dict[str, int]] = None
    is_saved: Optional[bool] = False
    is_user_registered: Optional[bool] = False
    user_opened_registration: Optional[bool] = False

    class Config:
        from_attributes = True

class OpportunityCreate(BaseModel):
    title: str
    organizer: str
    description: str
    event_type: str
    topics: List[str]
    date: str
    start_time: Optional[str] = "09:00 AM"
    end_time: Optional[str] = "05:00 PM"
    location: str
    mode: str = "Offline"
    eligibility: str = "Open to all engineering students"
    fee: int = 0
    registration_deadline: str
    registration_url: Optional[str] = None
    official_website_url: Optional[str] = None
    source_url: Optional[str] = None
    source_name: str = "Official Event Portal"
    source_verified: bool = True
    data_mode: str = "live"
    status: str = "Registration Open"
    what_you_will_learn: Optional[List[str]] = []
    skills_gained: Optional[List[str]] = []
    career_areas: Optional[List[str]] = []

class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    organizer: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    topics: Optional[List[str]] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    mode: Optional[str] = None
    eligibility: Optional[str] = None
    fee: Optional[int] = None
    registration_deadline: Optional[str] = None
    registration_url: Optional[str] = None
    official_website_url: Optional[str] = None
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    source_verified: Optional[bool] = None
    status: Optional[str] = None

class TrackRegistrationRequest(BaseModel):
    action_type: str = "PAGE_OPENED"  # "PAGE_OPENED" or "USER_MARKED_REGISTERED"

class TrackRegistrationResponse(BaseModel):
    status: str
    opportunity_id: int
    action_type: str
    clicked_at: datetime
    message: str

class UserProfileResponse(BaseModel):
    id: int
    name: str
    branch: str
    year: str
    college: str
    graduation_year: int
    interests: List[str]
    preferred_event_types: List[str]
    preferred_locations: List[str]
    budget_preference: str

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    college: Optional[str] = None
    graduation_year: Optional[int] = None
    interests: Optional[List[str]] = None
    preferred_event_types: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    budget_preference: Optional[str] = None

class SavedOpportunityCreate(BaseModel):
    opportunity_id: int
    reminder_days_before: Optional[int] = 3

class SavedOpportunityResponse(BaseModel):
    id: int
    opportunity_id: int
    reminder_days_before: int
    reminder_enabled: bool
    saved_at: datetime
    opportunity: Optional[OpportunityResponse] = None

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: int
    opportunity_id: Optional[int]
    title: str
    message: str
    notification_type: str
    urgency: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ChatQueryRequest(BaseModel):
    query: str

class ChatQueryResponse(BaseModel):
    reply: str
    opportunities: List[OpportunityResponse]
    extracted_entities: Dict[str, Any]
    ai_engine: str
    total_matches: int
    is_registration_query: Optional[bool] = False
