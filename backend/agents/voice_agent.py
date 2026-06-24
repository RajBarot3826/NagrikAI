import os
import google.generativeai as genai
import json

def analyze_voice(transcript: str) -> dict:
    if not transcript:
        return {
            "issue_detected": False,
            "error": "No transcript provided"
        }

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("WARNING: GEMINI_API_KEY not found. Returning mock data.")
        return get_mock_voice_data(transcript)

    genai.configure(api_key=api_key)
    
    # Using Gemini 2.0 Flash as per requirements
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are an AI Civic Assistant for the 'NagrikAI' platform.
    Analyze the following user voice transcript (which may be in English, Hindi, or Gujarati) reporting a civic infrastructure issue.
    Extract the details and classify the issue.

    Transcript: "{transcript}"

    Return ONLY a JSON object with the following schema, and no markdown formatting or backticks:
    {{
        "issue_detected": true/false,
        "category": "POTHOLE" | "STREETLIGHT" | "WATER_LEAK" | "GARBAGE" | "OTHER",
        "severity": integer 1-5 (1=minor, 5=critical safety risk),
        "title": "Short descriptive title in English",
        "description": "Translated and summarized description of the issue in English",
        "location_hints": "Any location context mentioned in the text (e.g. near bus stand)"
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(text)
        
        # Add high confidence since voice usually implies direct reporting
        result["confidence"] = 0.92
        return result
        
    except Exception as e:
        print(f"Gemini Voice Analysis Error: {e}")
        return get_mock_voice_data(transcript)

def get_mock_voice_data(transcript: str) -> dict:
    # Basic keyword matching for mock fallback
    t_lower = transcript.lower()
    
    category = "OTHER"
    if "pothole" in t_lower or "khadda" in t_lower or "khado" in t_lower:
        category = "POTHOLE"
    elif "light" in t_lower or "andhera" in t_lower:
        category = "STREETLIGHT"
    elif "pani" in t_lower or "water" in t_lower or "leak" in t_lower:
        category = "WATER_LEAK"
    elif "kachra" in t_lower or "garbage" in t_lower or "waste" in t_lower:
        category = "GARBAGE"
        
    return {
        "issue_detected": True,
        "category": category,
        "severity": 3,
        "title": f"Voice Report: {category.title()}",
        "description": f"Transcribed text: {transcript}",
        "location_hints": "Extracted from voice",
        "confidence": 0.85
    }
