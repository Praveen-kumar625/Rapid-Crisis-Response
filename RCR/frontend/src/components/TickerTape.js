import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, Wind } from 'lucide-react';

export const TickerTape = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchExternalAlerts = async () => {
            const newAlerts = [];
            
            // 1. Fetch Earthquakes
            try {
                const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
                const data = await res.json();
                data.features?.slice(0, 3).forEach(f => {
                    newAlerts.push({
                        id: f.id,
                        text: `SEISMIC_EVENT_DETECTED: MAG ${f.properties.mag} - ${f.properties.place.toUpperCase()}`,
                        type: 'quake'
                    });
                });
            } catch (e) { console.error('Ticker: USGS Fail'); }

            // 2. Weather Advisory
            newAlerts.push({ id: 'w1', text: 'EXTERNAL_ADVISORY: HIGH WINDS EXPECTED IN SECTOR_NORTH // GRID_STABILITY: NOMINAL', type: 'weather' });
            
            setAlerts(newAlerts);
        };

        fetchExternalAlerts();
        const interval = setInterval(fetchExternalAlerts, 300000); 
        return () => clearInterval(interval);
    }, []);

    if (alerts.length === 0) return null;

    return (
        <div className="flex flex-1 overflow-hidden relative items-center h-full bg-black/40">
            <div className="flex items-center gap-4 bg-red-600 px-4 h-full shrink-0 z-10 shadow-[5px_0_15px_rgba(220,38,38,0.4)] border-r border-red-400">
                <AlertTriangle size={12} className="text-white animate-pulse" />
                <span className="text-[9px] font-black text-white uppercase tracking-[0.25em] italic">Live_Threat_Stream</span>
            </div>
            
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                <motion.div 
                    animate={{ x: [0, -1500] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-24 whitespace-nowrap px-10 h-full"
                >
                    {[...alerts, ...alerts, ...alerts].map((alert, i) => (
                        <div key={`${alert.id}-${i}`} className="flex items-center gap-4 group">
                            <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-cyan-500 transition-colors" />
                            {alert.type === 'quake' ? <Activity size={12} className="text-orange-500" /> : <Wind size={12} className="text-cyan-400" />}
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono group-hover:text-white transition-colors">
                                {alert.text}
                            </span>
                            <span className="text-slate-800 font-black tracking-widest">{" [///] "}</span>
                        </div>
                    ))}
                </motion.div>
                
                {/* Fade-out masks */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-0 pointer-events-none" />
            </div>
        </div>
    );
};

export default TickerTape;
