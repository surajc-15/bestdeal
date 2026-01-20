'use client'

import { useActionState, Suspense } from "react"
import { registerUser } from "../actions"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function SignUpContent() {
    const searchParams = useSearchParams()
    // Default to BUYER if not specified, but landing page sends 'FARMER' or 'BUYER'
    const roleParam = searchParams.get('role')
    const role = roleParam === 'FARMER' ? 'FARMER' : 'BUYER'

    // Visual label
    const roleLabel = role === 'FARMER' ? 'Farmer' : 'Buyer'
    const roleConfig = {
        FARMER: {
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            icon: (
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            )
        },
        BUYER: {
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            icon: (
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        }
    }

    const currentConfig = roleConfig[role]

    const [state, action, isPending] = useActionState(registerUser, null)

    return (
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    BestDeal
                </Link>
                <h2 className="text-xl font-semibold text-white mt-4">Create an account</h2>
                <p className="text-neutral-400 text-sm">Start trading directly today</p>
            </div>

            <form action={action} className="space-y-4">

                {/* Role Display (Locked) */}
                <input type="hidden" name="role" value={role} />
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${currentConfig.bg} ${currentConfig.border}`}>
                    <div className={`p-2 rounded-lg bg-neutral-900/50`}>
                        {currentConfig.icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Joining as</p>
                        <p className={`font-semibold ${currentConfig.color}`}>{roleLabel}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Full Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-neutral-600"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-neutral-600"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Phone (Optional)</label>
                    <input
                        name="phone"
                        type="tel"
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-neutral-600"
                        placeholder="+1 234..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-neutral-600"
                        placeholder="Min. 6 characters"
                    />
                </div>

                {state?.error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                        {state.success}
                        <div className="mt-2">
                            <Link href="/auth/sign-in" className="underline hover:text-emerald-300">Proceed to login</Link>
                        </div>
                    </div>
                )}

                <button
                    disabled={isPending}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {isPending ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    )
}

export default function SignUp() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 px-4">
            <Suspense fallback={<div className="text-neutral-500">Loading...</div>}>
                <SignUpContent />
            </Suspense>
        </div>
    )
}
