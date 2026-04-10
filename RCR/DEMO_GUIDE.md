# RCR Demo Execution Guide 🚀

This guide outlines how to showcase the Resilience and AI Explainability features during the final demo.

## 1. AI Explainability (How & Why)
- **Scenario**: A user reports an emergency via voice.
- **HUD View**: In the `Tactical Dashboard`, open the `AI Command` panel (Right Panel).
- **Action**: Click "Initiate Neural Link" and record a voice message (e.g., "There is a fire in room 302, please help!").
- **Observation**: 
    - The **AI Reasoning Stream** will show real-time thought logs (e.g., "Extracting semantic intent...", "Invoking Gemini 1.5 Flash...").
    - Once processed, select the new incident.
    - View the **Logic Justification** card which explicitly articulates *why* the AI assigned that specific category and severity.
    - Look for the `AI_OPTIMIZED` badge vs `SAFE_MODE` for verified intel.

## 2. Resilience & Latency (Fail-safes)
- **Scenario**: Show how the system handles external service disruptions.
- **Controls**: Use the hidden demo buttons at the bottom of the "Voice Command" section.
- **High Latency Test**:
    - Click **"Sim Latency"**.
    - **Outcome**: The UI will stay in "Thinking..." state. If it exceeds 15 seconds, the frontend interceptor will trigger a **Latency Fail-safe**, logging "Network Timeout" and activating manual triage protocols.
- **Engine Failure Test**:
    - Click **"Sim Failure"**.
    - **Outcome**: The AI Service will simulate a 503 error. The HUD will immediately show **"System Error: Engine Disruption Detected"** and switch the incident to **SAFE_MODE** (Manual Triage Required), ensuring no emergency is ignored even if the AI is down.

## 3. Performance Transparency
- **HUD Vitals**: Check the bottom-right footer for "Sync Latency" and "Node Integrity".
- **Intel Cards**: Each incident card now tracks its own processing latency (ms) and displays an `AI_LOGIC_AVAIL` pulse if reasoning data is present.

---
**Technical Note**: All fail-safes are additive. The core redundant logic (Twilio SMS fallbacks, Socket.io heartbeats) remains active in the background.
