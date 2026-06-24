from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import os

import models, schemas
from database import engine, get_db, Base
from seed_data import seed_db

# Agents
from agents.vision_agent import analyze_image
from agents.voice_agent import analyze_voice
from agents.routing_agent import route_issue
from agents.dedupe_agent import run_dedupe_check
from agents.insights_agent import generate_insights
from agents.escalation_agent import check_and_escalate

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NagrikAI Backend")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    db = next(get_db())
    seed_db(db)

@app.get("/")
def read_root():
    return {"message": "Welcome to NagrikAI API"}

@app.get("/api/issues", response_model=List[schemas.IssueResponse])
def get_issues(db: Session = Depends(get_db)):
    issues = db.query(models.Issue).all()
    return issues

@app.get("/api/issues/{issue_id}", response_model=schemas.IssueResponse)
def get_issue(issue_id: str, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue

@app.post("/api/analyze")
def analyze_issue_image(request: schemas.AIAnalysisRequest):
    # This calls the VisionAgent
    result = analyze_image(request.image_base64)
    return result

@app.post("/api/analyze-voice")
def analyze_issue_voice(request: schemas.AIVoiceAnalysisRequest):
    # This calls the VoiceAgent
    result = analyze_voice(request.transcript)
    return result

@app.post("/api/reports", response_model=schemas.IssueResponse)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    ai_data = report.ai_analysis or {}
    
    # Run Routing Agent
    routing_info = route_issue(
        category=ai_data.get("category", "OTHER"),
        severity=ai_data.get("severity", 3)
    )
    
    new_issue = models.Issue(
        title=ai_data.get("title", "New Issue Reported"),
        description=report.description or ai_data.get("description", ""),
        category=ai_data.get("category", "OTHER"),
        severity=ai_data.get("severity", 3),
        latitude=report.latitude,
        longitude=report.longitude,
        department=routing_info["department"],
        sla_hours=routing_info["sla_hours"],
        status="OPEN"
    )
    
    # DedupeAgent
    existing_issues = db.query(models.Issue).filter(models.Issue.status != "RESOLVED").all()
    dedupe_result = run_dedupe_check(
        {"latitude": report.latitude, "longitude": report.longitude, "category": new_issue.category, "severity": new_issue.severity, "subcategory": ai_data.get("subcategory")}, 
        existing_issues
    )
    
    if dedupe_result.get("is_duplicate"):
        new_issue.status = "DUPLICATE"
        # Increment upvotes on original
        orig_id = dedupe_result["duplicate_of"]
        orig = db.query(models.Issue).filter(models.Issue.id == orig_id).first()
        if orig:
            orig.upvotes += 1
            db.commit()
    
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)
    
    return new_issue

@app.patch("/api/issues/{issue_id}")
def update_issue(issue_id: str, update_data: schemas.IssueUpdateStatus, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    issue.status = update_data.status
    db.commit()
    db.refresh(issue)
    return issue



@app.post("/api/issues/{issue_id}/upvote")
def upvote_issue(issue_id: str, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if issue:
        issue.upvotes += 1
        db.commit()
        return {"success": True, "upvotes": issue.upvotes}
    raise HTTPException(status_code=404, detail="Issue not found")

@app.post("/api/issues/{issue_id}/verify")
def verify_issue(issue_id: str, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if issue:
        issue.verified_count += 1
        db.commit()
        return {"success": True, "verified_count": issue.verified_count}
    raise HTTPException(status_code=404, detail="Issue not found")

@app.get("/api/insights")
def get_ai_insights(db: Session = Depends(get_db)):
    # Get basic stats to feed to the InsightsAgent
    stats = {
        "total": db.query(models.Issue).count(),
        "resolved": db.query(models.Issue).filter(models.Issue.status == 'RESOLVED').count(),
        "categories": ["POTHOLE", "WATER_LEAK", "STREETLIGHT", "GARBAGE", "DRAINAGE"]
    }
    insights = generate_insights(stats)
    return insights

@app.get("/api/analytics")
def get_analytics(db: Session = Depends(get_db)):
    total = db.query(models.Issue).count()
    resolved = db.query(models.Issue).filter(models.Issue.status == 'RESOLVED').count()
    in_progress = db.query(models.Issue).filter(models.Issue.status == 'IN_PROGRESS').count()
    open_issues = db.query(models.Issue).filter(models.Issue.status == 'OPEN').count()
    
    # Category distribution
    categories = db.query(models.Issue.category, func.count(models.Issue.id)).group_by(models.Issue.category).all()
    category_data = [{"name": c[0], "count": c[1]} for c in categories]
    
    return {
        "kpi": {
            "total": total,
            "resolved": resolved,
            "avg_resolution_time": 42, # Mock average
            "field_agents": 12450
        },
        "status_data": [
            {"name": "Resolved", "value": resolved, "color": "#24B1B1"},
            {"name": "In Progress", "value": in_progress, "color": "#F59E0B"},
            {"name": "Open", "value": open_issues, "color": "#EF4444"}
        ],
        "category_data": category_data,
        "trend_data": [
            {"day": "Mon", "issues": 24}, {"day": "Tue", "issues": 35}, {"day": "Wed", "issues": 28},
            {"day": "Thu", "issues": 45}, {"day": "Fri", "issues": 32}, {"day": "Sat", "issues": 55}, {"day": "Sun", "issues": 40}
        ],
        "insights": generate_insights({
            "total": total,
            "resolved": resolved,
            "categories": [c[0] for c in categories]
        })
    }

@app.get("/api/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    # Mock leaderboard data
    return [
        {"id": "1", "name": "Rahul Desai", "ward": "Ward 5", "reports": 52, "verified": 28, "impact_score": 3450, "badge": "Legend"},
        {"id": "2", "name": "Priya Patel", "ward": "Ward 8", "reports": 41, "verified": 21, "impact_score": 2890, "badge": "Hero"},
        {"id": "3", "name": "Amit Shah", "ward": "Ward 4", "reports": 35, "verified": 18, "impact_score": 2100, "badge": "Hero"}
    ]

@app.post("/api/escalate")
def trigger_escalation(db: Session = Depends(get_db)):
    # Finds overdue issues and escalates
    issues = db.query(models.Issue).filter(models.Issue.status.in_(['OPEN', 'IN_PROGRESS'])).all()
    escalated_count = 0
    notices = []
    
    for issue in issues:
        result = check_and_escalate(db, issue)
        if result.get("escalated"):
            escalated_count += 1
            notices.append(result["notice"])
            
    db.commit()
    return {"escalated_count": escalated_count, "notices": notices}
