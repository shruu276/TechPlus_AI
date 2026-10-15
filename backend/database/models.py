from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    organizer = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    event_type = Column(String(100), nullable=False)  # Workshop, Conference, Hackathon, Meetup, etc.
    topics = Column(Text, nullable=False, default="[]")  # JSON string array
    date = Column(String(50), nullable=False)  # e.g., "2026-10-25"
    start_time = Column(String(20), nullable=True, default="09:00 AM")
    end_time = Column(String(20), nullable=True, default="05:00 PM")
    location = Column(String(150), nullable=False)  # e.g., "Pune", "Online"
    mode = Column(String(50), nullable=False, default="Offline")  # Online, Offline, Hybrid
    eligibility = Column(String(255), nullable=False, default="Open to all engineering students")
    fee = Column(Integer, nullable=False, default=0)  # in INR, 0 is Free
    registration_deadline = Column(String(50), nullable=False)  # ISO string YYYY-MM-DDTHH:MM:SS
    
    # Official Registration & Source URLs (Separated & Verified)
    registration_url = Column(String(500), nullable=True) # Direct official registration form/portal
    official_website_url = Column(String(500), nullable=True) # Official event/organizer homepage
    source_url = Column(String(500), nullable=True) # Page from which information was obtained
    source_name = Column(String(150), nullable=False, default="Official Event Website")
    source_verified = Column(Boolean, nullable=False, default=True)
    data_mode = Column(String(20), nullable=False, default="demo") # "demo" or "live"
    registration_status = Column(String(50), nullable=False, default="OPEN") # OPEN, CLOSING_SOON, URGENT, LAST_CHANCE, CLOSED
    
    status = Column(String(50), nullable=False, default="Registration Open")
    is_demo = Column(Boolean, nullable=False, default=True)
    
    # Rich details
    what_you_will_learn = Column(Text, nullable=True, default="[]")  # JSON array
    skills_gained = Column(Text, nullable=True, default="[]")  # JSON array
    career_areas = Column(Text, nullable=True, default="[]")  # JSON array
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    saved_by = relationship("SavedOpportunity", back_populates="opportunity", cascade="all, delete-orphan")
    registration_actions = relationship("RegistrationTracking", back_populates="opportunity", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, default=1)
    name = Column(String(150), nullable=False, default="Aarav Sharma")
    branch = Column(String(150), nullable=False, default="Computer Engineering")
    year = Column(String(50), nullable=False, default="Third Year")
    college = Column(String(255), nullable=False, default="COEP Technological University, Pune")
    graduation_year = Column(Integer, nullable=False, default=2028)
    
    # Preferences (JSON string lists)
    interests = Column(Text, nullable=False, default='["Artificial Intelligence", "Robotics", "IoT", "Cloud Computing"]')
    preferred_event_types = Column(Text, nullable=False, default='["Workshops", "Hackathons", "Conferences", "Corporate events"]')
    preferred_locations = Column(Text, nullable=False, default='["Pune", "Online", "Maharashtra"]')
    budget_preference = Column(String(50), nullable=False, default="Under ₹1,000")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SavedOpportunity(Base):
    __tablename__ = "saved_opportunities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False, default=1)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=False)
    reminder_days_before = Column(Integer, nullable=False, default=3)  # 7, 3, or 1
    reminder_enabled = Column(Boolean, nullable=False, default=True)
    saved_at = Column(DateTime, default=datetime.utcnow)

    opportunity = relationship("Opportunity", back_populates="saved_by")


class RegistrationTracking(Base):
    __tablename__ = "registration_tracking"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False, default=1)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=False)
    action_type = Column(String(50), nullable=False) # "PAGE_OPENED" or "USER_MARKED_REGISTERED"
    clicked_at = Column(DateTime, default=datetime.utcnow)

    opportunity = relationship("Opportunity", back_populates="registration_actions")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False, default=1)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False, default="deadline_alert")
    urgency = Column(String(50), nullable=False, default="urgent")  # safe, closing_soon, urgent, last_chance
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class AppSettings(Base):
    __tablename__ = "app_settings"

    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False)
