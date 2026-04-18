import React from 'react';

// ZERO-CRASH ARCHITECTURE: Pure React + Inline SVGs + Tailwind
// This component acts as a fail-safe to ensure the app renders even if libraries are missing.
export const DesktopLayout = ({ children, user, logout }) => {
    
    // Inline SVG Icon Components to prevent "Dependency Not Found" errors
    const Icons = {
        Dashboard: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        ),
        Shield: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        ),
        Activity: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        ),
        User: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        )
    };

    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-slate-900">
            
            {/* 1. LEFT SIDEBAR - Visible only on md screens and up */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800 shadow-xl z-50">
                {/* Branding */}
                <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-white/5">
                    <div className="p-1.5 bg-cyan-600 rounded mr-3">
                        <Icons.Shield />
                    </div>
                    <span className="font-black tracking-tighter text-lg">RCR_COMMAND</span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {[
                        { label: 'Dashboard', icon: <Icons.Dashboard />, active: true },
                        { label: 'Tactical Grid', icon: <Icons.Activity />, active: false },
                        { label: 'Incident Logs', icon: <Icons.Shield />, active: false }
                    ].map((item) => (
                        <div 
                            key={item.label}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                                item.active ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                            }`}
                        >
                            {item.icon}
                            <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer / User Profile */}
                <div className="p-4 bg-slate-950 border-t border-white/5">
                    <div className="flex items-center gap-3 p-2 rounded bg-slate-900">
                        <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                            <Icons.User />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-black uppercase truncate">{user?.email || 'OFFLINE_NODE'}</p>
                            <button 
                                onClick={logout}
                                className="text-[9px] text-slate-500 hover:text-red-400 font-bold uppercase tracking-widest"
                            >
                                Terminate Session
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                
                {/* TOP NAVIGATION BAR */}
                <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-8 z-30 shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">System_Time</span>
                            <span className="text-xs font-mono font-bold text-gray-700 tabular-nums">{new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                        <div className="hidden sm:flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">Active_Encrypted</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-500">CMD + K</span>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE VIEWPORT */}
                <main className="flex-1 overflow-y-auto relative z-10 bg-slate-50/50">
                    <div className="p-6 md:p-10 min-h-full">
                        {/* SAFE CHILDREN RENDER */}
                        {children || (
                            <div className="flex items-center justify-center h-full text-gray-300 italic">
                                No_Content_Rendered
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer Accent */}
                <footer className="h-1 w-full bg-cyan-600 shrink-0 shadow-[0_-4px_15px_rgba(8,145,178,0.2)]"></footer>
            </div>
        </div>
    );
};
