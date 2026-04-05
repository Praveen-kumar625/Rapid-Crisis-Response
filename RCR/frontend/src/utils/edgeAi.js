/**
 * Edge AI Engine - Offline Triage for RCR
 * Performs semantic analysis on device without network connectivity.
 */

const CATEGORY_KEYWORDS = {
    FIRE: ['fire', 'smoke', 'burning', 'explosion', 'flame', 'spark', 'gas leak'],
    MEDICAL: ['hurt', 'blood', 'bleeding', 'unconscious', 'faint', 'pain', 'breathing', 'heart', 'injury', 'attack', 'stroke'],
    SECURITY: ['intruder', 'gun', 'weapon', 'fight', 'theft', 'stolen', 'broken', 'suspicious', 'threat', 'assault'],
    INFRASTRUCTURE: ['leak', 'water', 'pipe', 'electric', 'power', 'elevator', 'lift', 'ac', 'hvac', 'structural', 'collapse']
};

const SEVERITY_KEYWORDS = {
    5: ['trapped', 'explosion', 'unconscious', 'active', 'immediate', 'dying', 'cannot breathe', 'weapon', 'gun', 'fire'],
    4: ['bleeding', 'large', 'major', 'urgent', 'danger', 'broken', 'stroke', 'attack'],
    3: ['pain', 'stolen', 'leak', 'issue', 'malfunction'],
    2: ['slow', 'small', 'minor', 'checking', 'maintenance'],
    1: ['test', 'check', 'normal', 'drill']
};

export function localAnalyze(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    let predictedCategory = 'INFRASTRUCTURE';
    let maxCatMatches = 0;

    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        const matches = keywords.filter(kw => text.includes(kw)).length;
        if (matches > maxCatMatches) {
            maxCatMatches = matches;
            predictedCategory = cat;
        }
    }

    let autoSeverity = 3;
    let maxSevMatches = 0;

    for (const [sev, keywords] of Object.entries(SEVERITY_KEYWORDS)) {
        const matches = keywords.filter(kw => text.includes(kw)).length;
        if (matches > maxSevMatches) {
            maxSevMatches = matches;
            autoSeverity = parseInt(sev);
        }
    }

    // Heuristic boost: High-risk categories with emergency markers
    const emergencyMarkers = ['help', 'sos', 'emergency', 'now', 'quick', 'fast'];
    if (emergencyMarkers.some(m => text.includes(m))) {
        autoSeverity = Math.min(5, autoSeverity + 1);
    }

    if ((predictedCategory === 'FIRE' || predictedCategory === 'MEDICAL') && autoSeverity < 4) {
        autoSeverity = 4; // Floor for critical categories
    }

    return {
        category: predictedCategory,
        severity: autoSeverity,
        isLocal: true,
        triageMethod: 'Edge AI (Heuristic V2)'
    };
}
