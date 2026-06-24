# NagrikAI: AI-Powered Civic Intelligence Platform

## Tagline
**"Every Pothole. Every Voice. Empowering Citizens through AI."**

---

## 1. Executive Summary
NagrikAI is an end-to-end, autonomous civic management platform designed to bridge the massive gap between citizens and municipal authorities. By leveraging advanced multimodal AI (Google Gemini 2.0 Flash) and an intelligent multi-agent backend architecture, NagrikAI removes all friction from reporting urban issues like potholes, broken streetlights, and sanitation hazards. It transforms raw, unstructured data (photos and multilingual voice notes) into structured, actionable tickets, instantly routing them to the correct municipal departments while tracking Service Level Agreements (SLAs).

---

## 2. The Problem Statement
Urban infrastructure management in developing nations suffers from a critical data and communication bottleneck:
*   **High Friction Reporting:** Citizens are deterred from reporting civic issues due to complex municipal forms, bureaucratic hurdles, and unoptimized digital portals.
*   **Language & Literacy Barriers:** Millions of citizens are excluded from digital civic participation due to text-heavy interfaces and lack of regional language support.
*   **Municipal Overload:** City administrators are overwhelmed by duplicate reports, manual triage processes, and a lack of real-time geospatial data to prioritize maintenance effectively.
*   **Lack of Accountability:** Citizens rarely receive updates on their reports, leading to civic apathy.

---

## 3. The NagrikAI Solution
NagrikAI acts as a **municipal force-multiplier** by transforming everyday citizens into "smart sensors" for the city. It solves the friction of civic reporting through an intelligent, automated pipeline:

### A. Zero-Friction Multimodal Input (Citizen Interface)
*   **Vision AI Processing:** Users no longer need to fill out 10-page forms. They simply snap a photo of the anomaly. The Gemini 2.0 Vision Agent automatically analyzes the image, categorizes the issue (e.g., Road Hazard, Water Leak), assesses its severity (High/Medium/Low), and extracts contextual clues.
*   **Multilingual Voice AI:** To eradicate the digital literacy barrier, the platform includes an intelligent Voice Mode. Citizens can speak naturally in **Hindi, Gujarati, or English**. The Voice Agent transcribes the audio, translates it to English, and structures the unstructured rant into a formal ticket with category, location, and severity data in milliseconds.

### B. Autonomous Multi-Agent Triage (The "Brain")
Once a report is submitted, NagrikAI’s backend utilizes a swarm of specialized AI agents:
*   **The Deduplication Agent:** Geofences incoming reports against currently open issues within a specific radius. If a citizen reports a pothole that has already been flagged, the agent marks it as a "duplicate" and simply adds an upvote to the existing ticket, preventing municipal spam.
*   **The Routing Agent:** Analyzes the structured ticket and autonomously calculates the SLA (Service Level Agreement) timeline based on severity. It then assigns the issue to the precise municipal department responsible (e.g., Water Supply Board, Public Works Department, Electrical Grid).
*   **The Escalation Agent:** Continuously monitors the database. If a High-Severity issue exceeds its SLA timeline without being resolved, the agent automatically flags it and generates an escalation notice for higher-level administrators.

### C. Civic Command Center (Admin Dashboard)
*   **Real-Time Geospatial Heatmap:** A highly interactive Leaflet.js map provides city administrators with a live, bird's-eye view of urban anomalies. Issues are clustered by severity, allowing repair crews to optimize their dispatch routes.
*   **Department Performance Metrics:** Live statistics track how many issues are open, in progress, and resolved, keeping municipal departments accountable.
*   **Gamified Civic Leaderboard:** To encourage civic engagement, citizens earn "Impact Scores" and badges (e.g., "Civic Hero") for verified reports, turning infrastructure maintenance into a community-driven effort.

---

## 4. Technical Architecture & Data Flow

1.  **Frontend Generation:** The React/Vite frontend captures the user's location via the browser's Geolocation API, captures an image via the device camera, or captures audio via the Web Speech API.
2.  **API Ingestion:** The payload is sent to the FastAPI Python backend.
3.  **AI Analysis:** The backend invokes the Google Gemini 2.0 Flash models (via the `genai` SDK) to perform multimodal analysis (Image-to-Text or Speech-to-Text inference).
4.  **Agentic Workflow:** The parsed data is passed through the `Routing Agent` and `Deduplication Agent`.
5.  **Database Storage:** The highly structured, actionable ticket is saved into the SQLite database.
6.  **Real-Time Rendering:** The React dashboard fetches the updated database via REST API and live-updates the UI, statistics, and Leaflet map markers.

---

## 5. Why This Project Wins (Hackathon Viability)
*   **High Social Impact:** Directly addresses a massive, real-world problem affecting millions of people daily.
*   **Extreme Accessibility:** The inclusion of Hindi and Gujarati voice processing makes the app usable by a vast majority of the Indian population, regardless of digital literacy.
*   **Advanced AI Utilization:** Moves beyond simple chatbots by implementing an autonomous "Agentic" backend architecture and multimodal vision models.
*   **Production-Ready UI/UX:** Features a stunning, glassmorphic, mobile-first design with smooth Framer Motion animations that wows judges immediately.

---

## 6. Comprehensive Tech Stack
*   **Frontend Framework:** React.js, Vite
*   **Styling & UI:** Vanilla CSS, Tailwind CSS conventions, Framer Motion (micro-animations), Glassmorphism UI
*   **Geospatial Mapping:** Leaflet.js, React-Leaflet
*   **Backend Framework:** Python, FastAPI, Uvicorn
*   **Artificial Intelligence:** Google Gemini 2.0 Flash API (Vision and Text models)
*   **Database:** SQLite (SQLAlchemy ORM)
*   **Deployment Architecture:** Unified local deployment via secure Ngrok tunneling.
