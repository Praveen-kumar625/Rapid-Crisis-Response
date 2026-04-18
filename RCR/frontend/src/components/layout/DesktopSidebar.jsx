import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../context/UIContext';

// Safe Inline Icons with Micro-animations
const Icons = {
    Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
    Map: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.617a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.5v15"/><path d="M9 3.5v15"/></svg>,
    Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>,
    Logs: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
};

const NavItem = ({ to, icon: Icon, label, collapsed }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => `
            group flex items-center gap-4 px-4 py-3.5 rounded-none transition-all duration-500 relative overflow-hidden
            ${isActive 
                ? 'text-cyan-400 bg-cyan-500/5' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}
        `}
    >
        {/* Active Indicator Bar */}
        <NavLink to={to}>
            {({ isActive }) => isActive && (
                <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                />
            )}
        </NavLink>

        <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
            <Icon />
        </div>
        
        <AnimatePresence>
            {!collapsed && (
                <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap"
                >
                    {label}
                </motion.span>
            )}
        </AnimatePresence>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:via-cyan-500/[0.03] transition-all duration-700" />
    </NavLink>
);

export const DesktopSidebar = ({ user, logout }) => {
    const { isSidebarExpanded } = useUI();

    return (
        <motion.aside 
            initial={false}
            animate={{ width: isSidebarExpanded ? 260 : 80 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            className="hidden md:flex flex-col h-screen bg-[#060912] border-r border-white/5 sticky top-0 z-50 shrink-0 shadow-2xl shadow-black"
        >
            {/* BRANDING SECTION */}
            <div className="h-16 flex items-center px-6 border-b border-white/5 bg-black/20 shrink-0">
                <div className="relative group">
                    <div className="w-8 h-8 bg-cyan-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(8,145,178,0.4)] group-hover:rotate-90 transition-transform duration-700">
                        <Icons.Alert />
                    </div>
                    <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                </div>
                {!isSidebarExpanded ? null : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-4 flex flex-col"
                    >
                        <span className="text-xs font-black text-white tracking-tighter leading-none">RAPID_CRISIS</span>
                        <span className="text-[8px] font-black text-cyan-500 uppercase tracking-[0.3em] mt-1">Response_v4.2</span>
                    </motion.div>
                )}
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="flex-1 py-8 overflow-y-auto custom-scrollbar overflow-x-hidden">
                <div className="px-6 mb-4">
                    {!isSidebarExpanded ? (
                         <div className="h-px bg-white/5 w-full" />
                    ) : (
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Main_Directives</span>
                    )}
                </div>
                <NavItem to="/" icon={Icons.Dashboard} label="Command_Center" collapsed={!isSidebarExpanded} />
                <NavItem to="/map" icon={Icons.Map} label="Tactical_Grid" collapsed={!isSidebarExpanded} />
                <NavItem to="/hud" icon={Icons.Alert} label="Active_Breach" collapsed={!isSidebarExpanded} />
                <NavItem to="/dashboard" icon={Icons.Logs} label="Intel_Archive" collapsed={!isSidebarExpanded} />
            </nav>

            {/* FOOTER / USER STATUS */}
            <div className="mt-auto p-4 space-y-4 shrink-0 border-t border-white/5 bg-black/40">
                <div className={`flex items-center gap-3 px-3 py-2 rounded border border-white/5 bg-white/[0.02] ${!isSidebarExpanded && 'justify-center'}`}>
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-40" />
                    </div>
                    {isSidebarExpanded && <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure_Link</span>}
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-900/40 border border-white/5 rounded-none relative overflow-hidden group">
                    <div className="w-9 h-9 bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:border-cyan-500/30 transition-colors">
                        <Icons.User />
                    </div>
                    {isSidebarExpanded && (
                        <div className="overflow-hidden flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{user?.email?.split('@')[0] || 'REPSONDER_01'}</p>
                            <button 
                                onClick={logout} 
                                className="text-[8px] text-slate-500 font-bold hover:text-red-500 uppercase tracking-[0.15em] flex items-center gap-1 transition-colors mt-0.5"
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                                Terminate
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};

export default DesktopSidebar;
