from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class IssueBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    severity: int
    latitude: float
    longitude: float
    address: Optional[str] = None
    ward: Optional[str] = None
    city: str = "Bhavnagar"
    image_url: Optional[str] = None

class IssueCreate(IssueBase):
    ai_summary: Optional[str] = None
    ai_tags: Optional[List[str]] = None
    department: Optional[str] = None
    sla_hours: Optional[int] = 72

class IssueResponse(IssueBase):
    id: str
    status: str
    subcategory: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_tags: Optional[List[str]] = None
    department: Optional[str] = None
    sla_hours: Optional[int] = None
    upvotes: int
    verified_count: int
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ReportCreate(BaseModel):
    reporter_name: Optional[str] = None
    reporter_phone: Optional[str] = None
    image_url: Optional[str] = None
    latitude: float
    longitude: float
    description: Optional[str] = None
    ai_analysis: Optional[Dict[str, Any]] = None

class IssueUpdateStatus(BaseModel):
    status: str

class AIAnalysisRequest(BaseModel):
    image_base64: str

class AIVoiceAnalysisRequest(BaseModel):
    transcript: str
