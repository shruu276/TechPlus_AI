import json
import re
from typing import Dict, List, Any
from backend.ai.deadline_engine import evaluate_deadline

# Branch-topic relevance affinity matrix
BRANCH_AFFINITIES = {
    "Computer Engineering": [
        "artificial intelligence", "machine learning", "data science", "web development",
        "app development", "cloud computing", "cybersecurity", "blockchain", "devops",
        "software development", "iot", "robotics"
    ],
    "Information Technology": [
        "web development", "cloud computing", "cybersecurity", "devops", "software development",
        "data science", "machine learning", "artificial intelligence", "blockchain"
    ],
    "Electronics & Telecommunication": [
        "iot", "robotics", "embedded systems", "drones", "electronics", "edge ai", "vlsi",
        "cybersecurity", "software development"
    ],
    "Mechanical Engineering": [
        "robotics", "drones", "iot", "sustainability", "embedded systems", "manufacturing"
    ],
    "Electrical Engineering": [
        "iot", "electronics", "sustainability", "embedded systems", "robotics"
    ]
}

def normalize(text: str) -> str:
    return re.sub(r'[^a-zA-Z0-9\s]', '', text.lower()).strip()

def calculate_match_score(opportunity: Any, user_profile: Any) -> Dict[str, Any]:
    """
    Computes a comprehensive AI match score (0-100), reasons, 5-star ratings,
    and personalized 'Why TechPulse recommends this' explanation.
    """
    # Parse opportunity fields
    op_title = opportunity.title
    op_desc = opportunity.description
    op_type = opportunity.event_type
    op_location = opportunity.location
    op_mode = opportunity.mode
    op_fee = opportunity.fee
    op_eligibility = opportunity.eligibility
    op_deadline = opportunity.registration_deadline

    try:
        op_topics = json.loads(opportunity.topics) if isinstance(opportunity.topics, str) else opportunity.topics
    except Exception:
        op_topics = []

    # Parse profile fields
    user_branch = getattr(user_profile, "branch", "Computer Engineering")
    user_year = getattr(user_profile, "year", "Third Year")
    budget_pref = getattr(user_profile, "budget_preference", "Under ₹1,000")

    try:
        user_interests = json.loads(user_profile.interests) if isinstance(user_profile.interests, str) else user_profile.interests
    except Exception:
        user_interests = ["Artificial Intelligence", "Robotics", "IoT", "Cloud Computing"]

    try:
        user_event_types = json.loads(user_profile.preferred_event_types) if isinstance(user_profile.preferred_event_types, str) else user_profile.preferred_event_types
    except Exception:
        user_event_types = ["Workshops", "Hackathons", "Conferences"]

    try:
        user_locations = json.loads(user_profile.preferred_locations) if isinstance(user_profile.preferred_locations, str) else user_profile.preferred_locations
    except Exception:
        user_locations = ["Pune", "Online"]

    score = 0.0
    max_score = 100.0
    reasons = []

    # 1. Technical Interests Match (Max 35 points)
    matched_interests = []
    text_corpus = f"{op_title} {op_desc} {' '.join(op_topics)}".lower()
    
    for interest in user_interests:
        norm_interest = interest.lower()
        # Direct topic match or in text
        if any(norm_interest in t.lower() or t.lower() in norm_interest for t in op_topics):
            matched_interests.append(interest)
        elif norm_interest in text_corpus:
            matched_interests.append(interest)

    if matched_interests:
        interest_ratio = min(1.0, len(matched_interests) / max(1, min(len(user_interests), 3)))
        interest_pts = 35.0 * interest_ratio
        score += interest_pts
        joined_interests = ", ".join(matched_interests[:3])
        reasons.append(f"Strong match for your technical interests in {joined_interests}")
    else:
        # Check partial branch-affinity match
        branch_matches = [t for t in op_topics if any(t.lower() in aff for aff in BRANCH_AFFINITIES.get(user_branch, []))]
        if branch_matches:
            score += 15.0
            reasons.append(f"Aligns with core {user_branch} foundational disciplines")

    # 2. Branch & Year Eligibility (Max 20 points)
    branch_norm = user_branch.lower()
    elig_norm = op_eligibility.lower()
    year_norm = user_year.lower()

    branch_eligible = any(w in elig_norm for w in ["all", "computer", "engineering", "b.tech", "undergraduate", "students"]) or (branch_norm in elig_norm)
    year_eligible = any(w in elig_norm for w in ["all", "3rd", "third", "prefinal", "undergraduate"]) or (year_norm in elig_norm)

    if branch_eligible and year_eligible:
        score += 20.0
        reasons.append(f"Ideal fit for {user_year} {user_branch} students")
    elif branch_eligible or year_eligible:
        score += 14.0
        reasons.append(f"Open to students from {user_branch}")
    else:
        score += 8.0

    # 3. Location & Mode Match (Max 15 points)
    location_matched = False
    if op_mode.lower() == "online" or "online" in [loc.lower() for loc in user_locations]:
        if op_mode.lower() == "online":
            score += 15.0
            location_matched = True
            reasons.append("100% Online mode — accessible from anywhere")

    if not location_matched:
        for pref_loc in user_locations:
            if pref_loc.lower() in op_location.lower() or op_location.lower() in pref_loc.lower():
                score += 15.0
                location_matched = True
                reasons.append(f"Located in your preferred hub ({op_location})")
                break

    if not location_matched:
        if "maharashtra" in [loc.lower() for loc in user_locations] and any(city in op_location.lower() for city in ["pune", "mumbai", "nashik", "maharashtra"]):
            score += 12.0
            reasons.append(f"Convenient Maharashtra regional event ({op_location})")
        else:
            score += 6.0

    # 4. Event Type Preference (Max 10 points)
    type_matched = False
    for pref_type in user_event_types:
        # Match "Workshops" to "Workshop", "Hackathons" to "Hackathon"
        if pref_type.lower().rstrip('s') in op_type.lower() or op_type.lower() in pref_type.lower():
            score += 10.0
            type_matched = True
            reasons.append(f"Matches your target event format ({op_type})")
            break

    if not type_matched:
        score += 5.0

    # 5. Cost & Budget Compatibility (Max 10 points)
    if op_fee == 0:
        score += 10.0
        reasons.append("Zero registration fee (Free opportunity)")
    else:
        budget_limit = 99999
        if "500" in budget_pref:
            budget_limit = 500
        elif "1,000" in budget_pref or "1000" in budget_pref:
            budget_limit = 1000
        elif "2,500" in budget_pref or "2500" in budget_pref:
            budget_limit = 2500

        if op_fee <= budget_limit:
            score += 10.0
            reasons.append(f"Within your budget preference (₹{op_fee} ≤ {budget_pref})")
        else:
            score += 4.0

    # 6. Deadline Urgency & Status Check (Max 10 points)
    deadline_info = evaluate_deadline(op_deadline)
    if not deadline_info["is_open"]:
        score = min(score * 0.4, 45.0)  # Heavy penalty for closed registrations
        reasons.append("⚠️ Registration is currently closed")
    else:
        if deadline_info["status_code"] in ["LAST_CHANCE", "URGENT"]:
            score += 10.0
            reasons.append(f"Time-sensitive: {deadline_info['urgency_text']}")
        elif deadline_info["status_code"] == "CLOSING_SOON":
            score += 8.0
            reasons.append(f"Active registration: {deadline_info['urgency_text']}")
        else:
            score += 6.0
            reasons.append("Ample time to prepare and register")

    final_score = int(min(98, max(35, round(score))))

    # 5-Star Ratings Calculation
    career_val = 5 if any(k in text_corpus for k in ["tcs", "microsoft", "fellowship", "internship", "prize", "grant", "ieee"]) else 4
    skill_val = 5 if len(matched_interests) >= 2 else (4 if len(matched_interests) == 1 else 3)
    hands_on_val = 5 if op_type in ["Workshop", "Hackathon", "Training"] or "hands-on" in text_corpus else (3 if op_type in ["Webinar", "Conference"] else 4)
    networking_val = 5 if op_mode in ["Offline", "Hybrid"] or op_type in ["Conference", "Meetup", "Hackathon"] else 3
    accessibility_val = 5 if op_fee == 0 or op_mode == "Online" else (4 if op_fee <= 500 else 3)

    # AI Verdict
    if final_score >= 90:
        verdict = "🔥 Highly Recommended"
    elif final_score >= 80:
        verdict = "⚡ Strongly Recommended"
    elif final_score >= 65:
        verdict = "👍 Recommended"
    else:
        verdict = "💡 Worth Exploring"

    # Personalized "Why TechPulse recommends this" explanation
    matched_names = ", ".join(matched_interests) if matched_interests else "technical growth"
    if op_type in ["Workshop", "Training"]:
        exp = f"This {op_type.lower()} directly accelerates your practical knowledge in {matched_names}. Because it offers hands-on implementation and is suited for {user_year} {user_branch} students, it provides direct resume value beyond standard coursework."
    elif op_type == "Hackathon":
        exp = f"This hackathon provides the ideal competitive arena to apply your {matched_names} skills on real-world problem statements, build deployable project portfolio pieces, and network with industry sponsors."
    elif op_type in ["Conference", "Research Event"]:
        exp = f"This {op_type.lower()} gives you high-level visibility into upcoming research directions in {matched_names}, offering valuable networking with senior architects and academic researchers."
    elif op_type == "Internship":
        exp = f"A high-impact opportunity tailored for {user_year} students to gain structured mentorship, industrial research experience, and a competitive stipend in {matched_names}."
    else:
        exp = f"Curated to broaden your technical capabilities in {matched_names} with flexible access and relevant industry context for engineering careers."

    return {
        "match_score": final_score,
        "reasons": reasons,
        "why_attend_explanation": exp,
        "verdict": verdict,
        "ratings": {
            "career_value": career_val,
            "skill_relevance": skill_val,
            "hands_on_value": hands_on_val,
            "networking": networking_val,
            "accessibility": accessibility_val
        },
        "deadline_info": deadline_info
    }
