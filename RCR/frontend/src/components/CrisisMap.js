import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { X, Navigation, LocateFixed, Shield, AlertCircle } from 'lucide-react';
import api from '../api';
import { getSocket } from '../socket';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const RESPONDER_HQ = { lat: 28.6139, lng: 77.2090 };

/**
 * 🚨 DIAGNOSTIC REPORT: MAP FAILURE FIX
 * Root Causes & Solutions:
 * 1. mapId Dependency: AdvancedMarker often requires a valid Map ID from Google Cloud Console. 
 *    Switching to standard Marker for maximum compatibility.
 * 2. API Key Visibility: Added checks to ensure the API key is actually present.
 * 3. Container Sizing: Map component now has absolute-fill properties to ensure it fills the parent.
 * 4. Coordinate Validation: Added more rigorous checks for lat/lng types.
 */

function CrisisMap() {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [mapError, setMapError] = useState(null);

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        let isMounted = true;
        let socketInstance = null;

        if (!apiKey) {
            setMapError('Google Maps API Key is missing. Check your .env file.');
        }

        api.get('/incidents').then((res) => {
            if (isMounted) setIncidents(res.data);
        }).catch(err => {
            console.error('[Map] Failed to fetch incidents:', err);
        });

        const handleCreated = (payload) => {
            if (isMounted) setIncidents((prev) => [payload.incident, ...prev]);
        };

        const handleStatusUpdated = (payload) => {
            if (isMounted) {
                setIncidents((prev) => prev.map((i) => (i.id === payload.incident.id ? payload.incident : i)));
            }
        };

        (async() => {
            try {
                socketInstance = await getSocket();
                if (!isMounted || !socketInstance) return;
                socketInstance.on('incident.created', handleCreated);
                socketInstance.on('incident.status-updated', handleStatusUpdated);
            } catch (err) {
                console.error('[Map] Socket connection failed:', err);
            }
        })();

        return () => { 
            isMounted = false; 
            if (socketInstance) {
                socketInstance.off('incident.created', handleCreated);
                socketInstance.off('incident.status-updated', handleStatusUpdated);
            }
        };
    }, [apiKey]);

    const handleMarkerClick = useCallback((inc) => {
        setSelectedIncident(inc);
    }, []);

    const markers = useMemo(() => incidents.map((inc) => {
        const lat = Number(inc.location?.coordinates[1] || inc.lat);
        const lng = Number(inc.location?.coordinates[0] || inc.lng);

        if (isNaN(lat) || isNaN(lng)) return null;

        return (
            <Marker 
                key={inc.id}
                position={{ lat, lng }}
                onClick={() => handleMarkerClick(inc)}
                title={inc.title}
            />
        );
    }), [incidents, handleMarkerClick]);

    if (mapError) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-navy-950 p-12 text-center">
                <AlertCircle size={48} className="text-danger mb-6" />
                <h2 className="text-2xl font-black text-white uppercase mb-4">Map Configuration Error</h2>
                <p className="text-slate-400 max-w-md">{mapError}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full min-h-[500px] bg-navy-950 overflow-hidden flex-1">
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={RESPONDER_HQ}
                    defaultZoom={13}
                    disableDefaultUI={false}
                    gestureHandling="greedy"
                    className="w-full h-full"
                    mapTypeId={'roadmap'}
                >
                    {/* HQ Marker */}
                    <Marker 
                        position={RESPONDER_HQ} 
                        label="HQ"
                    />

                    {markers}

                    {selectedIncident && (
                        <InfoWindow
                            position={{ 
                                lat: Number(selectedIncident.location?.coordinates[1] || selectedIncident.lat), 
                                lng: Number(selectedIncident.location?.coordinates[0] || selectedIncident.lng) 
                            }}
                            onCloseClick={() => setSelectedIncident(null)}
                        >
                            <div className="p-2 text-navy-950">
                                <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">{selectedIncident.title}</h4>
                                <p className="text-xs mb-2 line-clamp-2">{selectedIncident.description}</p>
                                <button 
                                    className="text-[10px] font-black uppercase text-accent bg-navy-900 px-3 py-1.5 rounded-lg w-full"
                                    onClick={() => navigate(`/incidents/${selectedIncident.id}`)}
                                >
                                    View Full Intel
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>

            {/* Floating UI Elements */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10 pointer-events-none">
                <Card variant="panel" className="flex items-center px-5 py-3 gap-4 border border-white/10 shadow-2xl backdrop-blur-2xl pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-danger" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Signal Feed</span>
                    </div>
                    <div className="w-px h-4 bg-white/10"></div>
                    <div className="flex items-center gap-2">
                        <LocateFixed size={16} className="text-secondary" />
                        <span className="text-xs font-mono font-bold text-secondary">{incidents.length} ACTIVE NODES</span>
                    </div>
                </Card>
            </div>

            {/* Selected Incident Detail Side Panel */}
            {selectedIncident && (
                <div className="absolute top-6 right-6 w-full max-w-[360px] z-20 px-6 sm:px-0 animate-in slide-in-from-right-8 fade-in duration-500 hidden md:block">
                    <Card className="p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-t-2 border-t-white/10 relative overflow-hidden" glowing={selectedIncident.severity >= 4}>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <Badge variant={selectedIncident.severity >= 4 ? 'danger' : 'accent'}>LVL {selectedIncident.severity}</Badge>
                                    <Badge variant="neutral" className="uppercase text-[9px]">{selectedIncident.category}</Badge>
                                </div>
                                <h3 className="text-xl font-black tracking-tight text-white uppercase leading-tight">{selectedIncident.title}</h3>
                            </div>
                            <button onClick={() => setSelectedIncident(null)} className="p-2 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <p className="text-slate-400 text-xs font-light leading-relaxed mb-6 line-clamp-3">{selectedIncident.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-navy-950/50 p-3 rounded-xl border border-white/5">
                                <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-1"><Navigation size={10} /> ZONE</p>
                                <p className="text-[10px] font-bold text-slate-200 font-mono uppercase">W_{selectedIncident.wingId}</p>
                            </div>
                            <div className="bg-navy-950/50 p-3 rounded-xl border border-white/5">
                                <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-1"><LocateFixed size={10} /> COORDS</p>
                                <p className="text-[10px] font-bold text-slate-200 font-mono">FL_{selectedIncident.floorLevel} {'//'} R_{selectedIncident.roomNumber}</p>
                            </div>
                        </div>

                        <Button 
                            className="btn-accent w-full py-4 text-[10px] font-black uppercase"
                            onClick={() => navigate(`/incidents/${selectedIncident.id}`)}
                        >
                            Review Node Data
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default CrisisMap;
