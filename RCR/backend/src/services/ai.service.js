// backend/src/services/ai.service.js
/**
 * AI verification service – uses Google Gemini (gemini‑1.5‑flash).
 * Enhanced for production-grade reliability with retries, robust parsing, and consistent fallbacks.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../config/env');

// -----------------------------------------------------------------
// 1️⃣  Initialise the Gemini client
// -----------------------------------------------------------------
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const MODEL_NAME = 'gemini-1.5-flash';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper to get the model with standard JSON configuration
 */
function getModel() {
    if (!genAI) return null;
    return genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: { responseMimeType: 'application/json' }
    });
}

/**
 * Robust JSON parser that handles markdown blocks and unexpected text
 */
function parseJsonSafely(raw) {
    if (!raw || typeof raw !== 'string') return null;

    let text = raw.trim();
    // Remove markdown code block wrappers if present (```json ... ```)
    if (text.startsWith('```')) {
        text = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    // Extract the first JSON object found in the text
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        return null;
    }

    const cleanJson = text.slice(firstBrace, lastBrace + 1);

    try {
        return JSON.parse(cleanJson);
    } catch (err) {
        console.error('[AI Service] JSON Parse Error:', err.message, '| Raw:', text.substring(0, 100));
        return null;
    }
}
/**
 * Calls Gemini with exponential backoff retry logic
 */
async function generateContentWithRetry(prompt, maxRetries = 3) {
    const startTime = Date.now();

    // 🚨 DEMO FAIL-SAFE SIMULATION
    const promptText = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
    if (promptText.includes('SIMULATE_AI_FAILURE')) {
        throw new Error('Simulated AI Engine Failure (503 Service Unavailable)');
    }
    if (promptText.includes('SIMULATE_HIGH_LATENCY')) {
        await sleep(3000); // Artificial 3s delay
    }

    const model = getModel();
    if (!model) throw new Error('Gemini API client not initialized');

    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const data = parseJsonSafely(text);
            if (data) {
                return {
                    ...data,
                    _internal: {
                        latencyMs: Date.now() - startTime,
                        retries: i,
                        model: MODEL_NAME
                    }
                };
            }
            
            throw new Error('Invalid JSON response from AI');
        } catch (err) {
            lastError = err;
            const isTransient = err.message.includes('503') || err.message.includes('429') || err.message.includes('quota');
            
            if (isTransient && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000;
                console.warn(`[AI Service] Transient error (attempt ${i + 1}/${maxRetries}), retrying in ${delay}ms...`);
                await sleep(delay);
                continue;
            }
            break;
        }
    }
    throw lastError;
}

// -----------------------------------------------------------------
// 2️⃣  Core Service Functions
// -----------------------------------------------------------------

/**
 * Deterministic spam filter to prevent API costs on obvious garbage
 */
function isObviousSpam(title, description) {
    const combined = `${title} ${description}`.toLowerCase();
    const spamKeywords = ['test', 'hello', 'asdf', 'qwerty', '12345'];
    
    // Check for short, nonsensical strings
    if (combined.length < 10) return true;
    
    // Check for explicit test strings
    if (spamKeywords.some(kw => combined === kw || combined.includes(` ${kw} `))) return true;
    
    return false;
}

/**
 * Comprehensive triage for hospitality incidents
 */
async function analyzeReport({
    title,
    description,
    category,
    userSeverity,
    mediaType,
    mediaBase64,
    floorLevel,
    roomNumber,
    wingId,
}) {
    const startTime = Date.now();

    // 0. Pre-filter Spam
    if (isObviousSpam(title, description)) {
        return {
            spamScore: 1.0,
            autoSeverity: 1,
            predictedCategory: 'SPAM',
            hospitalityCategory: 'INFRASTRUCTURE',
            translatedText: description,
            detectedLanguage: 'en',
            panicLevel: 'Low',
            actionPlan: ['Automatic rejection: Content identified as non-emergency or test data.'],
            requiredResources: [],
            reasoning: 'Input matched heuristic spam patterns (short length or test keywords).',
            isAiVerified: true,
            latencyMs: Date.now() - startTime
        };
    }

    const normalizedCategory = (category || '').toUpperCase();

    // Default fallback object (🚨 STANDARDIZED FIELD NAMES)
    const fallback = (reason) => ({
        spamScore: 0.0,
        autoSeverity: Math.max(userSeverity, 4),
        predictedCategory: 'UNVERIFIED',
        hospitalityCategory: 'INFRASTRUCTURE',
        translatedText: description || title || '',
        detectedLanguage: 'en',
        panicLevel: 'High',
        actionPlan: ['Manual emergency verification required immediately.'],
        requiredResources: ['Security Team', 'Management'],
        reasoning: `Safe Mode Active: ${reason}`,
        isAiVerified: false,
        latencyMs: Date.now() - startTime
    });

    if (!genAI) return fallback('AI Engine not initialized');

    const mediaContext = mediaType ? `A ${mediaType} file was attached.` : 'No media provided.';
    const textPrompt = `You are a hospitality crisis triage AI. Respond in strict JSON only.
Input: Title: "${title}", Desc: "${description}", Cat: "${normalizedCategory}", Floor: ${floorLevel}, Room: "${roomNumber}", Wing: "${wingId}", UserSev: ${userSeverity}. ${mediaContext}

Required Output Fields:
- translated_english_text: string
- detected_language: string
- panic_level: "High" | "Medium" | "Low"
- hospitality_category: "MEDICAL" | "FIRE" | "SECURITY" | "INFRASTRUCTURE"
- action_plan: string[]
- spam_score: number (0.0-1.0)
- auto_severity: number (1-5)
- predicted_category: string
- required_resources: string[]
- reasoning: string (Briefly explain your triage logic)`;

    const prompt = (mediaType && mediaBase64) ? {
        contents: [{
            parts: [
                { text: textPrompt },
                { inlineData: { mimeType: mediaType, data: mediaBase64 } }
            ]
        }]
    } : textPrompt;

    try {
        const data = await generateContentWithRetry(prompt);
        
        // Sanitize and validate output
        return {
            spamScore: (typeof data.spam_score === 'number') ? data.spam_score : 0.0,
            autoSeverity: (typeof data.auto_severity === 'number') ? Math.min(5, Math.max(1, Math.round(data.auto_severity))) : userSeverity,
            predictedCategory: String(data.predicted_category || data.hospitality_category || normalizedCategory).toUpperCase(),
            hospitalityCategory: ['MEDICAL', 'FIRE', 'SECURITY', 'INFRASTRUCTURE'].includes(String(data.hospitality_category).toUpperCase()) ? data.hospitality_category.toUpperCase() : 'INFRASTRUCTURE',
            translatedText: String(data.translated_english_text || description || title || ''),
            detectedLanguage: String(data.detected_language || 'en'),
            panicLevel: ['High', 'Medium', 'Low'].includes(data.panic_level) ? data.panic_level : 'Medium',
            actionPlan: Array.isArray(data.action_plan) ? data.action_plan : (Array.isArray(data.actionPlan) ? data.actionPlan : []),
            requiredResources: Array.isArray(data.required_resources) ? data.required_resources : (Array.isArray(data.requiredResources) ? data.requiredResources : []),
            reasoning: data.reasoning || 'Triage completed based on input analysis.',
            isAiVerified: true,
            latencyMs: data._internal?.latencyMs || (Date.now() - startTime)
        };
    } catch (err) {
        console.error('[AI Service] analyzeReport failed:', err.message);
        return fallback(`AI processing failed (${err.message})`);
    }
}

/**
 * Transcribe and triage voice reports
 */
async function analyzeVoice({ audioBase64, audioMimeType, floorLevel, roomNumber, wingId, lat, lng }) {
    const startTime = Date.now();
    const fallbackText = 'Voice report received but AI transcription failed.';
    const fallback = (reason) => ({
        translatedText: fallbackText,
        detectedLanguage: 'en',
        panicLevel: 'High',
        hospitalityCategory: 'INFRASTRUCTURE',
        actionPlan: ['Manual verification required'],
        spamScore: 0.0,
        autoSeverity: 3,
        predictedCategory: 'INFRASTRUCTURE',
        requiredResources: ['Security Team'],
        reasoning: `Safe Mode Active: ${reason}`,
        isAiVerified: false,
        latencyMs: Date.now() - startTime
    });

    if (!genAI) return fallback('AI Engine not initialized');

    const actualMimeType = audioMimeType || 'audio/webm';

    const prompt = {
        contents: [{
            parts: [
                { text: `Transcribe this SOS emergency audio and provide triage in JSON. Location: Floor ${floorLevel}, Room ${roomNumber}, Wing ${wingId} (Lat/Lng: ${lat},${lng}). Output: translated_english_text, detected_language, panic_level, hospitality_category (MEDICAL/FIRE/SECURITY/INFRASTRUCTURE), action_plan (string[]), spam_score, auto_severity, predicted_category, required_resources, reasoning (Briefly explain your transcription and triage logic).` },
                { inlineData: { mimeType: actualMimeType, data: audioBase64 } }
            ]
        }]
    };

    try {
        const data = await generateContentWithRetry(prompt);
        return {
            translatedText: data.translated_english_text || fallbackText,
            detectedLanguage: data.detected_language || 'en',
            panicLevel: data.panic_level || 'High',
            hospitalityCategory: data.hospitality_category || 'INFRASTRUCTURE',
            actionPlan: Array.isArray(data.action_plan) ? data.action_plan : (Array.isArray(data.actionPlan) ? data.actionPlan : []),
            spamScore: typeof data.spam_score === 'number' ? data.spam_score : 0.0,
            autoSeverity: typeof data.auto_severity === 'number' ? Math.round(data.auto_severity) : 5,
            predictedCategory: String(data.predicted_category || data.hospitality_category || 'INFRASTRUCTURE').toUpperCase(),
            requiredResources: Array.isArray(data.required_resources) ? data.required_resources : (Array.isArray(data.requiredResources) ? data.requiredResources : []),
            reasoning: data.reasoning || 'Voice triage completed.',
            isAiVerified: true,
            latencyMs: data._internal?.latencyMs || (Date.now() - startTime)
        };
    } catch (err) {
        console.error('[AI Service] analyzeVoice failed:', err.message);
        return fallback(`Voice processing failed (${err.message})`);
    }
}

module.exports = { analyzeReport, analyzeVoice, analyzeReportText: analyzeReport };