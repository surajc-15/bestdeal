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

    // Fetch Real Requests with User's Response Status
    const requests = await prisma.purchaseRequest.findMany({
        where: { status: 'ACTIVE' },
        include: {
            buyer: { select: { name: true } },
            responses: {
                where: { farmerId: session.user.id },
                select: { status: true, id: true }
            }
        },
        orderBy: { createdAt: "desc" },
    });

    // Custom Sort: Accepted > Sent (Pending/Connected) > New
    const realRequests = requests.sort((a, b) => {
        const aStatus = a.responses[0]?.status;
        const bStatus = b.responses[0]?.status;

        if (aStatus === 'ACCEPTED') return -1;
        if (bStatus === 'ACCEPTED') return 1;
        if (aStatus === 'CONNECTED' && !bStatus) return -1;
        if (!aStatus && bStatus === 'CONNECTED') return 1;
        return 0;
    });

    return (
        <div className="min-h-screen bg-neutral-50 p-6 pt-24 font-sans text-neutral-900">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-emerald-900">Farmer Dashboard</h1>
                    <p className="text-neutral-600">Browse active requirements from buyers across India.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {realRequests.map((req) => {
                        const myOffer = req.responses[0]; // Since we filtered by farmerId, this is their offer if exists
                        const hasOffered = !!myOffer;
                        const isAccepted = myOffer?.status === 'ACCEPTED';

                        return (
                            <div key={req.id} className="group relative bg-white rounded-2xl shadow-lg shadow-neutral-100 border border-white/50 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-gradient-to-br from-white via-white to-emerald-50/50 backdrop-blur-sm ring-1 ring-neutral-100/70">

                                {/* Notification Batch for Updates */}
                                <div className="absolute -top-3 -right-3 z-20 animate-bounce">
                                    <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-2">
                                        <span>Accepted! 🎉</span>
                                        <span className="w-px h-3 bg-emerald-400"></span>
                                        <span className="font-normal text-emerald-50">Check Email 📩</span>
                                    </div>
                                </div>

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
                                        <span className="font-bold text-neutral-800">{req.quantityRequired.toLocaleString()} kg</span>
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
                                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-not-allowed ${isAccepted
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                                            }`}
                                    >
                                        {isAccepted ? 'Offer Accepted ✅' : 'Offer Sent ⏳'}
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
