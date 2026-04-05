import React from 'react';

export const Button = ({ 
    children, 
    variant = 'primary', 
    className = '', 
    ...props 
}) => {
    const variants = {
        primary: 'btn-primary',
        danger: 'btn-danger',
        secondary: 'btn-secondary',
    };

    return (
        <button 
            className={`${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
