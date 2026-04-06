// RE-THEMED: Solid Tactical
import React from 'react';

export const Card = ({ 
    children, 
    className = '', 
    variant = 'glass',
    glowing = false,
    ...props 
}) => {
    // Solid tactical panel style
    const baseStyle = 'bg-slate-900 border border-slate-700 rounded-none shadow-none transition-colors duration-200';
    
    // Maintain variation logic but with solid colors
    const variants = {
        glass: baseStyle,
        panel: 'bg-slate-800 border border-slate-600 rounded-none shadow-none',
    };

    const glowClass = glowing ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : '';

    return (
        <div 
            className={`${variants[variant] || baseStyle} ${glowClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
