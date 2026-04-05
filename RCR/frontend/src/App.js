import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Dashboard from './pages/Dashboard';
import ReportPage from './pages/ReportPage';
import { joinHotelRoom } from './socket';
import api from './api';
import { AppLayout } from './components/layout/AppLayout';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const { data } = await api.get('/incidents/me');
                    if (data.hotelId) {
                        joinHotelRoom(data.hotelId);
                    }
                } catch (err) {
                    console.error('Failed to sync user context', err);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const login = async() => {
        try { 
            await signInWithPopup(auth, googleProvider); 
            toast.success('Successfully authenticated', {
                style: { background: '#0f172a', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)' }
            });
        } catch (err) { 
            console.error('Login Failed', err); 
            toast.error('Authentication failed');
        }
    };

    return (
        <Router>
            <Toaster 
                position="top-center" 
                toastOptions={{ 
                    className: 'glass-card border border-white/10 text-white text-xs font-bold uppercase tracking-widest py-4 px-6 shadow-2xl',
                    style: { background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)' }
                }} 
            />
            
            <AppLayout user={user} login={login}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/report" element={<ReportPage />} />
                </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;
