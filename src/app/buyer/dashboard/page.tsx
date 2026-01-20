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
        <div className="min-h-screen bg-neutral-50 p-8 pt-24 font-sans text-neutral-900">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
                        <p className="text-neutral-600">Manage your purchase requests and track offers.</p>
                    </div>
                    <Link
                        href="/buyer/create-request"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition"
                    >
                        Create New Request
                    </Link>
                </header>

                <section>
                    <h2 className="text-xl font-semibold mb-4">My Requests</h2>
                    {myRequests.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl border border-neutral-200 text-center py-12">
                            <p className="text-neutral-500 mb-4">You haven't posted any requests yet.</p>
                            <Link
                                href="/buyer/create-request"
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Post your first request now
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myRequests.map((req) => (
                                <div key={req.id} className="group bg-white rounded-2xl shadow-lg shadow-neutral-100 border border-white/50 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-visible bg-gradient-to-br from-white via-white to-emerald-50/30">

                                    {/* Edit Button */}
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <Link
                                            href={`/buyer/requests/${req.id}/edit`}
                                            title="Edit Request"
                                            className="text-neutral-400 hover:text-emerald-600 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-sm hover:shadow-md transition-all block border border-neutral-100"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Link>
                                    </div>

                                    {/* Red Dot & Offer Notification */}
                                    {req._count.responses > 0 && (
                                        <div className="absolute -top-1 -left-1 z-20">
                                            <span className="relative flex h-4 w-4">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-xl text-neutral-800 tracking-tight">{req.cropType}</h3>
                                        <span className={`px-3 py-1 text-xs rounded-full font-bold tracking-wide border ${req.status === 'ACTIVE'
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                            : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>

                                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-3 mb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-500 font-medium">Quantity</span>
                                            <span className="font-bold text-neutral-800">{req.quantityRequired.toLocaleString()} kg</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-500 font-medium">Target Price</span>
                                            <span className="font-bold text-emerald-700">₹{req.pricePerKg}<span className="text-xs text-neutral-400 font-normal">/kg</span></span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-500 font-medium">Location</span>
                                            <span className="font-semibold text-neutral-800 truncate max-w-[150px]">{req.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </span>
                                        <Link
                                            href={`/buyer/requests/${req.id}`}
                                            className={`
                                                relative px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg flex items-center gap-2
                                                ${req._count.responses > 0
                                                    ? 'bg-gradient-to-r from-neutral-900 to-neutral-800 hover:to-emerald-600 text-white shadow-emerald-100 hover:shadow-emerald-200'
                                                    : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-neutral-200'
                                                }
                                            `}
                                        >
                                            View {req._count.responses > 0 ? `${req._count.responses} Offers` : 'Responses'}
                                            {req._count.responses > 0 && <span className="bg-red-500 h-2 w-2 rounded-full absolute top-2 right-2 animate-pulse"></span>}
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </Link>
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
