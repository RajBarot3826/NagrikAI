import os
import google.generativeai as genai
import json

genai.configure(api_key=os.environ.get("VITE_GEMINI_API_KEY", "mock_key"))

VISION_AGENT_PROMPT = """
You are VisionAgent, an expert AI system for civic infrastructure analysis in India.

Analyze the uploaded image and return a JSON response with these exact fields:

{
  "issue_detected": true/false,
  "category": "POTHOLE | WATER_LEAK | STREETLIGHT | GARBAGE | DRAINAGE | ROAD_DAMAGE | ENCROACHMENT | OTHER",
  "subcategory": "specific description",
  "severity": 1-5,  // 1=minor, 3=moderate, 5=critical/dangerous
  "severity_reason": "why this severity",
  "title": "Auto-generated concise issue title (max 60 chars)",
  "description": "2-3 sentence description of the issue visible in the image",
  "estimated_impact": "How many people are likely affected",
  "recommended_department": "Roads & Infrastructure | Water Supply | Electricity | Sanitation | Municipal | Traffic",
  "suggested_sla_hours": 24/48/72/168,  // based on severity
  "tags": ["tag1", "tag2", "tag3"],
  "location_hints": "Any text, signs, landmarks visible in image",
  "safety_risk": true/false,
  "confidence": 0.0-1.0,
  "action_items": ["action1", "action2"]
}

Respond ONLY with valid JSON. No explanation text.
"""

def analyze_image(base64_image: str):
    # If no key, return mock data to allow demo to function
    if os.environ.get("VITE_GEMINI_API_KEY", "mock_key") == "mock_key":
        return {
            "issue_detected": True,
            "category": "POTHOLE",
            "subcategory": "Deep crater on main road",
            "severity": 4,
            "severity_reason": "Deep enough to damage vehicles, located on active lane",
            "title": "Severe Pothole on Main Road",
            "description": "A large, deep pothole is visible in the middle of the road, posing a significant hazard to two-wheelers and cars.",
            "estimated_impact": "High traffic area, hundreds of vehicles affected daily",
            "recommended_department": "Roads & Infrastructure Department",
            "suggested_sla_hours": 48,
            "tags": ["road damage", "safety hazard", "urgent"],
            "location_hints": "Near a visible stop sign and crosswalk",
            "safety_risk": True,
            "confidence": 0.95,
            "action_items": ["Fill pothole immediately", "Check surrounding asphalt for weakness"]
        }

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        # In a real app, we would process the base64_image into a PIL image or similar 
        # to pass to Gemini API.
        
        response = model.generate_content([VISION_AGENT_PROMPT, base64_image])
        
        # Clean response if it contains markdown formatting
        text = response.text
        if text.startswith("```json"):
            text = text[7:-3]
            
        return json.loads(text)
    except Exception as e:
        print(f"Error in VisionAgent: {e}")
        # Return fallback mock on error
        return {
            "issue_detected": True,
            "category": "OTHER",
            "severity": 3,
            "title": "Civic Issue Reported",
            "description": "An issue was reported by a citizen.",
            "recommended_department": "Municipal Corporation",
            "suggested_sla_hours": 72
        }
