import React from 'react';

export const Badge = ({ 
    children, 
    variant = 'neutral',
    className = '',
    ...props 
}) => {
    const variants = {
        neutral: 'bg-white/5 text-slate-400 border-white/10',
        electric: 'bg-electric/10 text-electric border-electric/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]',
        danger: 'bg-danger/10 text-danger border-danger/30 shadow-[0_0_10px_rgba(255,51,102,0.2)]',
        emerald: 'bg-emerald/10 text-emerald border-emerald/30',
        amber: 'bg-amber/10 text-amber border-amber/30',
    };

    return (
        <span 
            className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border transition-all duration-300 flex items-center gap-1.5 w-fit ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};
