# 🚀 TechPulse AI — Your AI-Powered Technical Opportunity Assistant

> **“Discover. Match. Act. Never Miss an Opportunity.”**

[![Course Project](https://img.shields.io/badge/Project-AI%20Course%20CIE--3-blue.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Complete%20%26%20Functional-brightgreen.svg)](https://github.com)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Gemini%20LLM%20%2B%20Local%20Fallback-cyan.svg)](https://github.com)

---

## 1. Project Purpose & Problem Solved

Engineering students frequently miss:
- Hands-on technical workshops
- Hackathons & algorithm challenges
- Technical conferences & research symposiums
- Industry meetups
- Corporate recruitment & technology summits
- Webinars & certifications
- Research internships

**Core Problem:**
> Information about technical opportunities is scattered across fragmented portals, noticeboards, and social media. There was no personalized, intelligent system that actively tracks deadlines, computes curriculum relevance, and warns students before registration doors close.

**Solution:**
**TechPulse AI** acts as a personal opportunity discovery and recommendation assistant that:
1. Understands student branch, academic year, and technical interests.
2. Evaluates opportunities using a **multi-factor AI matching algorithm (0–100%)**.
3. Employs a **Deadline Intelligence Radar** to classify deadlines into **Safe, Closing Soon, Urgent, and Last Chance**.
4. Generates tailored **“Why You Should Attend”** explanations with 5-star evaluation ratings (Career Value, Skill Relevance, Hands-on Value, Networking, Accessibility).
5. Provides a grounded **RAG (Retrieval-Augmented Generation) Chatbot** that converts natural language queries into verified opportunities with zero hallucinations.

---

## 2. Key Features

- **Personalized Student Profile:** Configures engineering branch, academic year, 18 technical interest tags, preferred locations, and budget. Includes a 1-click **CIE-3 Demo Benchmark** button.
- **AI Opportunity Matcher (0–100%):** Weighted evaluation across 6 criteria:
  - Technical Interest Match (35%)
  - Branch & Year Eligibility (20%)
  - Location & Mode Match (15%)
  - Event Type Preference (10%)
  - Cost & Budget Compatibility (10%)
  - Deadline Urgency & Freshness (10%)
- **Deadline Intelligence Engine:** Dynamic categorization:
  - 🟢 **SAFE**: > 14 days remaining
  - 🟡 **CLOSING SOON**: 7–14 days remaining
  - 🟠 **URGENT**: 2–7 days remaining
  - 🔴 **LAST CHANCE**: < 2 days remaining (< 48 hrs)
  - ⚫ **CLOSED**: Deadline passed
- **🚨 “Don’t Miss This” Dashboard:** Flags opportunities with Match Score > 75% and closing within 7 days.
- **RAG Chatbot (“Ask TechPulse”):** Conversational AI that extracts query entities (topic, location, budget, urgency), filters the database, and renders interactive Opportunity Cards directly inside messages.
- **Saved Opportunities & Notification Center:** Bookmark opportunities and configure alert thresholds (7 days, 3 days, 1 day before deadline). In-app notification center alerts students in real-time.
- **Admin & Event Ingestion Pipeline:** Manually add, edit, delete, or mark events closed, plus a simulated automated ingestion pipeline with deduplication.
- **Dual AI Mode:** Seamlessly connects to Google Gemini LLM when an API key is provided, or uses the built-in high-fidelity Local AI Fallback Engine without requiring external internet/API credits.

---

## 3. Architecture

```text
TechPulse AI
│
├── frontend/                   # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, OpportunityCard, UrgencyBadge,
│   │   │                       # OpportunityModal, ReminderModal, NotificationDropdown
│   │   ├── pages/              # Dashboard, Discover, Recommendations, ClosingSoon,
│   │   │                       # ChatPage, SavedPage, ProfilePage, AdminPage, AboutPage
│   │   ├── services/           # api.ts (REST client)
│   │   ├── types/              # index.ts (TypeScript schemas)
│   │   └── App.tsx             # Root layout and view controller
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                    # Python FastAPI + SQLite
│   ├── api/                    # REST routers: opportunities, recommendations,
│   │                           # chat, profile, saved, notifications, admin
│   │   ├── opportunities.py
│   │   ├── recommendations.py
│   │   ├── chat.py
│   │   ├── profile.py
│   │   ├── saved.py
│   │   ├── notifications.py
│   │   └── admin.py
│   ├── database/               # SQLite connection, SQLAlchemy models & seed data
│   │   ├── models.py
│   │   ├── connection.py
│   │   └── seed_data.py        # 20 realistic opportunities dynamically anchored to today
│   ├── ai/                     # AI & RAG intelligence
│   │   ├── deadline_engine.py  # Deadline tiers & countdown math
│   │   ├── matcher.py          # Multi-criteria 0-100% scoring & 5-star ratings
│   │   ├── rag_service.py      # NLP entity extractor & RAG candidate pipeline
│   │   └── gemini_service.py   # Google Gemini LLM client + fallback
│   ├── ingestion/              # Modular event ingestion & deduplication
│   │   └── event_ingester.py
│   ├── models/                 # Pydantic schemas
│   └── main.py                 # FastAPI application entrypoint
│
└── README.md
```

---

## 4. How to Run

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Step 1: Start the Backend (FastAPI)
```bash
# In project root:
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API and Swagger interactive docs will be available at:
- **API URL:** http://localhost:8000
- **Swagger Documentation:** http://localhost:8000/docs

### Step 2: Start the Frontend (Vite React)
```bash
# In frontend directory:
cd frontend
npm run dev
```
The frontend UI will be available at:
- **Web App:** http://localhost:5173

---

## 5. CIE-3 5-Minute Demonstration Walkthrough

Follow these steps for a complete project evaluation:

1. **Step 1 — Student Profile Benchmark:**
   - Navigate to **Student Profile** (or click **"CIE-3 Demo Preset"** in the sidebar).
   - Shows: Aarav Sharma, Third Year Computer Engineering, COEP Pune, Technical Interests: *AI, Robotics, IoT, Cloud Computing*, Locations: *Pune & Online*.
2. **Step 2 — Natural Language Chatbot:**
   - Navigate to **Ask TechPulse** (`/chat`).
   - Click the prompt chip: *“Find upcoming AI and robotics workshops in Pune”* (or type your own query).
   - Observe: NLP entity extraction chips (`topic: AI, Robotics`, `location: Pune`, `type: Workshop`), conversational response, and embedded interactive Opportunity Cards.
3. **Step 3 — Inspect “Why Should I Attend?” & 5-Star Ratings:**
   - Click **“View Details”** on the *Autonomous Robotics & Edge AI Hands-on Workshop*.
   - Observe: **98% Match Score**, verdict 🔥 *Highly Recommended*, curriculum justification, and 5-star ratings for Career Value, Skill Relevance, Hands-on Value, Networking, and Accessibility.
4. **Step 4 — Deadline Intelligence Radar:**
   - Navigate to **Closing Soon** or observe the **🚨 Don’t Miss These** section on the Dashboard.
   - Observe urgency badges:
     - 🔴 **LAST CHANCE**: Autonomous Robotics (< 2 days left)
     - 🟠 **URGENT**: Pune GenAI Student Hackathon (3 days left)
     - 🟡 **CLOSING SOON**: CyberSuraksha CTF (8 days left)
5. **Step 5 — Save Opportunity & Set Alert Reminder:**
   - Click the bookmark icon on any card -> modal opens to select reminder timing: **7 Days**, **3 Days**, or **1 Day before deadline**.
   - Confirm reminder -> open the **Notification Center** (bell icon in top navbar) -> observe the newly triggered deadline alert!
6. **Step 6 — Admin & Feeds Demonstration:**
   - Navigate to **Admin & Feeds**.
   - Click **“Run Ingestion Pipeline”** -> witness automated ingestion of public tech feeds with duplicate detection.
   - Observe AI Engine status indicator (Gemini Live or Local Fallback).

---

## 6. AI Technologies Demonstrated

1. **Natural Language Processing (NLP):** Entity and intent extraction for query filtering.
2. **Generative AI:** Dynamic generation of personalized opportunity justifications tailored to student academic background.
3. **Multi-Factor Recommendation System:** Weighted multi-criteria matching algorithm generating 0–100% scores.
4. **Semantic Similarity:** Token-level semantic affinity between student interests and opportunity topics.
5. **Information Extraction:** Parsing event dates, countdown hours, eligibility, and fees.
6. **Retrieval-Augmented Generation (RAG):** Context grounding in SQLite database preventing false or invented opportunities.

---

## 7. License
Developed for Academic Course CIE-3 Evaluation.
TechPulse AI © 2026. All rights reserved.
