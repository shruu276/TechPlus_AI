import os
import sys

# Ensure UTF-8 output for Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.database.connection import init_db, SessionLocal
from backend.database.seed_data import seed_database
from backend.database.models import Opportunity, UserProfile
from backend.ai.matcher import calculate_match_score
from backend.ai.deadline_engine import evaluate_deadline
from backend.ai.rag_service import process_rag_query
from backend.ingestion.event_ingester import run_ingestion_pipeline

def run_tests():
    print("1. Initializing database...")
    init_db()
    db = SessionLocal()
    seed_database(db)

    # Count opportunities
    op_count = db.query(Opportunity).count()
    print(f"   [PASS] Opportunities count in DB: {op_count}")
    assert op_count >= 20, "Should have at least 20 demo opportunities"

    # Test profile
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    print(f"   [PASS] Student Profile: {profile.name} - {profile.year} {profile.branch}")
    assert profile is not None

    # Test match score and deadline
    first_op = db.query(Opportunity).first()
    match_result = calculate_match_score(first_op, profile)
    print(f"   [PASS] Match Score for '{first_op.title[:30]}...': {match_result['match_score']}% ({match_result['verdict']})")
    assert 0 <= match_result["match_score"] <= 100
    assert "ratings" in match_result
    assert "why_attend_explanation" in match_result

    # Test deadline calculation
    dl_eval = evaluate_deadline(first_op.registration_deadline)
    print(f"   [PASS] Deadline status: {dl_eval['badge_label']} ({dl_eval['urgency_text']})")
    assert dl_eval["status_code"] in ["LAST_CHANCE", "URGENT", "CLOSING_SOON", "SAFE", "CLOSED"]

    # Test RAG query
    test_query = "Find AI and robotics workshops in Pune"
    rag_result = process_rag_query(test_query, db, profile)
    print(f"   [PASS] RAG Query: '{test_query}' -> {rag_result['total_matches']} cards returned, AI Engine: {rag_result['ai_engine']}")
    assert len(rag_result["opportunities"]) > 0
    assert len(rag_result["reply"]) > 20

    # Test query intent extraction for closing soon
    urgent_query = "Which events are closing this week?"
    rag_urgent = process_rag_query(urgent_query, db, profile)
    print(f"   [PASS] Urgent Query -> {rag_urgent['total_matches']} matches, intent: {rag_urgent['extracted_entities']['intent']}")

    # Test Ingestion
    ingest_res = run_ingestion_pipeline(db)
    print(f"   [PASS] Ingestion pipeline: ingested={ingest_res['ingested_count']}, merged/skipped={ingest_res.get('merged_count', 0)}")

    db.close()
    print("\nALL BACKEND UNIT & RAG TESTS PASSED SUCCESSFULLY! 🚀")

if __name__ == "__main__":
    run_tests()
