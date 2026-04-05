import React from 'react';

export const Container = ({ children, className = '', ...props }) => {
    return (
        <div 
            className={`app-container ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
