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
            className={`flex items-center justify-between w-full px-6 py-5 border-b border-white/5 transition-all duration-300 relative overflow-hidden ${
                isActive ? 'bg-cyan-500/5 text-cyan-400' : 'text-slate-400 active:bg-white/5'
            }`}
        >
            <div className="flex items-center gap-5 relative z-10">
                <Icon size={20} className={isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-500'} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] italic">{children}</span>
            </div>
            <ChevronRight size={14} className={isActive ? 'text-cyan-400' : 'text-slate-600'} />
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />}
        </Link>
    );
};

export const MobileNavbar = ({ user, logout }) => {
    const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUI();
    const location = useLocation();
    const navigate = useNavigate();

    const isImmersivePage = location.pathname === '/hud' || location.pathname === '/mobile-hud' || location.pathname === '/map';

    return (
        <>
            {/* TOP BAR */}
            {!isImmersivePage && (
                <header className="sticky top-0 z-40 bg-[#0B0F19]/60 backdrop-blur-2xl border-b border-white/5 h-16 flex items-center justify-between px-4 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                    
                    <button 
                        onClick={toggleMobileMenu}
                        className="w-12 h-12 flex items-center justify-center text-slate-400 relative group"
                    >
                        <Menu size={24} />
                    </button>

                    <Link to="/" className="flex items-center gap-2 relative">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-neon-cyan mr-1" />
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                            RCR <span className="text-cyan-400">MOBILE</span>
                        </span>
                    </Link>

                    <Link to="/report">
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-red-600/10 border border-red-600/40 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                        >
                            <ShieldAlert size={20} />
                        </motion.button>
                    </Link>
                </header>
            )}

            {/* FULLSCREEN OVERLAY MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                            className="fixed inset-0 z-[60] bg-[#020617]/90 backdrop-blur-md md:hidden"
                        />

                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 z-[70] w-[85%] max-w-[320px] bg-[#0B0F19] border-r border-white/10 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-slate-800 border border-white/10 flex items-center justify-center">
                                        <Shield className="text-cyan-400 w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white uppercase leading-none italic">Interface</span>
                                        <span className="text-[8px] font-bold text-cyan-500 uppercase tracking-widest mt-1">Terminal_v4.2</span>
                                    </div>
                                </div>
                                <button onClick={closeMobileMenu} className="p-2 text-slate-500 active:text-white"><X size={24} /></button>
                            </div>

                            <nav className="flex-1 overflow-y-auto pt-4 bg-gradient-to-b from-transparent to-cyan-500/[0.01]">
                                <MobileNavLink to="/" icon={Activity} currentPath={location.pathname} onClick={closeMobileMenu}>Overview</MobileNavLink>
                                <MobileNavLink to="/map" icon={MapIcon} currentPath={location.pathname} onClick={closeMobileMenu}>Live Map</MobileNavLink>
                                <MobileNavLink to="/hud" icon={Shield} currentPath={location.pathname} onClick={closeMobileMenu}>Tactical HUD</MobileNavLink>
                                <MobileNavLink to="/dashboard" icon={BarChart2} currentPath={location.pathname} onClick={closeMobileMenu}>Intel Archive</MobileNavLink>
                            </nav>

                            <div className="p-6 border-t border-white/10 bg-black/40">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-3 bg-white/[0.03] border border-white/5">
                                            <div className="w-10 h-10 bg-slate-800 border border-white/10 flex items-center justify-center">
                                                <span className="text-[12px] font-black text-cyan-400">{user.email?.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-white font-black uppercase truncate">{user.email?.split('@')[0]}</p>
                                                <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Authorized_Node</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { logout(); closeMobileMenu(); }}
                                            className="w-full py-4 border border-red-900/30 bg-red-950/10 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:bg-red-600 active:text-white transition-all shadow-lg"
                                        >
                                            <LogOut size={14} /> TERMINATE_LINK
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => { navigate("/login"); closeMobileMenu(); }}
                                        className="w-full py-5 bg-cyan-600 text-white text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(8,145,178,0.3)] relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                                        <LogIn size={16} /> AUTHORIZE_NODE
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* BOTTOM ACTION BAR */}
            {!isImmersivePage && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/80 backdrop-blur-2xl border-t border-white/5 flex h-20 items-center justify-around px-2 pb-safe">
                    {[
                        { to: '/', icon: Activity, label: 'Vitals' },
                        { to: '/map', icon: MapIcon, label: 'Grid' },
                        { to: '/report', icon: ShieldAlert, label: 'SOS', special: true },
                        { to: '/hud', icon: Shield, label: 'HUD' },
                        { to: '/dashboard', icon: BarChart2, label: 'Intel' }
                    ].map((item) => (
                        <Link key={item.to} to={item.to} className="flex flex-col items-center gap-1.5 px-3 relative group">
                            {item.special ? (
                                <div className="-mt-12 flex flex-col items-center">
                                    <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] border-4 border-[#0B0F19] relative z-10"
                                    >
                                        <ShieldAlert size={28} className="text-white" />
                                    </motion.div>
                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-2 drop-shadow-md">SOS</span>
                                </div>
                            ) : (
                                <>
                                    <item.icon size={22} className={`${location.pathname === item.to ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-slate-500 group-active:text-slate-300'}`} />
                                    <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${location.pathname === item.to ? 'text-cyan-400' : 'text-slate-600'}`}>{item.label}</span>
                                    {location.pathname === item.to && <motion.div layoutId="activeDot" className="absolute -bottom-2 w-1 h-1 bg-cyan-500 rounded-full shadow-neon-cyan" />}
                                </>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
};
