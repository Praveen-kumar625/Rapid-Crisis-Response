import React from 'react';

export const StatusBadge = ({ status }) => {
    const variants = {
        OPEN: 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
        IN_PROGRESS: 'bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
        RESOLVED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
        CLOSED: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
        ENCRYPTED_UPLINK: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
    };

    const className = variants[status] || variants.CLOSED;

    return (
        <div className="relative group flex items-center">
            <span className={`${className} border px-3 py-1 rounded-none text-[8px] font-black uppercase tracking-[0.25em] flex items-center gap-2 transition-all duration-300 group-hover:brightness-125 font-mono`}>
                {(status === 'OPEN' || status === 'ENCRYPTED_UPLINK') && (
                    <span className="relative flex h-1.5 w-1.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'OPEN' ? 'bg-red-500' : 'bg-cyan-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status === 'OPEN' ? 'bg-red-600' : 'bg-cyan-500'}`}></span>
                    </span>
                )}
                {status}
            </span>
            {/* Corner Bracket Accents */}
            <div className="absolute -top-0.5 -left-0.5 w-1 h-1 border-t border-l border-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 border-b border-r border-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

export default StatusBadge;
