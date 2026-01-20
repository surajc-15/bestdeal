'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, Tractor, ShoppingCart, User, LogOut, Phone, Info } from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"

interface NavbarProps {
    user?: {
        name?: string | null
        role?: string
    }
}

export function Navbar({ user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { name: "Contact", href: "/contact-us" },
    ]

    return (
        <nav className="border-b border-emerald-900/20 bg-gradient-to-r from-neutral-900 via-emerald-950/30 to-neutral-900 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-emerald-900/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-2 rounded-lg group-hover:from-emerald-500/30 group-hover:to-emerald-600/20 transition-all shadow-lg shadow-emerald-500/10">
                        <Tractor className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
                        BestDeal
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-semibold transition-colors hover:text-emerald-400 ${pathname === link.href ? "text-emerald-400" : "text-neutral-300"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-neutral-800" />

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-neutral-400 hidden lg:block">Hello, {user.name}</span>
                                <Link
                                    href={user.role === "FARMER" ? "/farmer/dashboard" : "/buyer/dashboard"}
                                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg font-medium transition-all text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/40 hover:scale-105"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/auth/sign-in"
                                    className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/sign-up"
                                    className="px-4 py-2 bg-white text-neutral-950 rounded-lg font-medium hover:bg-neutral-200 transition-all text-sm shadow-md"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-neutral-400"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-16 left-0 w-full bg-neutral-900 border-b border-neutral-800 p-4 flex flex-col gap-4 shadow-xl"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-emerald-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-px bg-neutral-800 my-2" />
                    {user ? (
                        <>
                            <Link
                                href={user.role === "FARMER" ? "/farmer/dashboard" : "/buyer/dashboard"}
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 bg-emerald-600/10 text-emerald-400 rounded-lg font-medium text-center"
                            >
                                Go to Dashboard
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/auth/sign-in"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 text-center rounded-lg bg-neutral-800 text-neutral-300"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/sign-up"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 text-center rounded-lg bg-emerald-600 text-white font-medium"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </motion.div>
            )}
        </nav>
    )
}
