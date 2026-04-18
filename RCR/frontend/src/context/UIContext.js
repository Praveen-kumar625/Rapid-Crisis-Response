import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [guideStep, setGuideStep] = useState(0);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const openGuide = () => {
        setGuideStep(0);
        setIsGuideOpen(true);
    };
    const closeGuide = () => setIsGuideOpen(false);

    const value = {
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        isGuideOpen,
        openGuide,
        closeGuide,
        guideStep,
        setGuideStep
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
