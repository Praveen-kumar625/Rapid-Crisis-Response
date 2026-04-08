/**
 * Rapid Crisis Response - Z-Axis Spatial Routing Engine
 * Provides context-aware evacuation paths based on building layout and hazard level.
 */

export function getSafeRoute(incident) {
    const { floorLevel, wingId, category, severity } = incident;
    const isHighPriority = severity >= 4;
    const isFire = category === 'FIRE';

    const route = {
        primaryPath: '',
        hazards: [],
        estimatedTime: '4-6 Minutes',
        recommendations: []
    };

    // 1. Z-Axis Logic (Vertical Movement)
    if (floorLevel > 1) {
        if (isFire) {
            route.primaryPath = `Descend via Emergency Staircase [${wingId}-ST-02].`;
            route.recommendations.push('DO NOT USE ELEVATORS - Fire suppression system may disable them.');
        } else {
            route.primaryPath = `Proceed to Service Lift [${wingId}-EL-01] or Main Staircase.`;
        }
    } else {
        route.primaryPath = `Proceed to Ground Exit [${wingId}-EX-MAIN].`;
    }

    // 2. Wing-specific Lateral Logic
    if (wingId === 'NORTH' || wingId === 'A') {
        route.primaryPath += ' Exit through North Plaza.';
    } else if (wingId === 'SOUTH' || wingId === 'B') {
        route.primaryPath += ' Exit via South Lobby.';
    }

    // 3. Category Hazards
    if (isFire) {
        route.hazards.push('Smoke inhalation risk in hallways.');
        route.recommendations.push('Stay low to the ground.');
    }
    
    if (category === 'SECURITY') {
        route.hazards.push('Potential lockdown in progress.');
        route.recommendations.push('Await security clearance before moving through central atrium.');
    }

    if (isHighPriority) {
        route.estimatedTime = '2-3 Minutes (Priority Clearance)';
    }

    return route;
}
