import json
import re
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from backend.ai.gemini_service import call_gemini_llm, is_gemini_configured
from backend.ai.deadline_engine import evaluate_deadline
from backend.ai.matcher import calculate_match_score

SYSTEM_PROMPT = """You are TechPulse AI, a technical opportunity discovery assistant for engineering students.
Your job is to help students discover relevant workshops, conferences, hackathons, meetups, corporate events, research programs and other technical opportunities.

Use the user's profile to personalize recommendations.
Prioritize opportunities that are:
1. Relevant to the user's interests.
2. Suitable for their academic level.
3. Within their preferred location or online.
4. Within their budget.
5. Still accepting registrations.

Always distinguish verified opportunity data from demo/sample data.
Never invent event details, deadlines, organizers or URLs.
If information is unavailable, explicitly say: "I don't have verified information about that event."
When registration deadlines are approaching, clearly highlight the urgency.
Explain why an opportunity is relevant to the student.
Be concise, practical and action-oriented."""

KNOWN_TOPICS = [
    "Artificial Intelligence", "Machine Learning", "Data Science", "Web Development",
    "App Development", "Cloud Computing", "Cybersecurity", "IoT", "Robotics",
    "Drones", "Embedded Systems", "Blockchain", "DevOps", "Software Development",
    "Electronics", "Sustainability", "Research", "Entrepreneurship"
]

KNOWN_EVENT_TYPES = [
    "Workshop", "Conference", "Hackathon", "Meetup", "Webinar",
    "Competition", "Corporate Event", "Research Event", "Training",
    "Internship", "Certification"
]

KNOWN_LOCATIONS = ["Pune", "Mumbai", "Nashik", "Maharashtra", "Online", "India"]

def extract_query_entities(query: str) -> Dict[str, Any]:
    """
    NLP entity and intent extraction from natural language user queries.
    """
    q = query.lower()
    entities = {
        "topics": [],
        "event_type": None,
        "location": None,
        "budget_free_only": False,
        "urgency_filter": None,
        "year_or_branch": None,
        "intent": "search"
    }

    # Intent detection
    if any(w in q for w in ["register me", "where do i register", "how do i register", "how to register", "registration link", "sign up for", "official registration"]):
        entities["intent"] = "registration_request"
    elif any(w in q for w in ["why should i attend", "why attend", "why recommend", "worth attending"]):
        entities["intent"] = "why_attend"
    elif any(w in q for w in ["best for me", "recommend", "what should i attend", "top pick", "suggest"]):
        entities["intent"] = "recommendation"
    elif any(w in q for w in ["closing", "deadline", "urgent", "last chance", "closing this week", "closing soon"]):
        entities["intent"] = "deadline_check"
    else:
        entities["intent"] = "search"

    # Topics extraction
    topic_synonyms = {
        "ai": "Artificial Intelligence",
        "artificial intelligence": "Artificial Intelligence",
        "genai": "Artificial Intelligence",
        "ml": "Machine Learning",
        "machine learning": "Machine Learning",
        "data science": "Data Science",
        "web": "Web Development",
        "web dev": "Web Development",
        "frontend": "Web Development",
        "backend": "Web Development",
        "app": "App Development",
        "android": "App Development",
        "flutter": "App Development",
        "cloud": "Cloud Computing",
        "aws": "Cloud Computing",
        "devops": "DevOps",
        "kubernetes": "DevOps",
        "docker": "DevOps",
        "security": "Cybersecurity",
        "cyber": "Cybersecurity",
        "cybersecurity": "Cybersecurity",
        "ctf": "Cybersecurity",
        "iot": "IoT",
        "internet of things": "IoT",
        "robotics": "Robotics",
        "robot": "Robotics",
        "ros": "Robotics",
        "drone": "Drones",
        "drones": "Drones",
        "embedded": "Embedded Systems",
        "fpga": "Embedded Systems",
        "risc-v": "Embedded Systems",
        "blockchain": "Blockchain",
        "web3": "Blockchain",
        "solidity": "Blockchain",
        "electronics": "Electronics",
        "vlsi": "Electronics",
        "sustainability": "Sustainability",
        "green": "Sustainability",
        "research": "Research",
        "startup": "Entrepreneurship",
        "entrepreneurship": "Entrepreneurship"
    }

    for key, mapped_topic in topic_synonyms.items():
        if re.search(r'\b' + re.escape(key) + r'\b', q):
            if mapped_topic not in entities["topics"]:
                entities["topics"].append(mapped_topic)

    # Event types
    type_synonyms = {
        "workshop": "Workshop",
        "workshops": "Workshop",
        "conference": "Conference",
        "conferences": "Conference",
        "summit": "Conference",
        "hackathon": "Hackathon",
        "hackathons": "Hackathon",
        "meetup": "Meetup",
        "meetups": "Meetup",
        "webinar": "Webinar",
        "webinars": "Webinar",
        "competition": "Competition",
        "contest": "Competition",
        "corporate": "Corporate Event",
        "industry": "Corporate Event",
        "research": "Research Event",
        "training": "Training",
        "bootcamp": "Training",
        "internship": "Internship",
        "internships": "Internship",
        "certification": "Certification"
    }

    for key, mapped_type in type_synonyms.items():
        if re.search(r'\b' + re.escape(key) + r'\b', q):
            entities["event_type"] = mapped_type
            break

    # Location
    for loc in KNOWN_LOCATIONS:
        if loc.lower() in q:
            entities["location"] = loc
            break

    # Budget
    if any(w in q for w in ["free", "no fee", "zero cost", "without cost", "0 fee"]):
        entities["budget_free_only"] = True

    # Urgency
    if any(w in q for w in ["this week", "closing this week", "closing soon", "urgent", "ending soon", "last chance"]):
        entities["urgency_filter"] = "closing_soon"

    # Academic Level / Branch
    if "third" in q or "3rd" in q:
        entities["year_or_branch"] = "Third Year"
    elif "computer" in q:
        entities["year_or_branch"] = "Computer Engineering"
    elif "no prior experience" in q or "no experience" in q or "beginners" in q:
        entities["year_or_branch"] = "Beginners"

    return entities

def process_rag_query(query: str, db_session, user_profile) -> Dict[str, Any]:
    """
    RAG Pipeline:
    1. Extract entities and intent
    2. Retrieve relevant candidates from SQLite DB
    3. Calculate AI match scores and deadline intelligence
    4. Rank results
    5. Generate conversational explanation (via Gemini LLM or Local AI Synthesis)
    6. Return structured response with embedded opportunity cards
    """
    from backend.database.models import Opportunity
    entities = extract_query_entities(query)
    q_norm = query.lower()

    # Base query
    all_ops = db_session.query(Opportunity).all()
    
    scored_candidates = []
    for op in all_ops:
        match_data = calculate_match_score(op, user_profile)
        deadline_info = match_data["deadline_info"]

        # Relevance scoring to current user query
        query_relevance = 0.0
        op_title_l = op.title.lower()
        op_desc_l = op.description.lower()
        op_topics_l = op.topics.lower()

        # Topic matching with extracted topics
        for t in entities["topics"]:
            if t.lower() in op_title_l:
                query_relevance += 40
            elif t.lower() in op_topics_l:
                query_relevance += 30
            elif t.lower() in op_desc_l:
                query_relevance += 15

        # Event type matching
        if entities["event_type"] and entities["event_type"].lower() in op.event_type.lower():
            query_relevance += 25

        # Location matching
        if entities["location"]:
            if entities["location"].lower() in op.location.lower():
                query_relevance += 20
            elif entities["location"].lower() == "online" and op.mode.lower() == "online":
                query_relevance += 20

        # Free budget filter
        if entities["budget_free_only"]:
            if op.fee == 0:
                query_relevance += 20
            else:
                query_relevance -= 50

        # Urgency filter
        if entities["urgency_filter"] == "closing_soon":
            if deadline_info["status_code"] in ["LAST_CHANCE", "URGENT", "CLOSING_SOON"]:
                query_relevance += 30
            elif not deadline_info["is_open"]:
                query_relevance -= 40

        # General keyword match against title/desc
        for word in q_norm.split():
            if len(word) > 3 and word in op_title_l:
                query_relevance += 10
            elif len(word) > 3 and word in op_desc_l:
                query_relevance += 5

        # Combine query relevance with profile match score
        combined_score = (query_relevance * 0.6) + (match_data["match_score"] * 0.4)

        scored_candidates.append({
            "opportunity": op,
            "match_data": match_data,
            "query_relevance": query_relevance,
            "combined_score": combined_score
        })

    # Filter and sort
    # If the user specifically asked for something with positive relevance, rank by combined
    if any(entities["topics"]) or entities["event_type"] or entities["location"] or entities["budget_free_only"] or entities["urgency_filter"]:
        # Filter out negative relevance (e.g. paid when asking for free)
        filtered = [c for c in scored_candidates if c["query_relevance"] > 0]
        if not filtered:
            # Fallback to general high match
            filtered = scored_candidates
        filtered.sort(key=lambda x: x["combined_score"], reverse=True)
    else:
        # General question like "What is best for me?" -> rank by match score + urgency
        filtered = scored_candidates
        filtered.sort(key=lambda x: x["match_data"]["match_score"], reverse=True)

    top_candidates = filtered[:4]

    # Build RAG context
    context_items = []
    card_results = []

    for c in top_candidates:
        op = c["opportunity"]
        md = c["match_data"]
        dl = md["deadline_info"]
        
        # Serialize card for frontend
        card_obj = {
            "id": op.id,
            "title": op.title,
            "organizer": op.organizer,
            "description": op.description,
            "event_type": op.event_type,
            "topics": json.loads(op.topics) if isinstance(op.topics, str) else op.topics,
            "date": op.date,
            "start_time": op.start_time or "09:00 AM",
            "end_time": op.end_time or "05:00 PM",
            "location": op.location,
            "mode": op.mode,
            "eligibility": op.eligibility,
            "fee": op.fee,
            "fee_display": "Free" if op.fee == 0 else f"₹{op.fee}",
            "registration_deadline": op.registration_deadline,
            "registration_url": op.registration_url,
            "official_website_url": op.official_website_url,
            "source_url": op.source_url,
            "source_name": op.source_name,
            "source_verified": getattr(op, "source_verified", True),
            "data_mode": getattr(op, "data_mode", "demo"),
            "registration_status": dl.get("registration_status", "OPEN"),
            "status": op.status,
            "match_score": md["match_score"],
            "urgency_badge": dl["badge_label"],
            "urgency_text": dl["urgency_text"],
            "urgency_rank": dl["urgency_rank"],
            "verdict": md["verdict"],
            "reasons": md["reasons"][:3],
            "why_attend_explanation": md["why_attend_explanation"],
            "ratings": md["ratings"],
            "what_you_will_learn": json.loads(op.what_you_will_learn) if op.what_you_will_learn and isinstance(op.what_you_will_learn, str) else (op.what_you_will_learn or []),
            "skills_gained": json.loads(op.skills_gained) if op.skills_gained and isinstance(op.skills_gained, str) else (op.skills_gained or []),
            "career_areas": json.loads(op.career_areas) if op.career_areas and isinstance(op.career_areas, str) else (op.career_areas or []),
            "is_demo": getattr(op, "is_demo", True),
            "is_saved": False
        }
        card_results.append(card_obj)

        context_items.append(
            f"- Event #{op.id}: '{op.title}' organized by {op.organizer}\n"
            f"  Type: {op.event_type} | Mode: {op.mode} | Location: {op.location} | Fee: {'Free' if op.fee == 0 else f'₹{op.fee}'}\n"
            f"  Date: {op.date} | Deadline: {op.registration_deadline} ({dl['badge_label']} - {dl['urgency_text']})\n"
            f"  Eligibility: {op.eligibility}\n"
            f"  AI Match Score: {md['match_score']}% | Verdict: {md['verdict']}\n"
            f"  Key Reasons: {'; '.join(md['reasons'][:2])}\n"
            f"  Why Attend: {md['why_attend_explanation']}\n"
        )

    context_str = "\n".join(context_items)
    
    # Try calling Gemini if configured
    ai_engine_used = "Gemini LLM (Live)"
    generated_text = None

    if is_gemini_configured(db_session):
        llm_prompt = f"""Student Profile:
- Name: {getattr(user_profile, 'name', 'Aarav')}
- Branch: {getattr(user_profile, 'branch', 'Computer Engineering')} ({getattr(user_profile, 'year', 'Third Year')})
- College: {getattr(user_profile, 'college', 'COEP Technological University')}
- Technical Interests: {getattr(user_profile, 'interests', '[]')}

Verified Opportunity Database Context:
{context_str}

User Question: "{query}"

Answer the student concisely. Reference the most relevant retrieved event(s) by exact title, highlight why they fit their profile, and prominently mention registration deadline urgency. Do not invent any non-existent events."""
        generated_text = call_gemini_llm(llm_prompt, SYSTEM_PROMPT)

    # Local AI Fallback Engine synthesis if Gemini is not configured or failed
    if not generated_text:
        ai_engine_used = "TechPulse Local AI Engine (Fallback)"
        generated_text = generate_local_rag_response(query, entities, top_candidates, user_profile)

    return {
        "reply": generated_text,
        "opportunities": card_results,
        "extracted_entities": entities,
        "ai_engine": ai_engine_used,
        "total_matches": len(card_results),
        "is_registration_query": entities["intent"] == "registration_request"
    }

def generate_local_rag_response(query: str, entities: Dict[str, Any], top_candidates: List[Dict[str, Any]], user_profile) -> str:
    """
    High-fidelity deterministic local RAG generator when external Gemini API is offline.
    """
    user_name = getattr(user_profile, "name", "there")
    user_branch = getattr(user_profile, "branch", "Computer Engineering")
    user_year = getattr(user_profile, "year", "Third Year")

    if not top_candidates:
        return f"I searched the TechPulse verified opportunity database, but couldn't find active opportunities matching all your criteria. Try broadening your location or checking all upcoming engineering events!"

    count = len(top_candidates)
    first_op = top_candidates[0]["opportunity"]
    first_match = top_candidates[0]["match_data"]
    first_deadline = first_match["deadline_info"]

    header = f"### 🔎 I found {count} relevant technical opportunity{'ies' if count > 1 else ''} matching your query."

    # Custom opening statement based on query intent
    if entities["intent"] == "registration_request":
        opening = f"I can take you directly to the verified official registration page. Click below to continue your registration on the official organizer website:"
    elif entities["intent"] == "deadline_check":
        opening = f"Here are the time-sensitive opportunities closing soon. **{first_op.title}** is approaching its deadline — {first_deadline['urgency_text']}"
    elif entities["intent"] == "recommendation":
        opening = f"Based on your profile as a **{user_year} {user_branch}** student, your highest AI match is **{first_op.title}** ({first_match['match_score']}% match) with verdict {first_match['verdict']}."
    elif entities["intent"] == "why_attend":
        opening = f"Here is why this opportunity stands out: {first_match['why_attend_explanation']}"
    else:
        topic_str = f" in {', '.join(entities['topics'])}" if entities["topics"] else ""
        opening = f"Filtered top options{topic_str} aligned with your academic year ({user_year}) and preferred formats:"

    summary_bullets = []
    for idx, c in enumerate(top_candidates, 1):
        op = c["opportunity"]
        md = c["match_data"]
        dl = md["deadline_info"]
        summary_bullets.append(
            f"**{idx}. {op.title}** ({op.organizer})\n"
            f"• 🎯 **AI Match: {md['match_score']}%** | 📅 {op.date} | 📍 {op.location} ({op.mode})\n"
            f"• 💰 {'Free' if op.fee == 0 else f'₹{op.fee}'} | {dl['badge_label']}: {dl['urgency_text']}"
        )

    closing = "\n\n*Review the interactive opportunity cards below for full syllabus details, 5-star ratings, and official registration links.*"

    return f"{header}\n\n{opening}\n\n" + "\n\n".join(summary_bullets) + closing
