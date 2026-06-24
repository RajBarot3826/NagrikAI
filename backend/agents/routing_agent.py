# Section 6: RoutingAgent Logic

DEPARTMENT_ROUTING = {
  "POTHOLE": {
    "department": "Roads & Infrastructure Department",
    "contact": "PWD Bhavnagar",
    "sla_hours": {1: 168, 2: 120, 3: 72, 4: 48, 5: 24}
  },
  "WATER_LEAK": {
    "department": "Water Supply & Sewerage Board",
    "contact": "Bhavnagar Municipal Water Dept",
    "sla_hours": {1: 72, 2: 48, 3: 24, 4: 12, 5: 6}
  },
  "STREETLIGHT": {
    "department": "Electricity Department",
    "contact": "PGVCL Bhavnagar Division",
    "sla_hours": {1: 120, 2: 72, 3: 48, 4: 24, 5: 12}
  },
  "GARBAGE": {
    "department": "Sanitation & Solid Waste Management",
    "contact": "Bhavnagar Municipal Corporation",
    "sla_hours": {1: 72, 2: 48, 3: 24, 4: 12, 5: 6}
  },
  "DRAINAGE": {
    "department": "Drainage & Sewerage Department",
    "contact": "BMC Drainage Cell",
    "sla_hours": {1: 96, 2: 72, 3: 48, 4: 24, 5: 12}
  },
  "OTHER": {
    "department": "General Municipal Admin",
    "contact": "BMC Helpdesk",
    "sla_hours": {1: 168, 2: 168, 3: 72, 4: 48, 5: 24}
  }
}

def route_issue(category: str, severity: int):
    cat_upper = category.upper() if category else "OTHER"
    if cat_upper not in DEPARTMENT_ROUTING:
        cat_upper = "OTHER"
        
    dept_info = DEPARTMENT_ROUTING[cat_upper]
    
    # Ensure severity is between 1 and 5
    safe_severity = max(1, min(5, severity))
    
    sla = dept_info["sla_hours"].get(safe_severity, 72)
    
    return {
        "department": dept_info["department"],
        "sla_hours": sla,
        "contact": dept_info["contact"]
    }
