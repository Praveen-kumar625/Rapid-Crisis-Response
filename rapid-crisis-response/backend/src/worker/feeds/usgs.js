const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * Pulls the last‑hour earthquake feed from USGS and returns an array of
 * Incident objects that match our DB schema (minus DB fields like `id`).
 */
async function fetchUSGS() {
    const url =
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
    try {
        const { data } = await axios.get(url, { timeout: 8000 });
        const features = data.features || [];

        const incidents = features.map((f) => {
            const props = f.properties;
            const mag = props.mag || 0;
            const severity = Math.min(5, Math.max(1, Math.round(mag)));
            const [lng, lat] = f.geometry.coordinates; // [lon, lat, depth]

            return {
                id: uuidv4(),
                title: `Earthquake M${mag}`,
                description: props.place,
                severity,
                category: 'EARTHQUAKE',
                location: { type: 'Point', coordinates: [lng, lat] },
                reportedBy: 'USGS_FEED',
                status: 'OPEN',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                externalId: f.id,
            };
        });

        return incidents;
    } catch (err) {
        console.error('⚡ USGS fetch error', err.message);
        return [];
    }
}

module.exports = { fetchUSGS };