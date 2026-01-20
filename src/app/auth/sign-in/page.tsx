'use client'

import { useActionState } from "react"
import { loginUser } from "../actions"
import Link from "next/link"

export default function SignIn() {
    const [state, action, isPending] = useActionState(loginUser, null)

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 px-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                        BestDeal
                    </Link>
                    <h2 className="text-xl font-semibold text-white mt-4">Welcome back</h2>
                    <p className="text-neutral-400 text-sm">Sign in to your account</p>
                </div>

                <form action={action} className="space-y-4">
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
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-neutral-600"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {state.error}
                        </div>
                    )}

                    <button
                        disabled={isPending}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isPending ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-neutral-500">
                    Don't have an account?{" "}
                    <Link href="/auth/sign-up" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
