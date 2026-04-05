import React from 'react';

export const Section = ({ children, className = '', ...props }) => {
    return (
        <section 
            className={`py-16 lg:py-24 relative z-10 ${className}`}
            {...props}
        >
            {children}
        </section>
    );
};
