wimport React, { useState, useEffect }
from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Radio, CloudRain, Sun, Wind, CloudLightning, Thermometer, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from './ui/Badge';

import { getCachedExternalData, cacheExternalData } from '../idb';

const WeatherIcon = ({ condition }) => {
    if (condition ? .includes('rain')) return <CloudRain className = "text-cyan-400"
    size = { 16 }
    />;
    if (condition ? .includes('storm')) return <CloudLightning className = "text-warning"
    size = { 16 }
    />;
    if (condition ? .includes('clear')) return <Sun className = "text-warning"
    size = { 16 }
    />;
    return <Wind className = "text-slate-400"
    size = { 16 }
    />;
};

export const IntelFeed = ({ incidents, onSelectIncident }) => {
    const [weather, setWeather] = useState(null);
    const [weatherError, setWeatherError] = useState(false);

    useEffect(() => {
        const fetchWeather = async() => {
            try {
                // Using geocoords for New Delhi by default
                const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || process.env.REACT_APP_OPENWEATHER_API_KEY;
                if (!API_KEY) {
                    console.warn('Weather API key missing');
                    setWeatherError(true);
                    return;
                }
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=28.6139&lon=77.2090&appid=${API_KEY}&units=metric`);
                if (!res.ok) throw new Error('Weather API Error');
                const data = await res.json();
                setWeather(data);
                await cacheExternalData('openweather', data);
            } catch (e) {
                console.error('IntelFeed: Weather failed, loading from cache', e);
                const cached = await getCachedExternalData('openweather');
                if (cached) {
                    setWeather(cached);
                } else {
                    setWeatherError(true);
                }
            }
        };
        fetchWeather();
    }, []);

    return ( <
        aside className = "w-full h-full flex flex-col border-r border-white/10 bg-slate-950/40 backdrop-blur-xl overflow-hidden font-mono" > { /* TACTICAL HEADER */ } <
        header className = "p-6 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0" >
        <
        div className = "flex items-center gap-3" >
        <
        div className = "relative" >
        <
        div className = "w-2 h-2 bg-danger rounded-full animate-ping absolute inset-0" > < /div> <
        div className = "w-2 h-2 bg-danger rounded-full relative z-10 shadow-neon-red" > < /div> <
        /div> <
        h3 className = "text-xs font-black uppercase tracking-[0.3em] text-white" > Grid_Intel_Feed < /h3> <
        /div> <
        Activity size = { 14 }
        className = "text-cyan-500 animate-pulse text-glow-cyan" / >
        <
        /header>

        { /* WEATHER MODULE */ } <
        section className = "p-5 border-b border-white/5 bg-cyan-500/[0.02]" >
        <
        div className = "flex justify-between items-start mb-4" >
        <
        span className = "text-[8px] font-black text-slate-500 uppercase tracking-widest" > Atmospheric_Threat_Index < /span> <
        Badge variant = "neutral"
        className = "text-[7px] border-none bg-white/5" > Local_Sensor_77 .2E < /Badge> <
        /div>

        {
            weather ? ( <
                div className = "grid grid-cols-2 gap-4" >
                <
                div className = "glass-panel p-3 border-white/5" >
                <
                div className = "flex items-center gap-2 mb-1.5 opacity-60" >
                <
                WeatherIcon condition = { weather.weather[0].main.toLowerCase() }
                /> <
                span className = "text-[8px] font-black uppercase" > Condition < /span> <
                /div> <
                span className = "text-[10px] font-black text-white uppercase tracking-wider" > { weather.weather[0].description } < /span> <
                /div> <
                div className = "glass-panel p-3 border-white/5" >
                <
                div className = "flex items-center gap-2 mb-1.5 opacity-60" >
                <
                Thermometer className = "text-danger"
                size = { 14 }
                /> <
                span className = "text-[8px] font-black uppercase" > Temp < /span> <
                /div> <
                span className = "text-sm font-black text-white tabular-nums" > { weather.main.temp }°
                C < /span> <
                /div> <
                /div>
            ) : weatherError ? ( <
                div className = "flex items-center gap-2 text-danger/60 p-3 border border-danger/20 bg-danger/5" >
                <
                AlertCircle size = { 14 }
                /> <
                span className = "text-[9px] font-black uppercase" > Feed_Unavailable < /span> <
                /div>
            ) : ( <
                div className = "h-14 flex items-center justify-center opacity-20" >
                <
                Loader2 className = "animate-spin"
                size = { 20 }
                /> <
                /div>
            )
        } <
        /section>

        <
        div className = "flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4" >
        <
        AnimatePresence mode = "popLayout" > {
            incidents.map((inc) => ( <
                motion.div key = { inc.id }
                initial = {
                    { x: -20, opacity: 0 } }
                animate = {
                    { x: 0, opacity: 1 } }
                exit = {
                    { x: -20, opacity: 0 } }
                onClick = {
                    () => onSelectIncident(inc) }
                className = { `group cursor-pointer border-l-4 p-5 transition-all relative overflow-hidden ${
                                inc.severity >= 4 ? 'border-l-danger bg-danger/5' : 'border-l-cyan-500 glass-panel'
                            }` } >
                <
                div className = "flex justify-between items-start mb-4" >
                <
                div className = "flex flex-col gap-1.5" >
                <
                span className = "text-[9px] font-black text-slate-500 uppercase tracking-widest" > ID_ { inc.id.substring(0, 8) } < /span> <
                h4 className = "text-xs font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors leading-tight" > { inc.title } <
                /h4> <
                /div> <
                div className = { `w-8 h-8 flex items-center justify-center border ${inc.severity >= 4 ? 'bg-danger/20 border-danger/40 text-danger' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}` } >
                <
                span className = "text-[10px] font-black" > { inc.severity } < /span> <
                /div> <
                /div>

                <
                div className = "flex items-center justify-between mt-6" >
                <
                div className = "flex flex-col" >
                <
                span className = "text-[7px] text-slate-600 font-black uppercase tracking-widest mb-1" > Sector_Loc < /span> <
                span className = "text-[9px] text-slate-300 font-bold uppercase tracking-tighter" > W_ { inc.wingId } { " // " }
                L_ { inc.floorLevel } < /span> <
                /div> <
                div className = "flex flex-col items-end" >
                <
                span className = "text-[7px] text-slate-600 font-black uppercase tracking-widest mb-1" > Signal_Lock < /span> <
                span className = { `text-[9px] font-black uppercase tracking-widest ${
                                        inc.status === 'OPEN' ? 'text-danger animate-pulse' : 'text-emerald'
                                    }` } > { inc.status } <
                /span> <
                /div> <
                /div> <
                /motion.div>
            ))
        } <
        /AnimatePresence>

        {
            incidents.length === 0 && ( <
                div className = "h-64 flex flex-col items-center justify-center opacity-20 text-center" >
                <
                Radio size = { 40 }
                className = "mb-4 animate-pulse" / >
                <
                p className = "text-[9px] font-black uppercase tracking-[0.4em]" > Node_Scanning... < /p> <
                /div>
            )
        } <
        /div>

        <
        footer className = "p-4 border-t border-white/10 bg-white/5 shrink-0" >
        <
        div className = "flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]" >
        <
        span > Nodes_Active: { incidents.length } < /span> <
        span className = "text-cyan-500/60" > Secure_Link: established < /span> <
        /div> <
        /footer> <
        /aside>
    );
};