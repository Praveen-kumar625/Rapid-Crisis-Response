import React from 'react';

export const Card = ({ 
    children, 
    className = '', 
    variant = 'glass',
    ...props 
}) => {
    const variants = {
        glass: 'glass-card',
        panel: 'glass-panel',
    };

    return (
        <div 
            className={`${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
