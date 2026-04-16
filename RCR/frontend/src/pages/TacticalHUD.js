import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2, Clock, MapPin, Navigation, Wifi, WifiOff, Layers, Zap, AlertTriangle } from 'lucide-react';
import api from '../api';
import { getSocket, emitWithTimeout } from '../socket';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { cacheTasks, getCachedTasks } from '../idb';
import TickerTape from '../components/TickerTape';

const TacticalHUD = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [profile, setProfile] = useState(null);
    const [isActionPending, setIsActionPending] = useState(false);
    const [presence, setPresence] = useState({ status: 'AVAILABLE', floor: 1, wing: 'A' });

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks/my-tasks');
            setTasks(data);
            await cacheTasks(data);
        } catch (err) {
            console.error('Failed to fetch tasks, loading from cache:', err);
            const cached = await getCachedTasks();
            if (cached.length > 0) {
                setTasks(cached);
                toast('Offline Mode: Using cached data', { icon: '⚠️' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updatePresence = async (updates) => {
        const newPresence = { ...presence, ...updates };
        setPresence(newPresence);
        try {
            await api.post('/tasks/presence', {
                status: newPresence.status,
                floorLevel: newPresence.floor,
                wingId: newPresence.wing
            });
        } catch (err) {
            console.error('Presence sync failed');
        }
    };

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        api.get('/incidents/me').then(({ data }) => {
            setProfile(data);
            if (data.responderStatus) {
                setPresence({
                    status: data.responderStatus,
                    floor: data.currentFloor || 1,
                    wing: data.currentWing || 'A'
                });
            }
        }).catch(console.error);
        fetchTasks();

        let socketInstance = null;
        (async () => {
            socketInstance = await getSocket();
            socketInstance.on('task.tasks-created', (payload) => {
                try {
                    if (!payload || !payload.tasks) return;
                    const forMe = payload.tasks.some(t => t.assigned_role === profile?.role);
                    if (forMe) fetchTasks();
                } catch (err) {
                    console.error('[Socket] Dispatch failed for task.tasks-created', err);
                }
            });
            socketInstance.on('task.task-updated', (payload) => {
                try {
                    if (!payload || !payload.task) return;
                    setTasks(prev => {
                        const updated = prev.map(t => t.id === payload.task.id ? payload.task : t);
                        cacheTasks(updated);
                        return updated;
                    });
                } catch (err) {
                    console.error('[Socket] Dispatch failed for task.task-updated', err);
                }
            });
        })();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (socketInstance) {
                socketInstance.off('task.tasks-created');
                socketInstance.off('task.task-updated');
            }
        };
    }, [profile?.role]);

    const handleAcknowledge = async (taskId) => {
        setIsActionPending(true);
        const toastId = toast.loading('Acknowledging Directive...');
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: 'ACKNOWLEDGED' });
            toast.success('Task Acknowledged', { id: toastId });
            fetchTasks();
        } catch (err) {
            toast.error('Sync failed - retry when online', { id: toastId });
        } finally {
            setIsActionPending(false);
        }
    };

    const handleSecure = async (taskId) => {
        setIsActionPending(true);
        const toastId = toast.loading('Securing Objective...');
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: 'SECURED' });
            if (presence.status === 'BUSY') {
                updatePresence({ status: 'AVAILABLE' });
            }
            toast.success('Objective Secured', { id: toastId });
            fetchTasks();
        } catch (err) {
            toast.error('Sync failed - retry when online', { id: toastId });
        } finally {
            setIsActionPending(false);
        }
    };

    if (isLoading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] font-mono text-electric space-y-4">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <Zap size={48} className="text-electric shadow-neon-cyan" />
            </motion.div>
            <div className="text-sm font-black tracking-[0.3em] animate-pulse uppercase">Initializing Tactical Link...</div>
        </div>
    );

    return (
        <div className="h-full w-full max-w-[100vw] overflow-hidden bg-[#020617] bg-grid-pattern text-slate-100 font-mono flex flex-col relative">
            {/* Scanline Overlay */}
            <div className="scanline-overlay"></div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pointer-events-none absolute inset-0 z-0 bg-gradient-radial from-electric/5 via-transparent to-transparent"
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-32 relative z-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 glass-tactical flex items-center justify-center shrink-0 border-electric/30">
                            <Shield size={28} className="text-electric text-glow-cyan" />
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="text-lg font-black uppercase tracking-tighter text-glow-cyan">Tactical HUD</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase truncate tracking-widest">{profile?.role} UNIT // {profile?.email}</p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="block text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Comms Status</span>
                        {isOnline ? (
                            <div className="flex items-center justify-end gap-2 text-emerald">
                                <Wifi size={14} strokeWidth={3} />
                                <span className="text-xs font-black uppercase tracking-tighter">Signal Lock</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-end gap-2 text-danger">
                                <WifiOff size={14} strokeWidth={3} className="animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-tighter">Link Severed</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Presence Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="flex flex-col gap-2 glass-panel p-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                        <select 
                            value={presence.status}
                            onChange={(e) => updatePresence({ status: e.target.value })}
                            className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none text-white appearance-none cursor-pointer"
                        >
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="BUSY">BUSY</option>
                            <option value="OFF_DUTY">OFF_DUTY</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 glass-panel p-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Floor</span>
                        <select 
                            value={presence.floor}
                            onChange={(e) => updatePresence({ floor: Number(e.target.value) })}
                            className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none text-white appearance-none cursor-pointer"
                        >
                            {[1,2,3,4,5].map(f => <option key={f} value={f}>LEVEL_{f}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 glass-panel p-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector</span>
                        <select 
                            value={presence.wing}
                            onChange={(e) => updatePresence({ wing: e.target.value })}
                            className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none text-white appearance-none cursor-pointer"
                        >
                            {['A', 'B', 'C', 'NORTH', 'SOUTH'].map(w => <option key={w} value={w}>WING_{w}</option>)}
                        </select>
                    </div>
                </div>

                {/* Task Feed */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-electric animate-pulse shadow-neon-cyan' : 'bg-slate-600'}`} />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Directives</h2>
                        </div>
                        {!isOnline && (
                            <div className="text-[10px] font-black text-danger uppercase flex items-center gap-1.5 border border-danger/30 px-2 py-1 bg-danger/10">
                                <AlertTriangle size={12} /> Sync Pending
                            </div>
                        )}
                    </div>

                    <AnimatePresence mode="popLayout">
                        {tasks.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-32 flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-none opacity-40"
                            >
                                <Clock size={48} className="mb-4 text-slate-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Standing By...</p>
                            </motion.div>
                        ) : (
                            tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`relative overflow-hidden border-l-4 group ${
                                        task.status === 'SECURED' ? 'border-l-emerald glass-panel bg-emerald/5' : 
                                        task.status === 'ACKNOWLEDGED' ? 'border-l-electric glass-panel bg-electric/5' : 
                                        'border-l-danger glass-tactical bg-danger/5'
                                    }`}
                                >
                                    {task.status === 'PENDING' && (
                                        <motion.div 
                                            layoutId={`glow-${task.id}`}
                                            className="absolute inset-0 bg-danger/5 animate-pulse pointer-events-none"
                                        />
                                    )}
                                    
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-5 gap-4">
                                            <div className="flex flex-col gap-2 overflow-hidden">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">DRTV_{task.id.substring(0,8)}</span>
                                                    {task.floor_level && (
                                                        <span className="bg-slate-800 text-white text-[9px] px-2 py-0.5 font-black border border-white/10 flex items-center gap-1">
                                                            <Layers size={10} /> LVL_{task.floor_level}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className={`text-sm font-black uppercase tracking-tight ${
                                                    task.incident_severity >= 4 ? 'text-glow-red text-danger' : 'text-warning'
                                                }`}>
                                                    {task.incident_title} {" // "} [SEV_{task.incident_severity}]
                                                </span>
                                            </div>
                                            <Navigation size={20} className="text-electric shrink-0 text-glow-cyan" />
                                        </div>

                                        <p className="text-xs font-bold text-slate-300 mb-8 leading-relaxed uppercase tracking-wide">
                                            {task.instruction}
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            {task.status === 'PENDING' || task.status === 'DISPATCHED' ? (
                                                <Button 
                                                    variant="primary" 
                                                    className="w-full bg-danger text-white font-black text-xs uppercase tracking-widest py-5 rounded-none border-none shadow-neon-red active:scale-[0.98] transition-transform"
                                                    onClick={() => handleAcknowledge(task.id)}
                                                    disabled={!isOnline || isActionPending}
                                                >
                                                    {isOnline ? 'Confirm Receipt' : 'Awaiting Link'}
                                                </Button>
                                            ) : task.status === 'ACKNOWLEDGED' ? (
                                                <Button 
                                                    variant="primary" 
                                                    className="w-full bg-electric text-navy-950 font-black text-xs uppercase tracking-widest py-5 rounded-none border-none shadow-neon-cyan active:scale-[0.98] transition-transform"
                                                    onClick={() => handleSecure(task.id)}
                                                    disabled={!isOnline || isActionPending}
                                                >
                                                    {isOnline ? 'Objective Secured' : 'Awaiting Link'}
                                                </Button>
                                            ) : (
                                                <div className="w-full py-5 flex items-center justify-center gap-2 bg-emerald/20 border border-emerald/30 text-emerald font-black text-xs uppercase tracking-widest">
                                                    <CheckCircle2 size={18} /> Objective Logged
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <TickerTape />

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center z-50 px-6">
                <button onClick={() => window.location.reload()} className="flex-1 flex flex-col items-center justify-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                    <Clock size={22} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Sync</span>
                </button>
                <div className="flex-1 flex flex-col items-center justify-center gap-1.5 text-electric text-glow-cyan">
                    <Zap size={22} className="fill-electric/20" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Active</span>
                </div>
                <button className="flex-1 flex flex-col items-center justify-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                    <MapPin size={22} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Zones</span>
                </button>
            </nav>
        </div>
    );
};

export default TacticalHUD;

