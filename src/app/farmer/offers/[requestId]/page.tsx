import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OfferForm from "./OfferForm"; // Client component for the form

export default async function MakeOfferPage(props: { params: Promise<{ requestId: string }> }) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user) redirect("/auth/sign-in");

    const request = await prisma.purchaseRequest.findUnique({
        where: { id: params.requestId },
        include: { buyer: true }
    });

    if (!request) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h1 className="text-2xl font-bold text-red-600">Request Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-6 pt-24">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-emerald-900 mb-2">Make an Offer</h1>
                    <p className="text-neutral-600">Submit your best price and quantity for this requirement.</p>
                </header>

                <div className="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-white/60 overflow-hidden ring-1 ring-neutral-100">
                    {/* Request Details Summary */}
                    <div className="bg-gradient-to-br from-emerald-50/80 via-white to-white p-8 border-b border-neutral-100">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide mb-2 uppercase">Requested Crop</span>
                                <h2 className="font-extrabold text-3xl text-emerald-950 tracking-tight leading-none mb-2">{request.cropType}</h2>
                                <p className="text-sm text-neutral-500 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">{request.buyer.name.charAt(0)}</span>
                                    Buying by <span className="font-medium text-emerald-700">{request.buyer.name}</span>
                                </p>
                            </div>
                            <div className="text-right bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                                <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-1">Target Price</p>
                                <p className="text-2xl font-black text-emerald-600">₹{request.pricePerKg}<span className="text-base font-normal text-neutral-400">/kg</span></p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white/80 p-4 rounded-xl border border-neutral-100 shadow-sm backdrop-blur-sm">
                                <span className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1">Quantity Needed</span>
                                <span className="font-bold text-lg text-neutral-800">{request.quantityRequired.toLocaleString()} kg</span>
                            </div>
                            <div className="bg-white/80 p-4 rounded-xl border border-neutral-100 shadow-sm backdrop-blur-sm">
                                <span className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1">Location</span>
                                <span className="font-bold text-lg text-neutral-800 truncate" title={request.location}>{request.location}</span>
                            </div>
                            <div className="bg-white/80 p-4 rounded-xl border border-neutral-100 shadow-sm backdrop-blur-sm">
                                <span className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1">Delivery Method</span>
                                <span className={`font-bold text-lg ${request.deliveryType === 'FARMER_DELIVER' ? 'text-amber-600' : 'text-blue-600'}`}>
                                    {request.deliveryType === 'FARMER_DELIVER' ? 'Farmer Delivers' : 'Buyer Pickup'}
                                </span>
                            </div>
                        </div>

                        {request.instructions && (
                            <div className="mt-6 text-sm bg-orange-50/50 text-orange-800 p-4 rounded-xl border border-orange-100/50 flex gap-3 items-start">
                                <span className="text-xl">💡</span>
                                <div>
                                    <strong className="block font-bold text-orange-900 mb-1">Instructions:</strong>
                                    {request.instructions}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Offer Form */}
                    <div className="p-6">
                        <OfferForm
                            requestId={request.id}
                            defaultQuantity={request.quantityRequired}
                            targetPrice={request.pricePerKg}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
