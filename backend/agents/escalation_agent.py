from datetime import datetime, timezone
import os
import google.generativeai as genai

genai.configure(api_key=os.environ.get("VITE_GEMINI_API_KEY", "mock_key"))

ESCALATION_GEMINI_PROMPT = """
Generate a formal escalation notice for this overdue civic issue:
Issue: {title}
Category: {category}
Reported: {days} days ago
SLA was: {sla_hours} hours
Location: {address}

Write a 2-sentence escalation notice for the {department} department head.
"""

def check_and_escalate(db_session, issue):
    """
    Check if issue is past SLA and escalate if necessary
    """
    if issue.status == 'RESOLVED' or issue.status == 'ESCALATED':
        return False
        
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    created = issue.created_at
    
    if not created:
        return False
        
    hours_since_reported = (now - created).total_seconds() / 3600
    
    if hours_since_reported > (issue.sla_hours or 72):
        # Trigger Escalation
        issue.status = 'ESCALATED'
        issue.severity = min(5, (issue.severity or 1) + 1)
        
        # Mocking the notice generation for the demo if no key
        notice = f"URGENT: Issue {issue.title} at {issue.address} has breached its {issue.sla_hours} hour SLA. Immediate action is required by {issue.department}."
        
        if os.environ.get("VITE_GEMINI_API_KEY", "mock_key") != "mock_key":
            try:
                model = genai.GenerativeModel('gemini-2.5-flash')
                days = round(hours_since_reported / 24, 1)
                prompt = ESCALATION_GEMINI_PROMPT.format(
                    title=issue.title,
                    category=issue.category,
                    days=days,
                    sla_hours=issue.sla_hours,
                    address=issue.address,
                    department=issue.department
                )
                response = model.generate_content(prompt)
                notice = response.text
            except Exception as e:
                print(f"Escalation Agent API error: {e}")
                
        return {"escalated": True, "notice": notice}
    
    return {"escalated": False}
