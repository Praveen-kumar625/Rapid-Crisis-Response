import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate registration protocol
        setTimeout(() => {
            console.log("Establishing node credentials...", form);
            toast.success("Operative Registered (Demo Protocol)");
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#060B13] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 bg-[#0B121D] border border-cyan-500/20 p-8 md:p-12 w-full max-w-[450px] shadow-[0_0_60px_rgba(6,182,212,0.1)]"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 mb-6 shadow-neon-cyan">
                        <ShieldCheck size={32} className="text-cyan-400 animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-[0.2em] text-center uppercase italic">
                        Node_Registration
                    </h1>
                    <p className="text-[10px] text-slate-500 text-center mt-3 uppercase tracking-widest font-bold">
                        Establish Operative Credentials
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="FULL_NAME"
                            required
                            className="w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500/50 outline-none py-4 pl-12 pr-4 text-white text-sm font-mono rounded-none"
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input
                            type="email"
                            placeholder="EMAIL_ADDRESS"
                            required
                            className="w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500/50 outline-none py-4 pl-12 pr-4 text-white text-sm font-mono rounded-none"
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input
                            type="password"
                            placeholder="ACCESS_KEY"
                            required
                            className="w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500/50 outline-none py-4 pl-12 pr-4 text-white text-sm font-mono rounded-none"
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#060B13] py-4 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-neon-cyan disabled:opacity-50"
                    >
                        {loading ? "PROCESSING..." : "Initialize_Access"}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-3">Existing operative?</p>
                    <Link to="/login" className="text-cyan-400 text-[11px] font-black tracking-widest uppercase hover:underline">
                        Return_to_Auth
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
