import React from 'react';

function StatusBadge({ status }) {
    const variants = {
        OPEN: 'bg-red-950 text-red-400 border-red-800',
        IN_PROGRESS: 'bg-amber-950 text-amber-400 border-amber-800',
        RESOLVED: 'bg-emerald-950 text-emerald-400 border-emerald-800',
        CLOSED: 'bg-slate-800 text-slate-400 border-slate-700',
    };

    const className = variants[status] || variants.CLOSED;

    return (
        <span className={`${className} border px-2.5 py-1 rounded-none text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-none w-fit font-mono`}>
            {status === 'OPEN' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
            {status}
        </span>
    );
}

export default StatusBadge;
