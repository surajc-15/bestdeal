import { Navbar } from "@/components/Navbar"
import { auth } from "@/auth"

export default function AboutUs() {

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col">

            <main className="flex-1">
                {/* Hero */}
                <section className="py-24 px-6 text-center border-b border-neutral-900">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Empowering Agriculture Through Technology</h1>
                    <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                        We believe that fair trade builds strong communities. BestDeal removes the barriers between those who grow food and those who buy it.
                    </p>
                </section>

                {/* Content */}
                <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                        <div className="space-y-4 text-neutral-400 text-lg leading-relaxed">
                            <p>
                                At BestDeal, our mission is simple: <strong>Eliminate the middleman</strong>.
                                Traditional agricultural supply chains are cluttered with intermediaries that inflate prices for buyers and squeeze margins for farmers.
                            </p>
                            <p>
                                We provide a transparent, secure digital marketplace where:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-emerald-400/80">
                                <li>Farmers get better prices for their hard work.</li>
                                <li>Buyers get fresher produce at lower costs.</li>
                                <li>Transactions are verified and secure.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="bg-neutral-950 p-6 rounded-2xl text-center">
                                <div className="text-4xl font-bold text-emerald-500 mb-2">10k+</div>
                                <div className="text-sm text-neutral-500">Active Farmers</div>
                            </div>
                            <div className="bg-neutral-950 p-6 rounded-2xl text-center">
                                <div className="text-4xl font-bold text-blue-500 mb-2">$5M+</div>
                                <div className="text-sm text-neutral-500">Traded Volume</div>
                            </div>
                            <div className="bg-neutral-950 p-6 rounded-2xl text-center">
                                <div className="text-4xl font-bold text-purple-500 mb-2">0%</div>
                                <div className="text-sm text-neutral-500">Hidden Fees</div>
                            </div>
                            <div className="bg-neutral-950 p-6 rounded-2xl text-center">
                                <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                                <div className="text-sm text-neutral-500">Support</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
