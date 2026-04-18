import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, handleRedirectResult } from './utils/firebase';
import toast, { Toaster } from 'react-hot-toast';

import { joinHotelRoom, updateSocketToken } from './socket';
import api from './api';
import { AppLayout } from './components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import { getPendingReports, markReportSynced } from './idb';

// Pages
const Home = lazy(() => import('./pages/Home'));
const TacticalDashboard = lazy(() => import('./pages/TacticalDashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const ReportPage = lazy(() => import('./pages/ReportPage'));
const IncidentDetail = lazy(() => import('./pages/IncidentDetail'));
const TacticalHUD = lazy(() => import('./pages/TacticalHUD'));
const TacticalMobileHUD = lazy(() => import('./pages/TacticalMobileHUD'));

const PageLoader = () => (
    <div className="flex-1 flex items-center justify-center bg-[#020617]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
    </div>
);

const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col"
    >
        {children}
    </motion.div>
);

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/map" element={<PageTransition><TacticalDashboard /></PageTransition>} />
                <Route path="/dashboard" element={<PageTransition><Analytics /></PageTransition>} />
                <Route path="/report" element={<PageTransition><ReportPage /></PageTransition>} />
                <Route path="/incidents/:id" element={<PageTransition><IncidentDetail /></PageTransition>} />
                <Route path="/hud" element={<PageTransition><TacticalHUD /></PageTransition>} />
                <Route path="/mobile-hud" element={<PageTransition><TacticalMobileHUD /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
}

import { UIProvider } from './context/UIContext';

function App() {
    // ... existing state and logic

    return (
        <ErrorBoundary>
            <UIProvider>
                <Router>
                    <Toaster position="top-center" />

                    <AppLayout user={user} logout={logout}>
                        <Suspense fallback={<PageLoader />}>
                            <AnimatedRoutes />
                        </Suspense>
                    </AppLayout>
                </Router>
            </UIProvider>
        </ErrorBoundary>
    );
}

export default App;