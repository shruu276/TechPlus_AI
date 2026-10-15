import sys
import time
import requests

# Reconfigure stdout for UTF-8
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = "http://127.0.0.1:8000"

def wait_for_server(max_attempts=10):
    for i in range(max_attempts):
        try:
            r = requests.get(f"{BASE_URL}/api/health", timeout=2)
            if r.status_code == 200:
                print("Backend server is UP and HEALTHY!")
                return True
        except Exception:
            time.sleep(1)
    return False

def test_live_api():
    assert wait_for_server(), "Backend server failed to start in time!"

    print("\n--- 1. Testing Opportunities & Filters ---")
    r = requests.get(f"{BASE_URL}/api/opportunities?topic=Artificial%20Intelligence")
    assert r.status_code == 200
    ops = r.json()
    print(f"-> Found {len(ops)} AI opportunities")
    assert len(ops) > 0
    first = ops[0]
    print(f"-> Sample: '{first['title']}' | Match: {first['match_score']}% | Urgency: {first['urgency_badge']}")
    assert "ratings" in first
    assert "why_attend_explanation" in first

    print("\n--- 2. Testing Recommendations & Urgency Radar ---")
    r_recs = requests.get(f"{BASE_URL}/api/recommendations")
    assert r_recs.status_code == 200
    recs = r_recs.json()
    print(f"-> Total Recommendations: {len(recs)} (Top score: {recs[0]['match_score']}%)")

    r_dont_miss = requests.get(f"{BASE_URL}/api/recommendations/dont-miss")
    assert r_dont_miss.status_code == 200
    dont_miss = r_dont_miss.json()
    print(f"-> Don't Miss Opportunities (Urgent + High Match): {len(dont_miss)}")
    for dm in dont_miss[:2]:
        print(f"   * {dm['title'][:35]}... ({dm['urgency_badge']}) - Match: {dm['match_score']}%")

    print("\n--- 3. Testing Single Opportunity Details ---")
    r_det = requests.get(f"{BASE_URL}/api/opportunities/1")
    assert r_det.status_code == 200
    det = r_det.json()
    print(f"-> Details for #{det['id']}: '{det['title']}' | Mode: {det['mode']} | Fee: {det['fee_display']}")
    print(f"   Why Attend: {det['why_attend_explanation'][:60]}...")

    print("\n--- 4. Testing RAG Chatbot Queries ---")
    queries = [
        "Find upcoming AI and robotics workshops in Pune.",
        "Which events are closing this week?",
        "What opportunities are suitable for a third-year Computer Engineering student?"
    ]
    for q in queries:
        chat_res = requests.post(f"{BASE_URL}/api/chat", json={"query": q}).json()
        print(f"-> Q: '{q}'")
        print(f"   Engine: {chat_res['ai_engine']} | Cards returned: {len(chat_res['opportunities'])}")
        print(f"   Reply: {chat_res['reply'][:70]}...")
        assert len(chat_res["opportunities"]) > 0

    print("\n--- 5. Testing Save & In-App Reminders ---")
    save_res = requests.post(f"{BASE_URL}/api/saved", json={"opportunity_id": 1, "reminder_days_before": 3}).json()
    print(f"-> Saved opportunity #{save_res['opportunity_id']} with {save_res['reminder_days_before']}-day reminder")

    notifs = requests.get(f"{BASE_URL}/api/notifications").json()
    print(f"-> Notifications in Notification Center: {len(notifs)}")
    print(f"   Latest alert: {notifs[0]['title']}")
    assert len(notifs) > 0

    print("\n--- 6. Testing Student Profile & CIE Benchmark Reset ---")
    prof = requests.get(f"{BASE_URL}/api/profile").json()
    print(f"-> Active Profile: {prof['name']} | {prof['year']} {prof['branch']} | Interests: {len(prof['interests'])}")

    reset_prof = requests.post(f"{BASE_URL}/api/profile/reset-cie-demo").json()
    print(f"-> Reset to CIE Benchmark: {reset_prof['name']} at {reset_prof['college']}")
    assert reset_prof["branch"] == "Computer Engineering"

    print("\n--- 7. Testing Admin & AI Engine Status ---")
    ai_status = requests.get(f"{BASE_URL}/api/admin/ai-status").json()
    print(f"-> Active AI Engine: {ai_status['active_engine']} (Fallback Ready: {ai_status['fallback_ready']})")

    ingest_res = requests.post(f"{BASE_URL}/api/admin/run-ingestion").json()
    print(f"-> Ingestion Test: Ingested {ingest_res['ingested_count']}, Skipped {ingest_res['skipped_duplicates']}")

    print("\n=======================================================")
    print("ALL LIVE END-TO-END SYSTEM INTEGRATION TESTS PASSED! 🚀")
    print("=======================================================")

if __name__ == "__main__":
    test_live_api()
