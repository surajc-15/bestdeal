import { Navbar } from "@/components/Navbar"
import { auth } from "@/auth"

export default function ContactUs() {

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col">

            <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-6">Get in Touch</h1>
                    <p className="text-neutral-400 text-lg">
                        Have questions about joining BestDeal? We're here to help farmers and buyers connect smoothly.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto items-start">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
                            <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-neutral-400">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span>support@bestdeal.com</span>
                                </div>
                                <div className="flex items-center gap-4 text-neutral-400">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-4 text-neutral-400">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <span>123 Market Steet, Tech Hub, CA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">First Name</label>
                                <input type="text" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Last Name</label>
                                <input type="text" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                            <input type="email" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Message</label>
                            <textarea rows={4} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea>
                        </div>
                        <button className="w-full bg-white text-neutral-950 font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
