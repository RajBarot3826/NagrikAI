from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.sql import func
from database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Issue(Base):
    __tablename__ = "issues"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False)
    description = Column(String)
    category = Column(String(50), nullable=False)
    subcategory = Column(String(100))
    severity = Column(Integer)
    status = Column(String(30), default="OPEN")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String)
    ward = Column(String(100))
    city = Column(String(100), default="Bhavnagar")
    image_url = Column(String)
    ai_summary = Column(String)
    ai_tags = Column(JSON) # JSON array of strings
    department = Column(String(100))
    sla_hours = Column(Integer, default=72)
    reported_by = Column(String)
    upvotes = Column(Integer, default=0)
    verified_count = Column(Integer, default=0)
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=generate_uuid)
    issue_id = Column(String, ForeignKey("issues.id"))
    reporter_name = Column(String(100))
    reporter_phone = Column(String(20))
    image_url = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    description = Column(String)
    ai_analysis = Column(JSON)
    created_at = Column(DateTime, default=func.now())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100))
    phone = Column(String(20))
    ward = Column(String(100))
    city = Column(String(100))
    total_reports = Column(Integer, default=0)
    verified_reports = Column(Integer, default=0)
    impact_score = Column(Integer, default=0)
    badge_level = Column(String(30), default="Nagrik")
    created_at = Column(DateTime, default=func.now())

class IssueUpdate(Base):
    __tablename__ = "issue_updates"

    id = Column(String, primary_key=True, default=generate_uuid)
    issue_id = Column(String, ForeignKey("issues.id"))
    author = Column(String(100))
    content = Column(String)
    update_type = Column(String(30))
    created_at = Column(DateTime, default=func.now())
