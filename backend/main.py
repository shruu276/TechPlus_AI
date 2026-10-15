import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.connection import init_db, SessionLocal
from backend.database.seed_data import seed_database
from backend.api.opportunities import router as opportunities_router
from backend.api.recommendations import router as recommendations_router
from backend.api.chat import router as chat_router
from backend.api.profile import router as profile_router
from backend.api.saved import router as saved_router
from backend.api.notifications import router as notifications_router
from backend.api.admin import router as admin_router

app = FastAPI(
    title="TechPulse AI — Backend API",
    description="AI-Powered Technical Opportunity Discovery and Recommendation System for Engineering Students",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(opportunities_router)
app.include_router(recommendations_router)
app.include_router(chat_router)
app.include_router(profile_router)
app.include_router(saved_router)
app.include_router(notifications_router)
app.include_router(admin_router)

@app.on_event("startup")
def on_startup():
    print("[TechPulse AI] Initializing database...")
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
        print("[TechPulse AI] Database successfully initialized and seeded.")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "app": "TechPulse AI",
        "tagline": "Discover. Match. Act. Never Miss an Opportunity.",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
