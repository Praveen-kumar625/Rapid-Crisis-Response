import React, { useEffect, useState } from 'react';
import api from '../api';
import { getSocket } from '../socket';
import { IntelFeed } from '../components/IntelFeed';
import { TacticalMap } from '../components/TacticalMap';
import { AICommand } from '../components/AICommand';
import { ShieldAlert, Activity, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

const TacticalDashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isDispatching, setIsDispatching] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let socket;

        const init = async () => {
            try {
                const { data } = await api.get('/incidents');
                if (isMounted) setIncidents(data);
                
                socket = await getSocket();
                
                // OBJECTIVE 1: Defensive Socket Listener
                socket.on('incident.created', (payload) => {
                    // Strict Payload Validation
                    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return;
                    
                    try {
                        if (isMounted) {
                            setIncidents(prev => [payload.incident, ...prev]);
                        }
                    } catch (err) {
                        console.error('[RCR Critical] Dispatch Fail Error:', err);
                    }
                });

                socket.on('incident.status-updated', (payload) => {
                    if (!payload || typeof payload !== 'object') return;
                    try {
                        if (isMounted) {
                            setIncidents(prev => prev.map(inc => 
                                inc.id === payload.incident.id ? payload.incident : inc
                            ));
                        }
                    } catch (err) {
                        console.error('[RCR Critical] Dispatch Fail Error:', err);
                    }
                });
            } catch (err) {
                console.error('Tactical Dashboard Init Failed', err);
            }
        };

        init();
        return () => {
            isMounted = false;
            socket?.off('incident.created');
            socket?.off('incident.status-updated');
        };
    }, []);

    // Fail-safe Dispatch Protocol
    const emitEmergencySignal = async (data) => {
        let timeoutId;
        setIsDispatching(true);
        const toastId = toast.loading('Initiating Emergency Protocol...');

        const failSafeTimeout = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error('SOCKET_TIMEOUT_5000MS'));
            }, 5000);
        });

        const socketEmission = (async () => {
            const socket = await getSocket();
            return new Promise((resolve) => {
                socket.emit('emergency_signal', data, (ack) => {
                    resolve(ack);
                });
                // Fallback for non-ack emitters: if using standard API post
                // resolve({ success: true }); 
            });
        })();

        try {
            await Promise.race([socketEmission, failSafeTimeout]);
            toast.success('Signal Acknowledged', { id: toastId });
        } catch (err) {
            console.error('[RCR Critical] Silent Fallback Triggered:', err.message);
            toast.error('Network Timeout: Response Pending', { id: toastId });
        } finally {
            clearTimeout(timeoutId);
            setIsDispatching(false); // Forcefully clear state
        }
    };

    return (
        // OBJECTIVE 2: Enterprise Desktop Architecture Fix
        <div className="min-h-screen max-h-screen overflow-hidden bg-slate-950 flex flex-col text-slate-100 font-sans selection:bg-cyan-500/30 relative">
            <div className="scanline-overlay"></div>
            
            {/* Header / HUD Bar */}
            <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-lg flex items-center px-6 justify-between shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-none">
                        <ShieldAlert className="text-red-500 animate-pulse" size={20} />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic">RCR :: Command_Center</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Grid_Uptime: 99.9%</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 bg-white/5 px-3 py-1 border border-white/10 uppercase tracking-widest">
                        Status: {isDispatching ? 'UPLINKING...' : 'READY'}
                    </div>
                </div>
            </header>

            {/* Main Grid System */}
            <div className="flex-1 lg:grid lg:grid-cols-12 lg:gap-0 overflow-hidden relative">
                
                {/* LEFT: Intel Feed (lg:col-span-3) */}
                <aside className="hidden lg:flex lg:col-span-3 flex-col bg-slate-900/40 backdrop-blur-xl border-r border-white/10 overflow-hidden h-full">
                    <div className="flex-1 overflow-y-auto custom-scrollbar max-h-full">
                        <IntelFeed 
                            incidents={incidents} 
                            onSelectIncident={setSelectedIncident} 
                        />
                    </div>
                </aside>

                {/* CENTER: Tactical Map (lg:col-span-6) */}
                <main className="lg:col-span-6 h-full bg-slate-900 relative border-r border-white/10 overflow-hidden shadow-2xl">
                    <TacticalMap 
                        incidents={incidents} 
                        onMarkerClick={setSelectedIncident}
                    />
                    {/* Glassmorphism Tactical Overlay */}
                    <div className="absolute top-6 left-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-none pointer-events-none z-20">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Live_Grid_Alpha</span>
                        </div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Telemetry: active_sync</p>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[90%] lg:w-auto px-4">
                        <button 
                            onClick={() => emitEmergencySignal({ type: 'SOS_BROADCAST' })}
                            disabled={isDispatching}
                            className="w-full lg:w-auto min-h-[56px] bg-red-600 hover:bg-red-500 disabled:bg-slate-800 transition-all font-black uppercase text-xs tracking-[0.3em] px-12 shadow-neon-red active:scale-[0.98] border-none flex items-center justify-center gap-4 group"
                        >
                            <Cpu size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                            Execute_SOS_Protocol
                        </button>
                    </div>
                </main>

                {/* RIGHT: AI Command (lg:col-span-3) */}
                <aside className="lg:col-span-3 flex flex-col bg-slate-950/60 backdrop-blur-2xl overflow-hidden h-full">
                    <div className="flex-1 overflow-y-auto custom-scrollbar max-h-full">
                        <AICommand selectedIncident={selectedIncident} />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TacticalDashboard;
