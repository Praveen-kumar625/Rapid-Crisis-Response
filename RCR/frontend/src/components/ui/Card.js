import React from 'react';

export const Card = ({ 
    children, 
    className = '', 
    variant = 'glass',
    glowing = false,
    ...props 
}) => {
    const variants = {
        glass: 'glass-card',
        panel: 'glass-panel',
    };

    const glowClass = glowing ? 'shadow-[0_0_30px_rgba(255,51,102,0.15)] border-danger/30' : '';

    return (
        <div 
            className={`${variants[variant]} ${glowClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
