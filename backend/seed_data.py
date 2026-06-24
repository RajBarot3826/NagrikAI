import uuid
from datetime import datetime, timedelta
import random

wards = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8"]

issues = [
    {"category": "POTHOLE", "title": "Severe Pothole near Waghawadi Road", "lat": 21.7600, "lon": 72.1400, "address": "Waghawadi Road"},
    {"category": "POTHOLE", "title": "Large crater on Crescent Circle", "lat": 21.7620, "lon": 72.1450, "address": "Crescent Circle"},
    {"category": "POTHOLE", "title": "Multiple potholes near ST Bus Stand", "lat": 21.7640, "lon": 72.1480, "address": "ST Bus Stand area"},
    {"category": "POTHOLE", "title": "Deep pothole causing accidents", "lat": 21.7655, "lon": 72.1520, "address": "Kalanala"},
    {"category": "POTHOLE", "title": "Road surface eroded completely", "lat": 21.7580, "lon": 72.1380, "address": "Jewel Circle"},
    {"category": "POTHOLE", "title": "Potholes due to recent digging", "lat": 21.7680, "lon": 72.1550, "address": "Ghogha Circle"},
    {"category": "POTHOLE", "title": "Dangerous pothole near school", "lat": 21.7700, "lon": 72.1600, "address": "Sardar Nagar"},
    {"category": "POTHOLE", "title": "Continuous potholes on service road", "lat": 21.7550, "lon": 72.1350, "address": "Talaja Road"},
    
    {"category": "WATER_LEAK", "title": "Major Water Leak at Nilambag", "lat": 21.7650, "lon": 72.1450, "address": "Nilambag Circle"},
    {"category": "WATER_LEAK", "title": "Drinking water pipe burst", "lat": 21.7720, "lon": 72.1580, "address": "Khodiyar Nagar"},
    {"category": "WATER_LEAK", "title": "Continuous leakage for 3 days", "lat": 21.7610, "lon": 72.1420, "address": "Meghani Circle"},
    {"category": "WATER_LEAK", "title": "Water wastage near public tap", "lat": 21.7660, "lon": 72.1500, "address": "Bortalav"},
    {"category": "WATER_LEAK", "title": "Underground pipe leaking", "lat": 21.7590, "lon": 72.1390, "address": "Rupani Circle"},
    
    {"category": "STREETLIGHT", "title": "Broken Streetlight Night Bazaar", "lat": 21.7700, "lon": 72.1550, "address": "Night Bazaar"},
    {"category": "STREETLIGHT", "title": "Streetlights not working for a week", "lat": 21.7560, "lon": 72.1360, "address": "Gaurishankar Lake road"},
    {"category": "STREETLIGHT", "title": "Flickering lights causing distraction", "lat": 21.7630, "lon": 72.1460, "address": "Vidhyanagar"},
    {"category": "STREETLIGHT", "title": "Dark patch on main highway", "lat": 21.7540, "lon": 72.1340, "address": "Highway Approach"},
    
    {"category": "GARBAGE", "title": "Garbage overflow at Ghogha Circle", "lat": 21.7690, "lon": 72.1540, "address": "Ghogha Circle"},
    {"category": "GARBAGE", "title": "Uncollected trash since 4 days", "lat": 21.7710, "lon": 72.1610, "address": "Sardar Nagar"},
    {"category": "GARBAGE", "title": "Dumpster overflowing onto road", "lat": 21.7645, "lon": 72.1490, "address": "Haluriya Chowk"},
    {"category": "GARBAGE", "title": "Illegal dumping of construction waste", "lat": 21.7570, "lon": 72.1370, "address": "Subhashnagar"},
    
    {"category": "DRAINAGE", "title": "Drainage blockage in Vadva", "lat": 21.7670, "lon": 72.1530, "address": "Vadva area"},
    {"category": "DRAINAGE", "title": "Open manhole overflowing", "lat": 21.7625, "lon": 72.1475, "address": "Bhathiya area"},
    {"category": "DRAINAGE", "title": "Sewage water entering homes", "lat": 21.7685, "lon": 72.1560, "address": "Kumbharwada"},
    {"category": "DRAINAGE", "title": "Foul smell from blocked drain", "lat": 21.7555, "lon": 72.1330, "address": "Chitra GIDC"},
]

images = {
    "POTHOLE": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400",
    "WATER_LEAK": "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=400",
    "STREETLIGHT": "https://images.unsplash.com/photo-1516086884639-6d5dfbdf02bc?auto=format&fit=crop&q=80&w=400",
    "GARBAGE": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400",
    "DRAINAGE": "https://images.unsplash.com/photo-1584824486509-112e4181f1ce?auto=format&fit=crop&q=80&w=400"
}

from models import Issue
from agents.routing_agent import route_issue

def seed_db(db):
    if db.query(Issue).count() > 0:
        return

    db_issues = []
    
    for i, item in enumerate(issues):
        severity = random.randint(2, 5)
        status = random.choice(["OPEN", "OPEN", "IN_PROGRESS", "RESOLVED"])
        
        routing = route_issue(item["category"], severity)
        
        issue = Issue(
            id=str(uuid.uuid4()),
            title=item["title"],
            category=item["category"],
            severity=severity,
            status=status,
            latitude=item["lat"],
            longitude=item["lon"],
            address=item["address"],
            ward=random.choice(wards),
            department=routing["department"],
            image_url=images[item["category"]],
            upvotes=random.randint(5, 100),
            sla_hours=routing["sla_hours"]
        )
        db_issues.append(issue)
        
    db.add_all(db_issues)
    db.commit()
