// frontend/src/components/CrisisMap.js
import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import api from '../api';
import { getSocket } from '../socket';

const RESPONDER_HQ = { lat: 28.6139, lng: 77.2090 }; // New Delhi Defaults

function CrisisMap() {
    const [incidents, setIncidents] = useState([]);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);

    useEffect(() => {
        api.get('/incidents').then((res) => setIncidents(res.data)).catch(console.error);

        let cancelled = false;
        (async() => {
            const socket = await getSocket();
            socket.on('incident.created', (payload) => {
                if (!cancelled) setIncidents((prev) => [...prev, payload.incident]);
            });
            socket.on('incident.status-updated', (payload) => {
                if (!cancelled) {
                    setIncidents((prev) => prev.map((i) => (i.id === payload.incident.id ? payload.incident : i)));
                }
            });
        })();
        return () => { cancelled = true; };
    }, []);

    const calculateRoute = async(lat, lng) => {
        if (!window.google) return;
        const directionsService = new window.google.maps.DirectionsService();
        try {
            const results = await directionsService.route({
                origin: RESPONDER_HQ,
                destination: { lat, lng },
                travelMode: window.google.maps.TravelMode.DRIVING,
            });
            setDirectionsResponse(results);
        } catch (error) {
            console.error("Directions request failed", error);
        }
    };

    return ( <
        div style = {
            { width: '100%', height: 'calc(100vh - 70px)' } } >
        <
        APIProvider apiKey = { process.env.REACT_APP_GOOGLE_MAPS_API_KEY } >
        <
        Map defaultCenter = { RESPONDER_HQ }
        defaultZoom = { 11 }
        mapId = "CRISIS_MAP_ID"
        onIdle = {
            (map) => {
                if (!directionsRenderer && map) {
                    const renderer = new window.google.maps.DirectionsRenderer();
                    renderer.setMap(map);
                    setDirectionsRenderer(renderer);
                }
            }
        } >
        <
        AdvancedMarker position = { RESPONDER_HQ } >
        <
        Pin background = { '#0f9d58' }
        borderColor = { '#000' }
        glyphColor = { '#fff' }
        /> <
        /AdvancedMarker>

        {
            incidents.map((inc) => ( <
                AdvancedMarker key = { inc.id }
                position = {
                    { lat: inc.location.coordinates[1], lng: inc.location.coordinates[0] } }
                onClick = {
                    () => calculateRoute(inc.location.coordinates[1], inc.location.coordinates[0]) } >
                <
                Pin background = { '#db4437' }
                borderColor = { '#880000' }
                glyphColor = { '#fff' }
                /> <
                /AdvancedMarker>
            ))
        } <
        /Map>

        { directionsRenderer && directionsResponse && directionsRenderer.setDirections(directionsResponse) } <
        /APIProvider> <
        /div>
    );
}

export default CrisisMap;