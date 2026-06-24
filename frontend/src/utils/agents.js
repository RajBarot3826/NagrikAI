export const analyzeImageLocally = async (imageBase64) => {
  // Mock function to simulate Gemini AI analysis
  // In a real scenario, this would call the backend /api/analyze endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        issue_detected: true,
        category: "POTHOLE",
        subcategory: "Deep crater on main road",
        severity: 4,
        severity_reason: "Deep enough to damage vehicles, located on active lane",
        title: "Severe Pothole on Main Road",
        description: "A large, deep pothole is visible in the middle of the road, posing a significant hazard to two-wheelers and cars.",
        estimated_impact: "High traffic area, hundreds of vehicles affected daily",
        department: "Roads & Infrastructure Department",
        sla_hours: 48,
        tags: ["road damage", "safety hazard", "urgent"],
        location_hints: "Near a visible stop sign and crosswalk",
        safety_risk: true,
        confidence: 0.95,
        action_items: ["Fill pothole immediately", "Check surrounding asphalt for weakness"]
      });
    }, 8000); // 8s to match the animation duration
  });
};
