'use client'

import { motion } from "framer-motion";

export function HeroAnimation() {
    return (
        <div className="relative w-full h-[500px] flex items-center justify-center perspective-[2000px] overflow-visible">

            {/* Cinematic Glow Background */}
            <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Path - Intelligent Glow */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-blue-500/0" />

            {/* 3D Container */}
            <div className="relative w-full h-full flex items-center justify-between px-4 md:px-12 transform-style-3d rotate-x-12">

                {/* FARMER NODE (Source) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-20 flex flex-col items-center gap-6 group"
                >
                    <div className="relative">
                        {/* Pulse Ring */}
                        <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/40 transition-all duration-500 animate-pulse" />

                        {/* Card */}
                        <div className="w-24 h-24 md:w-32 md:h-32 backdrop-blur-xl bg-neutral-900/80 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)] group-hover:scale-105 transition-transform duration-500">
                            <svg className="w-10 h-10 md:w-14 md:h-14 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        {/* Satellite Particles */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-20px] rounded-full border border-dashed border-emerald-500/10 pointer-events-none"
                        />
                    </div>
                    <div className="text-center">
                        <h3 className="text-emerald-400 font-bold tracking-wider text-sm md:text-base mb-1">FARMER</h3>
                        <p className="text-emerald-500/50 text-[10px] uppercase tracking-[0.2em]">Source</p>
                    </div>
                </motion.div>


                {/* STREAM FLOW (The Connection) */}
                <div className="absolute top-1/2 left-[15%] right-[15%] h-20 -translate-y-1/2 pointer-events-none overflow-hidden">
                    {/* Middleman Dissolving (Symbolic) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-red-500/30 rounded-lg flex items-center justify-center"
                    >
                        <span className="text-red-500/50 text-xs">Middleman</span>
                        <div className="absolute inset-0 bg-red-500/10 blur-xl" />
                    </motion.div>

                    {/* Moving Produce Particles */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ left: "0%", opacity: 0, scale: 0.8 }}
                            animate={{
                                left: "100%",
                                opacity: [0, 1, 1, 0],
                                scale: [0.8, 1, 1, 0.8]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 1.2
                            }}
                            className="absolute top-1/2 -translate-y-1/2"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-400 blur-lg opacity-40" />
                                <div className="w-12 h-12 bg-neutral-900 border border-emerald-500/50 rounded-xl flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <span className="text-lg">🌾</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>


                {/* BUYER NODE (Destination) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="relative z-20 flex flex-col items-center gap-6 group"
                >
                    <div className="relative">
                        {/* Pulse Ring */}
                        <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl group-hover:bg-blue-500/40 transition-all duration-500 animate-pulse" style={{ animationDelay: '0.5s' }} />

                        {/* Card */}
                        <div className="w-24 h-24 md:w-32 md:h-32 backdrop-blur-xl bg-neutral-900/80 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.1)] group-hover:scale-105 transition-transform duration-500">
                            <svg className="w-10 h-10 md:w-14 md:h-14 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-2a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-blue-400 font-bold tracking-wider text-sm md:text-base mb-1">BUYER</h3>
                        <p className="text-blue-500/50 text-[10px] uppercase tracking-[0.2em]">Market</p>
                    </div>
                </motion.div>
            </div>

            {/* Floating Text Overlay (Glassmorphic) */}
            <div className="absolute bottom-[-20px] md:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-2 shadow-2xl inline-flex items-center gap-2"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs md:text-sm font-medium text-white/80 tracking-wide">
                        Direct. Transparent. Fast.
                    </span>
                </motion.div>
            </div>
        </div>
    )
}
