import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Menu, Shield, Activity, Map as MapIcon, 
    BarChart2, ShieldAlert, LogOut, LogIn, ChevronRight 
} from 'lucide-react';
import { useUI } from '../../context/UIContext';

const MobileNavLink = ({ to, icon: Icon, children, currentPath, onClick }) => {
    const isActive = currentPath === to;
    
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center justify-between w-full px-6 py-4 border-b border-slate-800 transition-colors ${
                isActive ? 'bg-slate-800/50 text-cyan-400' : 'text-slate-300 active:bg-slate-800'
            }`}
        >
            <div className="flex items-center gap-4">
                <Icon size={20} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                <span className="text-sm font-bold uppercase tracking-widest">{children}</span>
            </div>
            <ChevronRight size={16} className={isActive ? 'text-cyan-400' : 'text-slate-600'} />
        </Link>
    );
};

export const MobileNavbar = ({ user, logout }) => {
    const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUI();
    const location = useLocation();
    const navigate = useNavigate();

    const menuVariants = {
        closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
    };

    const overlayVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const isImmersivePage = location.pathname === '/hud' || location.pathname === '/mobile-hud' || location.pathname === '/map';

    return (
        <>
            {/* STICKY TOP BAR FOR MOBILE */}
            {!isImmersivePage && (
                <header className="sticky top-0 z-40 bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-800 md:hidden h-16 flex items-center justify-between px-4">
                    <button 
                        onClick={toggleMobileMenu}
                        className="w-12 h-12 flex items-center justify-center text-slate-400 active:text-cyan-400"
                        aria-label="Toggle Menu"
                    >
                        <Menu size={24} />
                    </button>

                    <Link to="/" className="flex items-center gap-2">
                        <Shield className="text-cyan-400 w-5 h-5" />
                        <span className="text-xs font-black text-white uppercase tracking-tighter">
                            RCR <span className="text-cyan-400">MOBILE</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link to="/report">
                            <button className="w-10 h-10 bg-red-600/20 border border-red-600/50 flex items-center justify-center rounded-none text-red-500">
                                <ShieldAlert size={20} />
                            </button>
                        </Link>
                    </div>
                </header>
            )}

            {/* SLIDE-OUT MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* BACKDROP */}
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={overlayVariants}
                            onClick={closeMobileMenu}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
                        />

                        {/* MENU PANEL */}
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            className="fixed top-0 left-0 bottom-0 z-[70] w-[80%] max-w-[300px] bg-[#0B0F19] border-r border-slate-800 shadow-2xl md:hidden flex flex-col"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 border border-slate-700 flex items-center justify-center">
                                        <Shield className="text-cyan-400 w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-black text-white uppercase">COMMAND_CENTRE</span>
                                </div>
                                <button 
                                    onClick={closeMobileMenu}
                                    className="w-10 h-10 flex items-center justify-center text-slate-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto pt-2">
                                <MobileNavLink to="/" icon={Activity} currentPath={location.pathname} onClick={closeMobileMenu}>Overview</MobileNavLink>
                                <MobileNavLink to="/map" icon={MapIcon} currentPath={location.pathname} onClick={closeMobileMenu}>Live Map</MobileNavLink>
                                <MobileNavLink to="/hud" icon={Shield} currentPath={location.pathname} onClick={closeMobileMenu}>Tactical HUD</MobileNavLink>
                                <MobileNavLink to="/dashboard" icon={BarChart2} currentPath={location.pathname} onClick={closeMobileMenu}>Analytics</MobileNavLink>
                            </nav>

                            <div className="p-6 border-t border-slate-800 bg-slate-900/20">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700">
                                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                                                <span className="text-[10px] font-black text-cyan-400">{user.email?.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-slate-500 font-mono uppercase truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                logout();
                                                closeMobileMenu();
                                            }}
                                            className="w-full py-4 border border-slate-700 text-slate-400 text-[10px] font-black uppercase flex items-center justify-center gap-3 active:bg-red-900/20 active:text-red-400 active:border-red-900/50 transition-all"
                                        >
                                            <LogOut size={16} />
                                            TERMINATE_SESSION
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            navigate("/login");
                                            closeMobileMenu();
                                        }}
                                        className="w-full py-4 bg-cyan-600 text-black text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-neon-cyan"
                                    >
                                        <LogIn size={16} />
                                        AUTHORIZE_ACCESS
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* STICKY BOTTOM ACTION BAR FOR CRITICAL MOBILE CALLS */}
            {!isImmersivePage && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/90 backdrop-blur-lg border-t border-slate-800 md:hidden flex h-20 items-center justify-around px-4 pb-safe">
                    <Link to="/" className="flex flex-col items-center gap-1">
                        <Activity size={20} className={location.pathname === '/' ? 'text-cyan-400' : 'text-slate-500'} />
                        <span className={`text-[8px] font-black uppercase ${location.pathname === '/' ? 'text-cyan-400' : 'text-slate-600'}`}>Status</span>
                    </Link>
                    <Link to="/map" className="flex flex-col items-center gap-1">
                        <MapIcon size={20} className={location.pathname === '/map' ? 'text-cyan-400' : 'text-slate-500'} />
                        <span className={`text-[8px] font-black uppercase ${location.pathname === '/map' ? 'text-cyan-400' : 'text-slate-600'}`}>Map</span>
                    </Link>
                    
                    <Link to="/report" className="-mt-10">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.5)] border-4 border-[#0B0F19]">
                            <ShieldAlert size={28} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black text-red-500 uppercase flex justify-center mt-1">SOS</span>
                    </Link>

                    <Link to="/hud" className="flex flex-col items-center gap-1">
                        <Shield size={20} className={location.pathname === '/hud' ? 'text-cyan-400' : 'text-slate-500'} />
                        <span className={`text-[8px] font-black uppercase ${location.pathname === '/hud' ? 'text-cyan-400' : 'text-slate-600'}`}>HUD</span>
                    </Link>
                    <Link to="/dashboard" className="flex flex-col items-center gap-1">
                        <BarChart2 size={20} className={location.pathname === '/dashboard' ? 'text-cyan-400' : 'text-slate-500'} />
                        <span className={`text-[8px] font-black uppercase ${location.pathname === '/dashboard' ? 'text-cyan-400' : 'text-slate-600'}`}>Intel</span>
                    </Link>
                </div>
            )}
        </>
    );
};
