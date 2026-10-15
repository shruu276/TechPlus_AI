from datetime import datetime
from typing import Dict, Any

def parse_deadline(deadline_str: str) -> datetime:
    try:
        if "T" in deadline_str:
            return datetime.fromisoformat(deadline_str)
        return datetime.strptime(deadline_str, "%Y-%m-%d")
    except Exception:
        return datetime.now()

def evaluate_deadline(deadline_str: str) -> Dict[str, Any]:
    deadline_dt = parse_deadline(deadline_str)
    now = datetime.now()
    diff = deadline_dt - now
    total_seconds = diff.total_seconds()

    if total_seconds <= 0:
        return {
            "days_remaining": 0,
            "hours_remaining": 0,
            "status_code": "CLOSED",
            "registration_status": "CLOSED",
            "badge_label": "⚫ REGISTRATION CLOSED",
            "badge_color": "gray",
            "urgency_text": "Registration deadline has passed.",
            "urgency_rank": 5,
            "is_open": False
        }

    days_remaining = total_seconds / 86400.0
    hours_remaining = total_seconds / 3600.0

    if days_remaining < 2.0:
        if hours_remaining <= 24:
            closing_msg = f"Registration closes today in {max(1, int(hours_remaining))} hours!"
        else:
            closing_msg = "Registration closes tomorrow at 11:59 PM."
        return {
            "days_remaining": round(days_remaining, 1),
            "hours_remaining": round(hours_remaining, 1),
            "status_code": "LAST_CHANCE",
            "registration_status": "LAST_CHANCE",
            "badge_label": "🔴 LAST CHANCE",
            "badge_color": "red",
            "urgency_text": closing_msg,
            "urgency_rank": 1,
            "is_open": True
        }
    elif days_remaining < 7.0:
        days_int = int(round(days_remaining))
        return {
            "days_remaining": round(days_remaining, 1),
            "hours_remaining": round(hours_remaining, 1),
            "status_code": "URGENT",
            "registration_status": "URGENT",
            "badge_label": "🟠 URGENT",
            "badge_color": "orange",
            "urgency_text": f"Registration closes in {days_int} days.",
            "urgency_rank": 2,
            "is_open": True
        }
    elif days_remaining <= 14.0:
        days_int = int(round(days_remaining))
        return {
            "days_remaining": round(days_remaining, 1),
            "hours_remaining": round(hours_remaining, 1),
            "status_code": "CLOSING_SOON",
            "registration_status": "CLOSING_SOON",
            "badge_label": "🟡 CLOSING SOON",
            "badge_color": "yellow",
            "urgency_text": f"Registration closes in {days_int} days.",
            "urgency_rank": 3,
            "is_open": True
        }
    else:
        days_int = int(round(days_remaining))
        return {
            "days_remaining": round(days_remaining, 1),
            "hours_remaining": round(hours_remaining, 1),
            "status_code": "SAFE",
            "registration_status": "OPEN",
            "badge_label": "🟢 SAFE",
            "badge_color": "green",
            "urgency_text": f"Registration closes in {days_int} days.",
            "urgency_rank": 4,
            "is_open": True
        }
