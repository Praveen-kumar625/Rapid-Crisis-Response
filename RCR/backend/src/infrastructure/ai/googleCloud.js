const speech = require('@google-cloud/speech');
const { TranslationServiceClient } = require('@google-cloud/translate');

// Google Cloud Speech-to-Text client
const speechClient = new speech.SpeechClient();

// Google Cloud Translation client
const translateClient = new TranslationServiceClient();

/**
 * Transcribe audio using Google Cloud Speech-to-Text.
 * Supports auto-detection of the spoken language.
 * 
 * PHASE 2: Refactored with optional chaining and robust fallbacks.
 */
async function transcribeAudio(audioBuffer, mimeType) {
    // Input validation
    if (!audioBuffer || audioBuffer.length === 0) {
        console.warn('[Google STT] Empty audio buffer received');
        return { transcription: 'Transcription unavailable: No audio data', detectedLanguage: 'unknown' };
    }

    const request = {
        audio: {
            content: audioBuffer.toString('base64'),
        },
        config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-US',
            alternativeLanguageCodes: ['es-ES', 'fr-FR', 'de-DE', 'zh-CN', 'hi-IN'],
            enableAutomaticPunctuation: true,
        },
    };

    if (mimeType && mimeType.includes('wav')) {
        request.config.encoding = 'LINEAR16';
        delete request.config.sampleRateHertz;
    }

    try {
        const [response] = await speechClient.recognize(request);
        
        // Defensive Programming: Never assume results is an array or has elements
        const results = response?.results || [];
        
        if (results.length === 0) {
            console.info('[Google STT] No speech detected in audio');
            return { 
                transcription: 'Transcription unavailable: Silence or background noise detected', 
                detectedLanguage: 'unknown' 
            };
        }

        const transcription = results
            .map(result => result?.alternatives?.[0]?.transcript || '')
            .filter(text => text !== '')
            .join('\n');
        
        const detectedLanguage = results[0]?.languageCode || 'unknown';
        
        return { 
            transcription: transcription || 'Transcription unavailable: Speech not understood', 
            detectedLanguage 
        };
    } catch (err) {
        console.error('[Google STT] Critical Service Error:', err.message);
        // Fail gracefully by returning a structured object instead of throwing
        return { 
            transcription: 'Transcription unavailable: Service error', 
            detectedLanguage: 'unknown',
            error: err.message 
        };
    }
}

/**
 * Translate text to English using Google Cloud Translation API.
 * 
 * PHASE 2: Refactored with optional chaining and robust fallbacks.
 */
async function translateToEnglish(text, sourceLanguageCode) {
    if (!text || sourceLanguageCode === 'en' || sourceLanguageCode?.startsWith('en-')) {
        return text || '';
    }

    const projectId = process.env.GOOGLE_PROJECT_ID || 'rapid-crisis-response';
    const location = 'global';

    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain',
        sourceLanguageCode: sourceLanguageCode === 'unknown' ? undefined : sourceLanguageCode,
        targetLanguageCode: 'en-US',
    };

    try {
        const [response] = await translateClient.translateText(request);
        
        // Defensive Programming: Safely access translation results
        const translations = response?.translations || [];
        const translatedText = translations[0]?.translatedText;

        if (!translatedText) {
            console.warn('[Google Translate] No translation returned from API');
            return text; // Fallback to original
        }

        return translatedText;
    } catch (err) {
        console.error('[Google Translate] Critical Service Error:', err.message);
        return text; // Fallback to original text on any failure
    }
}

module.exports = {
    transcribeAudio,
    translateToEnglish,
};
