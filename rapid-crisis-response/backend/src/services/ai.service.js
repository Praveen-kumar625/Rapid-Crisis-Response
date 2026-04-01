// backend/src/services/ai.service.js
/**
 * AI verification service – uses Google Gemini (gemini‑1.5‑flash).
 * Returns a strict JSON:
 *   {
 *     spam_score: number (0.0 – 1.0),
 *     auto_severity: number (1 – 5)
 *   }
 *
 * If the Gemini API call fails (network, quota, parsing, etc.) the function
 * falls back to safe defaults: spam_score = 0.0 and auto_severity = userSeverity.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../config/env');

// -----------------------------------------------------------------
// 1️⃣  Initialise the Gemini client (once)
// -----------------------------------------------------------------
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const MODEL_NAME = 'gemini-1.5-flash';

// -----------------------------------------------------------------
// 2️⃣  Build a concise system prompt that forces Gemini to return ONLY JSON
// -----------------------------------------------------------------
function buildPrompt({ title, description, userSeverity }) {
    return `
You are an incident‑verification assistant.

Given an incident **title** and **description**, you must output a **single JSON object** (no extra text) with these fields:

{
  "spam_score": <float between 0.0 (not spam) and 1.0 (definitely spam)>,
  "auto_severity": <integer between 1 and 5>
}

- spam_score should be high if the content looks like spam, test data, advertisement, or nonsense.
- auto_severity should reflect how critical the incident sounds; if you are unsure, return the original userSeverity.

**Title:** """${title}"""
**Description:** """${description}"""
**User‑provided severity:** ${userSeverity}
`.trim();
}

// -----------------------------------------------------------------
// 3️⃣  Public verify() function
// -----------------------------------------------------------------
async function verify({ title, description, userSeverity }) {
    // -----------------------------------------------------------------
    //   Fast‑path – no API key → return defaults immediately
    // -----------------------------------------------------------------
    if (!genAI) {
        return {
            spam_score: 0.0,
            auto_severity: userSeverity,
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const prompt = buildPrompt({ title, description, userSeverity });
        const result = await model.generateContent(prompt);
        const text = await result.response.text();

        // Gemini is instructed to emit only JSON, so we can safely parse.
        const data = JSON.parse(text);

        // -----------------------------------------------------------------
        //   Validate / sanitize the returned values
        // -----------------------------------------------------------------
        const spam_score =
            typeof data.spam_score === 'number' && data.spam_score >= 0 && data.spam_score <= 1 ?
            data.spam_score :
            0.0;

        const auto_severity =
            typeof data.auto_severity === 'number' &&
            data.auto_severity >= 1 &&
            data.auto_severity <= 5 ?
            Math.round(data.auto_severity) :
            userSeverity;

        return { spam_score, auto_severity };
    } catch (err) {
        console.error('[AI Service] Verification failed – falling back to defaults:', err);
        // -----------------------------------------------------------------
        //   Fallback defaults
        // -----------------------------------------------------------------
        return {
            spam_score: 0.0,
            auto_severity: userSeverity,
        };
    }
}

module.exports = { verify };