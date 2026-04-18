// RE-THEMED: Solid Tactical
import React from 'react';
import { Navbar } from './Navbar';
import { MobileNavbar } from './MobileNavbar';
import { StepInstructionGuide } from '../ui/StepInstructionGuide';
import { useUI } from '../../context/UIContext';


export const AppLayout = ({ children, user, logout }) => {
    const { openGuide } = useUI();

    return (
        <div className="h-screen w-full max-w-[100vw] overflow-hidden flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-cyan-500 selection:text-black font-body antialiased relative">
            {/* Global Tactical Overlays */}
            <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-grid-pattern bg-[length:40px_40px]"></div>
            <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
                <div className="w-full h-[2px] bg-electric/20 animate-scanline opacity-20"></div>
            </div>
            
            {/* DESKTOP NAVBAR */}
            <div className="hidden md:block">
                <Navbar user={user} logout={logout} />
            </div>

            {/* MOBILE NAVBAR */}
            <MobileNavbar user={user} logout={logout} />

            <main className="flex-1 flex flex-col relative z-10 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
                {children}
            </main>

            {/* FLOATING GUIDE TRIGGER (DESKTOP) */}
            <button 
                onClick={openGuide}
                className="hidden md:flex fixed bottom-10 right-10 z-[45] w-14 h-14 bg-[#151B2B] border border-slate-700 text-cyan-400 items-center justify-center shadow-neon-cyan hover:bg-slate-800 transition-all rounded-none"
                aria-label="Open System Guide"
            >
                <div className="relative">
                    <div className="absolute inset-0 animate-ping bg-cyan-500/20 rounded-full"></div>
                    <span className="relative font-black text-lg">?</span>
                </div>
            </button>

            <StepInstructionGuide />

            {/* Tactical Corner Accents */}
            <div className="fixed top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/5 pointer-events-none z-0"></div>
            <div className="fixed top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/5 pointer-events-none z-0"></div>
            <div className="fixed bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/5 pointer-events-none z-0"></div>
            <div className="fixed bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/5 pointer-events-none z-0"></div>
        </div>
    );
};

