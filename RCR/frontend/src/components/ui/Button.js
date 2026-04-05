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

    const hasShimmer = variant === 'primary' || variant === 'danger';

    return (
        <button 
            className={`${variants[variant]} ${className} group`}
            {...props}
        >
            {hasShimmer && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            )}
            <span className="relative z-10 flex items-center justify-center gap-3">{children}</span>
        </button>
    );
};
