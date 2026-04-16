// RE-THEMED: Solid Tactical
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

import { motion } from 'framer-motion';
import { MapPin, Cpu, ArrowRight, Navigation, Zap } from 'lucide-react';
import { Card } from './ui/Card';

function IncidentCard({ incident }) {
    const navigate = useNavigate();
    const { id, title, severity, category, status, location, triageMethod, wingId, floorLevel } = incident;
    const [lng, lat] = location.coordinates;
    
    const isCritical = severity >= 4;
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="w-full"
        >
            <Card 
                className={`group relative flex flex-col justify-between p-6 glass-panel border-white/5 hover:border-cyan-500/30 cursor-pointer rounded-none shadow-none overflow-hidden transition-all duration-500 ${
                    isCritical ? 'bg-danger/5' : 'bg-slate-900/40'
                }`}
                onClick={() => navigate(`/incidents/${id}`)}
            >
                {/* Tactical Scanning Shimmer */}
                <motion.div 
                    animate={{ 
                        top: ['-100%', '200%'],
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                    className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none z-0"
                />

                {/* Left Accent Stripe */}
                <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-500 ${
                    isCritical 
                    ? 'bg-danger shadow-neon-red' 
                    : 'bg-cyan-500 group-hover:shadow-neon-cyan'
                }`}></div>
                
                <div className="relative z-10 pl-2">
                    <div className="flex justify-between items-start mb-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <StatusBadge status={status} />
                                {isCritical && (
                                    <motion.span 
                                        animate={{ opacity: [1, 0.4, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="flex items-center gap-1.5 text-[9px] font-black text-danger bg-danger/10 px-2 py-0.5 border border-danger/20 uppercase tracking-widest"
                                    >
                                        <Zap size={10} className="fill-danger" /> PRIORITY_ALPHA
                                    </motion.span>
                                )}
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight line-clamp-2 font-mono group-hover:text-cyan-400 transition-colors">
                                {title}
                            </h3>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span className="bg-slate-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/5 font-mono">
                            {category}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border font-mono ${
                            isCritical ? 'text-white bg-danger border-danger shadow-neon-red' : 'text-[#020617] bg-cyan-500 border-cyan-400'
                        }`}>
                            SEV_0{severity}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-5 bg-[#020617]/60 p-4 border border-white/5 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-2 opacity-5">
                            <Navigation size={40} className="text-white" />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                            <Navigation size={14} className="text-cyan-500/50" />
                            <span className="font-black text-slate-600 shrink-0 tracking-widest">SECTOR:</span>
                            <span className="text-slate-200 font-bold uppercase tracking-wider">WING_{wingId || '??'} // LVL_{floorLevel || '??'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                            <MapPin size={14} className="text-cyan-500/50" />
                            <span className="font-black text-slate-600 shrink-0 tracking-widest">COORD:</span>
                            <span className="text-slate-200 font-bold tracking-widest">{lat.toFixed(4)}N / {lng.toFixed(4)}E</span>
                        </div>
                    </div>
                </div>

                <div className="mt-2 pt-5 border-t border-white/5 flex justify-between items-center relative z-10 pl-2 font-mono">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            <Cpu size={16} className={triageMethod?.includes('Edge') ? 'text-emerald-500 text-glow-cyan' : 'text-slate-700'} />
                            {triageMethod?.includes('Edge') ? (
                                <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/20 tracking-tighter font-bold">EDGE_VERIFIED</span>
                            ) : (
                                <span className="text-slate-600 text-[9px] font-bold">PROC: {triageMethod || 'CLOUD_RELAY'}</span>
                            )}
                        </div>
                    </div>
                    <div className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all shrink-0 ${
                        isCritical ? 'text-danger group-hover:text-white' : 'text-cyan-500 group-hover:text-white'
                    }`}>
                        Open Intel <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}


export default IncidentCard;
