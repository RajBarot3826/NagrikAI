import os
import google.generativeai as genai
import json

genai.configure(api_key=os.environ.get("VITE_GEMINI_API_KEY", "mock_key"))

INSIGHTS_PROMPT = """
You are the NagrikAI Analytics Engine. Based on this civic issue data:

{issue_stats_json}

Generate exactly 4 actionable insights for city administrators. Each insight must:
1. Identify a specific trend or anomaly
2. Reference actual numbers from the data
3. Suggest a concrete action
4. Be written in crisp English under 25 words

Return ONLY a JSON array with exactly 4 objects matching this format:
[
  {"icon": "📈", "insight": "...", "severity": "info|warning|critical", "action": "..."},
  ...
]
"""

def generate_insights(stats: dict):
    if os.environ.get("VITE_GEMINI_API_KEY", "mock_key") == "mock_key":
        return [
            {"icon": "📈", "insight": "Pothole reports up 34% near NH-8A — likely monsoon damage", "severity": "warning", "action": "Deploy road patching crew to NH-8A immediately."},
            {"icon": "⚡", "insight": "Streetlight issues highest in Ward 12 — SLA breach risk in 18 hrs", "severity": "critical", "action": "Escalate to PGVCL for Ward 12 night patrol."},
            {"icon": "✅", "insight": "Water leak resolution rate improved 23% after last week's civic drive", "severity": "info", "action": "Continue current water maintenance schedules."},
            {"icon": "🔮", "insight": "Predicted: 15-20 new drainage issues expected this weekend (monsoon forecast)", "severity": "warning", "action": "Preemptively clear major drains in low-lying areas."}
        ]
        
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = INSIGHTS_PROMPT.replace("{issue_stats_json}", json.dumps(stats))
        response = model.generate_content(prompt)
        text = response.text
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        return json.loads(text)
    except Exception as e:
        print(f"Error in InsightsAgent: {e}")
        return []
