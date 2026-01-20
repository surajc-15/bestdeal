'use client'

import { MapPin, Phone, Mail } from "lucide-react" // Assuming lucide-react is available as per previous context
import { useActionState } from "react"
import { submitContactForm } from "./actions"

export default function ContactUs() {
    const [state, formAction, isPending] = useActionState(submitContactForm, null)

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col pt-20">
            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-6">Get in Touch</h1>
                    <p className="text-neutral-400 text-lg">
                        Have questions about joining BestDeal? We're here to help farmers and buyers connect smoothly.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
                            <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 text-neutral-400">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-white font-medium">Email</p>
                                        <span>support@bestdeal.com</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 text-neutral-400">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-white font-medium">Phone</p>
                                        <p>+91 80 1234 5678</p>
                                        <p>+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 text-neutral-400">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-white font-medium">Office</p>
                                        <p>
                                            123, Innovation Tower,<br />
                                            Outer Ring Road, Marathahalli,<br />
                                            Bengaluru, Karnataka 560037, India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form action={formAction} className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl space-y-4">
                        {state?.error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {state.error}
                            </div>
                        )}
                        {state?.success && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-sm">
                                {state.success}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">First Name</label>
                                <input name="firstName" type="text" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Last Name</label>
                                <input name="lastName" type="text" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                            <input name="email" type="email" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Message</label>
                            <textarea name="message" required rows={4} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-white text-neutral-950 font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
