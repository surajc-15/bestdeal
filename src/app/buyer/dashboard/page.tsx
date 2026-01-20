import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";

export default async function BuyerDashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/sign-in");
    }

    if (session.user.role !== Role.BUYER) {
        redirect("/");
    }

    // Fetch Buyer's Requests and Count PENDING Responses
    const myRequests = await prisma.purchaseRequest.findMany({
        where: { buyerId: session.user.id },
        include: {
            _count: {
                select: { responses: { where: { status: 'CONNECTED' } } }
            }
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-emerald-50/30 to-neutral-50 p-8 pt-24 font-sans text-neutral-900">
            <div className="max-w-6xl mx-auto">
                {/* Header with gradient background */}
                <header className="flex justify-between items-center mb-8 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 shadow-xl shadow-emerald-200/50 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">Buyer Dashboard</h1>
                        <p className="text-emerald-100 text-sm">Manage your purchase requests and track offers</p>
                    </div>
                    <div className="flex gap-2 relative z-10">
                        <Link
                            href="/buyer/deals"
                            className="px-5 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-lg"
                        >
                            📦 My Deals
                        </Link>
                        <Link
                            href="/buyer/create-request"
                            className="px-5 py-2 bg-white text-emerald-600 rounded-full text-sm font-medium hover:bg-emerald-50 transition-all hover:scale-105 shadow-lg"
                        >
                            + Create Request
                        </Link>
                    </div>
                </header>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-neutral-800">My Requests</h2>
                        <div className="text-sm text-neutral-500 bg-white px-4 py-2 rounded-full shadow-sm">
                            {myRequests.length} {myRequests.length === 1 ? 'Request' : 'Requests'}
                        </div>
                    </div>

                    {myRequests.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-neutral-200 text-center">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-neutral-500 mb-4 text-lg">You haven't posted any requests yet.</p>
                            <Link
                                href="/buyer/create-request"
                                className="inline-block text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
                            >
                                Post your first request now →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {myRequests.map((req) => (
                                <div key={req.id} className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl border border-neutral-100 p-5 transition-all duration-300 hover:-translate-y-2 overflow-visible">

                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    {/* Edit Button - Moved to bottom left */}
                                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <Link
                                            href={`/buyer/requests/${req.id}/edit`}
                                            title="Edit Request"
                                            className="text-neutral-400 hover:text-emerald-600 bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 text-xs font-medium border border-neutral-200 hover:border-emerald-200"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Edit
                                        </Link>
                                    </div>

                                    {/* Red Dot & Offer Notification */}
                                    {req._count.responses > 0 && (
                                        <div className="absolute -top-2 -left-2 z-20">
                                            <span className="relative flex h-5 w-5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-br from-red-500 to-red-600 shadow-lg"></span>
                                            </span>
                                        </div>
                                    )}

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-xl text-neutral-800 tracking-tight flex-1">{req.cropType}</h3>
                                            <span className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${req.status === 'ACTIVE'
                                                ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-600 border border-neutral-200'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </div>

                                        <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-xl p-4 border border-neutral-200/50 space-y-3 mb-6 backdrop-blur-sm">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-neutral-500 font-medium flex items-center gap-2">
                                                    <span className="text-lg">⚖️</span> Quantity
                                                </span>
                                                <span className="font-bold text-neutral-800">{req.quantityRemaining.toLocaleString()} kg</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-neutral-500 font-medium flex items-center gap-2">
                                                    <span className="text-lg">💰</span> Target Price
                                                </span>
                                                <span className="font-bold text-emerald-700">₹{req.pricePerKg}<span className="text-xs text-neutral-400 font-normal">/kg</span></span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-neutral-500 font-medium flex items-center gap-2">
                                                    <span className="text-lg">📍</span> Location
                                                </span>
                                                <span className="font-semibold text-neutral-800 truncate max-w-[150px]">{req.location}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-full">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                            <Link
                                                href={`/buyer/requests/${req.id}`}
                                                className={`
                                                    relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 group/btn
                                                    ${req._count.responses > 0
                                                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-emerald-200'
                                                        : 'bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-900 hover:to-neutral-800 text-white shadow-neutral-300'
                                                    }
                                                `}
                                            >
                                                {req._count.responses > 0 ? `${req._count.responses} Offers` : 'View Offers'}
                                                {req._count.responses > 0 && <span className="bg-white h-2 w-2 rounded-full absolute top-1.5 right-1.5 animate-pulse"></span>}
                                                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
