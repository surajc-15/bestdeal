import { auth } from "@/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export default async function FarmerDashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/sign-in");
    }

    if (session.user.role !== Role.FARMER) {
        redirect("/");
    }

    // Fetch Real Requests with User's Response Status (Only ACTIVE requests)
    const requests = await prisma.purchaseRequest.findMany({
        where: {
            status: 'ACTIVE',
            quantityRemaining: { gt: 0 } // Only show requests with remaining quantity
        },
        include: {
            buyer: { select: { name: true } },
            responses: {
                where: { farmerId: session.user.id },
                select: { status: true, id: true }
            }
        },
        orderBy: { createdAt: "desc" },
    });

    // Custom Sort: Sent (Connected/Pending) > New
    const realRequests = requests.sort((a, b) => {
        const aHasOffer = a.responses.length > 0;
        const bHasOffer = b.responses.length > 0;

        if (aHasOffer && !bHasOffer) return -1;
        if (!aHasOffer && bHasOffer) return 1;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-emerald-50/30 to-neutral-50 p-6 pt-24 font-sans text-neutral-900">
            <div className="max-w-7xl mx-auto">
                {/* Header with gradient background */}
                <header className="mb-8 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 shadow-xl shadow-emerald-200/50 relative overflow-hidden flex justify-between items-center">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">Farmer Dashboard</h1>
                        <p className="text-emerald-100 text-sm">Browse active requirements from buyers across India</p>
                    </div>
                    <Link
                        href="/farmer/deals"
                        className="relative z-10 px-5 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-lg"
                    >
                        📦 My Deals
                    </Link>
                </header>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-800">Available Requests</h2>
                    <div className="text-sm text-neutral-500 bg-white px-4 py-2 rounded-full shadow-sm">
                        {realRequests.length} {realRequests.length === 1 ? 'Request' : 'Requests'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {realRequests.map((req) => {
                        const myOffer = req.responses[0]; // Pending offer if exists
                        const hasOffered = !!myOffer;

                        return (
                            <div key={req.id} className="group relative bg-white rounded-2xl shadow-lg shadow-neutral-100 border border-white/50 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-gradient-to-br from-white via-white to-emerald-50/50 backdrop-blur-sm ring-1 ring-neutral-100/70">

                                {/* Card Header & Price */}
                                <div className="mb-5">
                                    <div className="flex justify-between items-start gap-3 mb-2">
                                        <h3 className="font-bold text-xl text-neutral-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                                            {req.cropType}
                                        </h3>
                                        <div className="flex flex-col items-end shrink-0">
                                            <span className="bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-emerald-200 shadow-md">
                                                ₹{req.pricePerKg}
                                            </span>
                                            <span className="text-[10px] text-neutral-400 mt-1 font-medium tracking-wide">PER KG</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-[10px] text-orange-600 font-bold border border-white shadow-sm">
                                            {req.buyer.name.charAt(0)}
                                        </div>
                                        <span>{req.buyer.name}</span>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="space-y-3 mb-6 flex-grow bg-neutral-50/50 rounded-xl p-3 border border-neutral-100/50">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-500 font-medium">Quantity</span>
                                        <span className="font-bold text-neutral-800">{req.quantityRemaining.toLocaleString()} kg</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-500 font-medium">Location</span>
                                        <span className="font-semibold text-neutral-800 text-right truncate max-w-[120px]" title={req.location}>
                                            {req.location}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-neutral-500 font-medium">Delivery</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${req.deliveryType === 'FARMER_DELIVER'
                                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                            {req.deliveryType === 'FARMER_DELIVER' ? 'You Deliver' : 'Buyer Pickup'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                {hasOffered ? (
                                    <button
                                        disabled
                                        className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-not-allowed bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-400 border-2 border-neutral-200"
                                    >
                                        Offer Sent ⏳
                                    </button>
                                ) : (
                                    <Link
                                        href={`/farmer/offers/${req.id}`}
                                        className="w-full py-3 bg-neutral-900 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-2 group-hover:gap-3"
                                    >
                                        Make an Offer
                                        <span className="transition-transform group-hover:-rotate-45">→</span>
                                    </Link>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
