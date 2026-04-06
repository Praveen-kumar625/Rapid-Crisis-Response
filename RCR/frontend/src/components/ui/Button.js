// RE-THEMED: Solid Tactical
import React from 'react';

export const Button = ({ 
    children, 
    variant = 'primary', 
    className = '', 
    ...props 
}) => {
    // Mechanical, solid press styles
    const variants = {
        primary: 'bg-slate-800 text-slate-100 border border-slate-600 hover:bg-slate-700 hover:border-slate-500 active:bg-slate-900 active:shadow-inner',
        danger: 'bg-red-700 text-white border border-red-500 hover:bg-red-600 hover:border-red-400 active:bg-red-800 active:shadow-inner',
        secondary: 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 active:bg-slate-950 active:shadow-inner',
    };

    return (
        <button 
            className={`px-6 py-3 rounded-none text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-none ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-3 font-mono">{children}</span>
        </button>
    );
};
