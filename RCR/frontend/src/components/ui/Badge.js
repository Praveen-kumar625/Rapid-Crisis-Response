// RE-THEMED: Solid Tactical
import React from 'react';

export const Badge = ({ 
    children, 
    variant = 'neutral',
    className = '',
    ...props 
}) => {
    // Solid high-contrast block styles
    const variants = {
        neutral: 'bg-slate-800 text-slate-300 border-slate-600',
        electric: 'bg-cyan-500 text-black border-2 border-cyan-300 font-black shadow-none',
        danger: 'bg-red-600 text-white border-2 border-red-400 font-black shadow-none',
        emerald: 'bg-emerald-600 text-white border-2 border-emerald-400 font-black shadow-none',
        amber: 'bg-amber-500 text-black border-2 border-amber-300 font-black shadow-none',
    };

    return (
        <span 
            className={`px-2 py-0.5 rounded-none text-[10px] uppercase tracking-tight border font-mono transition-all duration-200 flex items-center gap-1.5 w-fit ${variants[variant] || variants.neutral} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};
