import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, ChevronRight, ChevronLeft, Shield, 
    Cpu, Wifi, Map as MapIcon, Zap, CheckCircle 
} from 'lucide-react';
import { useUI } from '../../context/UIContext';

const steps = [
    {
        title: "AI_TRIAGE_PROTOCOL",
        description: "Google Gemini 1.5 Pro analyzes reports in real-time. It evaluates risk levels (1-5) and prioritizes emergency deployment based on automated situational analysis.",
        icon: Cpu,
        color: "text-cyan-400"
    },
    {
        title: "OFFLINE_RESILIENCE",
        description: "Crisis zones often lose connectivity. Our Edge AI architecture allows for offline report generation and basic triage, syncing data the moment signal is restored.",
        icon: Wifi,
        color: "text-amber-400"
    },
    {
        title: "PRECISION_MAPPING",
        description: "Z-Axis mapping tracks incidents across multiple floors. Integrated hotel IoT feeds provide real-time updates on active hazards and safe evacuation routes.",
        icon: MapIcon,
        color: "text-emerald-400"
    },
    {
        title: "RAPID_DISPATCH",
        description: "Sub-100ms latency ensures all nearby responders receive SOS signals instantly via our P2P broadcast network, maximizing response efficiency.",
        icon: Zap,
        color: "text-purple-400"
    }
];

export const StepInstructionGuide = () => {
    const { isGuideOpen, closeGuide, guideStep, setGuideStep } = useUI();

    const nextStep = () => {
        if (guideStep < steps.length - 1) {
            setGuideStep(guideStep + 1);
        } else {
            closeGuide();
        }
    };

    const prevStep = () => {
        if (guideStep > 0) {
            setGuideStep(guideStep - 1);
        }
    };

    const progress = ((guideStep + 1) / steps.length) * 100;

    return (
        <AnimatePresence>
            {isGuideOpen && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeGuide}
                        className="fixed inset-0 z-[100] bg-[#0B0F19]/90 backdrop-blur-md"
                    />

                    {/* MODAL / BOTTOM SHEET */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-[110] md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-[#151B2B] border-t md:border border-slate-800 shadow-2xl overflow-hidden"
                    >
                        {/* PROGRESS BAR */}
                        <div className="h-1 bg-slate-800 w-full">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            />
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-900 border border-slate-800 flex items-center justify-center">
                                        <Shield className="text-cyan-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-white tracking-widest uppercase italic">Operational_Manual</h3>
                                        <p className="text-[8px] text-slate-500 font-mono">STEP {guideStep + 1} OF {steps.length}</p>
                                    </div>
                                </div>
                                <button onClick={closeGuide} className="p-2 text-slate-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={guideStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="min-h-[220px]"
                                >
                                    <div className={`w-16 h-16 mb-6 bg-slate-900 border border-slate-800 flex items-center justify-center ${steps[guideStep].color}`}>
                                        {React.createElement(steps[guideStep].icon, { size: 32 })}
                                    </div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">
                                        {steps[guideStep].title}
                                    </h2>
                                    <p className="text-sm text-slate-400 leading-relaxed font-light">
                                        {steps[guideStep].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                                <button 
                                    onClick={closeGuide}
                                    className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white"
                                >
                                    Skip_Intro
                                </button>

                                <div className="flex gap-3">
                                    {guideStep > 0 && (
                                        <button 
                                            onClick={prevStep}
                                            className="w-12 h-12 border border-slate-700 flex items-center justify-center text-slate-400 hover:border-slate-500 hover:text-white transition-all"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={nextStep}
                                        className="h-12 px-6 bg-cyan-600 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-500 shadow-neon-cyan transition-all"
                                    >
                                        {guideStep === steps.length - 1 ? (
                                            <>
                                                Initialize <CheckCircle size={16} />
                                            </>
                                        ) : (
                                            <>
                                                Continue <ChevronRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* DOTS INDICATOR */}
                        <div className="flex justify-center gap-2 pb-6">
                            {steps.map((_, idx) => (
                                <div 
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                                        idx === guideStep ? 'w-4 bg-cyan-400' : 'bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
