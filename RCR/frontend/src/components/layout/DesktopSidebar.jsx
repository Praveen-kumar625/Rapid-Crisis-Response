import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, Activity, Map, BarChart3, 
    ChevronLeft, ChevronRight, User, LogOut, Bell
} from 'lucide-react';
import { useUI } from '../../context/UIContext';

const NavItem = ({ to, icon: Icon, label, collapsed }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => `
            flex items-center gap-4 px-4 py-3 rounded-none border-l-2 transition-all
            ${isActive 
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[inset:10px_0_20px_-10px_rgba(6,182,212,0.2)]' 
                : 'border-transparent text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}
        `}
    >
        <Icon size={22} className="shrink-0" />
        {!collapsed && <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>}
    </NavLink>
);

export const DesktopSidebar = ({ user, logout }) => {
    const { isSidebarExpanded, toggleSidebar } = useUI();

    return (
        <motion.aside 
            initial={false}
            animate={{ width: isSidebarExpanded ? 256 : 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="hidden md:flex flex-col h-screen bg-[#0B0F19] border-r border-white/5 sticky top-0 z-50 shrink-0"
        >
            <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
                <div className="w-8 h-8 bg-cyan-600 flex items-center justify-center shrink-0">
                    <Activity size={20} className="text-white" />
                </div>
                {isSidebarExpanded && <span className="ml-3 font-black italic tracking-tighter text-white">RCR_CORE</span>}
            </div>

            <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={!isSidebarExpanded} />
                <NavItem to="/hud" icon={Activity} label="Active_Breach" collapsed={!isSidebarExpanded} />
                <NavItem to="/map" icon={Map} label="Tactical_Grid" collapsed={!isSidebarExpanded} />
                <NavItem to="/dashboard" icon={BarChart3} label="Intel_Analytics" collapsed={!isSidebarExpanded} />
                
                <div className="h-px bg-white/5 my-4 mx-4" />
                
                <NavItem to="/report" icon={Bell} label="Signal_Relay" collapsed={!isSidebarExpanded} />
            </nav>

            <div className="mt-auto p-4 space-y-4 shrink-0 border-t border-white/5 bg-slate-950/20">
                <div className={`flex items-center gap-3 px-2 ${!isSidebarExpanded && 'justify-center'}`}>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {isSidebarExpanded && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System_Online</span>}
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-slate-900/50 border border-white/5">
                    <div className="w-8 h-8 bg-slate-800 flex items-center justify-center shrink-0">
                        <User size={16} className="text-slate-400" />
                    </div>
                    {isSidebarExpanded && (
                        <div className="overflow-hidden flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white truncate uppercase">{user?.email?.split('@')[0] || 'REPSONDER_01'}</p>
                            <button 
                                onClick={logout}
                                className="text-[8px] text-slate-500 font-mono hover:text-red-400 flex items-center gap-1 transition-colors uppercase"
                            >
                                <LogOut size={10} /> Terminate_Link
                            </button>
                        </div>
                    )}
                </div>

                <button 
                    onClick={toggleSidebar}
                    className="w-full h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors border border-white/5"
                >
                    {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>
        </motion.aside>
    );
};
