import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function FarmerDealsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/sign-in");
    }

    // Fetch all transactions for this farmer
    const myDeals = await prisma.transaction.findMany({
        where: { farmerId: session.user.id },
        include: {
            buyer: { select: { name: true, email: true, phone: true } },
            request: { select: { cropType: true, location: true, deliveryType: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="min-h-screen bg-neutral-50 p-8 pt-24 font-sans text-neutral-900">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/farmer/dashboard" className="text-neutral-400 hover:text-neutral-600 transition">
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-emerald-900">My Deals</h1>
                    <p className="text-neutral-600">Track all your confirmed sales and deliveries.</p>
                </header>

                {myDeals.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border border-neutral-200 text-center">
                        <p className="text-neutral-500 mb-4">You haven't confirmed any deals yet.</p>
                        <Link href="/farmer/dashboard" className="text-emerald-600 font-medium hover:underline">
                            Browse active requests
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myDeals.map((deal) => (
                            <div key={deal.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-neutral-800">{deal.request.cropType}</h3>
                                        <p className="text-sm text-neutral-500">to {deal.buyer.name}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs rounded-full font-bold ${deal.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                                            deal.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800' :
                                                deal.status === 'PAID' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-amber-100 text-amber-800'
                                        }`}>
                                        {deal.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-neutral-50 rounded-lg p-4">
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Quantity</p>
                                        <p className="font-bold text-neutral-800">{deal.quantitySold.toLocaleString()} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Total Earnings</p>
                                        <p className="font-bold text-emerald-700">₹{deal.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Delivery</p>
                                        <p className={`text-xs font-bold px-2 py-1 rounded ${deal.request.deliveryType === 'FARMER_DELIVER'
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            {deal.request.deliveryType === 'FARMER_DELIVER' ? 'You Deliver' : 'Buyer Pickup'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Date</p>
                                        <p className="font-semibold text-neutral-800">{new Date(deal.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                                    <div className="text-sm text-neutral-600">
                                        <p><strong>Buyer:</strong> {deal.buyer.name}</p>
                                        <p><strong>Contact:</strong> {deal.buyer.phone || deal.buyer.email}</p>
                                        <p><strong>Location:</strong> {deal.request.location}</p>
                                    </div>
                                    {deal.status === 'PENDING' && (
                                        <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                                            ⏳ Pending Delivery
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
