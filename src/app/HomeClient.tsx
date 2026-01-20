'use client'

import Link from "next/link";
import { HeroAnimation } from "@/components/HeroAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { div } from "framer-motion/client";

// Mock data (Indian Context)
const activeRequests = [
    { id: 1, crop: "Sharbati Wheat", quantity: "50 Qtl", price: "₹3,200/Qtl", location: "Bhopal, MP" },
    { id: 2, crop: "Basmati Rice (1121)", quantity: "100 Qtl", price: "₹6,500/Qtl", location: "Karnal, Haryana" },
    { id: 3, crop: "Cotton (Desi)", quantity: "200 Qtl", price: "₹7,100/Qtl", location: "Akola, Maharashtra" },
    { id: 4, crop: "Nashik Onions", quantity: "500 Qtl", price: "₹1,800/Qtl", location: "Nashik, Maharashtra" },
    { id: 5, crop: "Mustard Seeds", quantity: "75 Qtl", price: "₹5,400/Qtl", location: "Jaipur, Rajasthan" },
    { id: 6, crop: "Kashmiri Apples", quantity: "400 Boxes", price: "₹950/Box", location: "Sopore, J&K" },
    { id: 7, crop: "Turmeric (Raw)", quantity: "150 Qtl", price: "₹8,200/Qtl", location: "Erode, Tamil Nadu" },
    { id: 8, crop: "Sugarcane", quantity: "1000 Ton", price: "₹3,100/Ton", location: "Muzaffarnagar, UP" },
];

const headlines = [
    "Reimagining Agricultural Trade",
    "No Middlemen. Just Profit.",
    "Farmers & Buyers Connected."
]

export default function HomeClient({ session }: { session?: any }) {
    const [headlineIndex, setHeadlineIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setHeadlineIndex((prev) => (prev + 1) % headlines.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])


    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30 font-sans">

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-10 pb-20 px-4 min-h-[90vh] flex flex-col justify-center">
                {/* Dynamic Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none opacity-50" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="space-y-10 text-center lg:text-left order-2 lg:order-1"
                    >
                        {/* Glassmorphic Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/80 text-xs font-medium uppercase tracking-widest shadow-xl"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>India's #1 Direct Marketplace</span>
                        </motion.div>

                        {/* Rotating Headline */}
                        <div className="h-[140px] md:h-[180px] flex items-center justify-center lg:justify-start">
                            <AnimatePresence mode="wait">
                                <motion.h1
                                    key={headlineIndex}
                                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.8 }}
                                    className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
                                >
                                    {headlineIndex === 0 && (
                                        <>Reimagining <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Agricultural Trade</span></>
                                    )}
                                    {headlineIndex === 1 && (
                                        <>No Middlemen. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Just Pure Profit.</span></>
                                    )}
                                    {headlineIndex === 2 && (
                                        <>Farmers & Buyers. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Directly Connected.</span></>
                                    )}
                                </motion.h1>
                            </AnimatePresence>
                        </div>

                        <p className="text-xl text-neutral-400 max-w-xl leading-relaxed mx-auto lg:mx-0 font-light">
                            Experience the freedom of fair trade. Sahi Daam, Seedha Munafa. <br />
                            <span className="text-emerald-500 font-normal">0% Commission. 100% Transparency.</span>
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4"
                        >
                            {!session ? (
                                <>
                                    <Link href="/auth/sign-up?role=FARMER" className="group w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] flex items-center justify-center gap-3">
                                        Start Selling (बेचें)
                                        <span className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </span>
                                    </Link>
                                    <Link href="/auth/sign-up?role=BUYER" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-semibold transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                                        I'm a Buyer
                                    </Link>
                                </>
                            ) : (
                                <Link href={session.user?.role === 'FARMER' ? '/farmer/dashboard' : '/buyer/dashboard'} className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
                                    Go to Dashboard
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Animation/Visuals */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="flex-1 w-full order-1 lg:order-2"
                    >
                        <HeroAnimation />
                    </motion.div>
                </div>
            </div>

            {/* Live Market Section */}
            <section className="w-full bg-neutral-900/50 backdrop-blur-sm border-y border-neutral-800 py-24 relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Market Rates</h2>
                            <p className="text-neutral-400">Real-time prices from across the country. (Mandi Bhav)</p>
                        </div>
                        <Link href="/auth/sign-up" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition-colors">
                            View All Crops <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {activeRequests.map((req, index) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-neutral-950/80 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden shadow-lg hover:shadow-emerald-500/10"
                            >
                                <h3 className="font-bold text-white text-lg mb-1">{req.crop}</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-sm text-neutral-400">{req.quantity}</span>
                                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">{req.price}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-neutral-500">
                                    <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {req.location}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Section (Placeholder as requested) */}
            <section className="py-24 bg-neutral-950 relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">See How It Works</h2>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                            Watch how BestDeal empowers farmers to get the best price for their produce, instantly.
                        </p>
                    </div>

                    <div className="relative max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group bg-neutral-900">
                        <video
                            className="w-full h-full object-cover"
                            controls
                            playsInline
                            poster="/video-poster.jpg"
                        >
                            <source src="/bestdealvideo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </section>

        </div>
    )
}