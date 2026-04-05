import React from 'react';

export const Skeleton = ({ className = '', variant = 'rect' }) => {
    const variants = {
        rect: 'rounded-xl',
        circle: 'rounded-full',
        text: 'rounded-md h-4 w-full',
    };

    return (
        <div className={`animate-pulse bg-white/[0.03] border border-white/5 overflow-hidden relative ${variants[variant]} ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
    );
};
