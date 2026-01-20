import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RequestDetailsPage(props: { params: Promise<{ requestId: string }> }) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user) redirect("/auth/sign-in");

    const request = await prisma.purchaseRequest.findUnique({
        where: { id: params.requestId, buyerId: session.user.id },
        include: {
            responses: {
                include: { farmer: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!request) return <div>Request not found</div>;

    return (
        <div className="min-h-screen bg-neutral-50 p-6 pt-24 font-sans text-neutral-900">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/buyer/dashboard" className="p-2 rounded-full hover:bg-neutral-200 transition">
                        ← Back
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">{request.cropType}</h1>
                        <p className="text-neutral-500">Posted on {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Request Summary Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 mb-10 flex flex-wrap gap-8 items-center">
                    <div>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Quantity</span>
                        <span className="text-xl font-bold text-neutral-800">{request.quantityRequired.toLocaleString()} kg</span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Target Price</span>
                        <span className="text-xl font-bold text-emerald-600">₹{request.pricePerKg}/kg</span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Location</span>
                        <span className="text-lg font-medium text-neutral-800">{request.location}</span>
                    </div>
                    <div className="ml-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${request.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            }`}>
                            {request.status}
                        </span>
                    </div>
                </div>

                {/* Offers Section */}
                <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
                    Received Offers
                    <span className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full">{request.responses.length}</span>
                </h2>

                {request.responses.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-neutral-300">
                        <p className="text-neutral-500 text-lg">No offers received yet.</p>
                        <p className="text-neutral-400 text-sm mt-2">Check back later or share your request.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {request.responses.map(offer => (
                            <div key={offer.id} className="bg-white rounded-2xl p-6 shadow-md shadow-neutral-100 border border-neutral-100 hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group">
                                {offer.status === 'ACCEPTED' && (
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">ACCEPTED</div>
                                )}

                                <div className="flex items-start gap-4 z-10">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-lg font-bold text-blue-600 shrink-0">
                                        {offer.farmer.name?.charAt(0) || 'F'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-neutral-900">{offer.farmer.name}</h3>
                                        <div className="text-sm text-neutral-500 flex items-center gap-2">
                                            <span>{offer.farmer.location || 'Location not shared'}</span>
                                            {offer.farmer.phone && (
                                                <>
                                                    <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                                                    <span>{offer.farmer.phone}</span>
                                                </>
                                            )}
                                        </div>
                                        {offer.message && (
                                            <div className="mt-3 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600 italic border border-neutral-100 max-w-xl">
                                                "{offer.message}"
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 z-10">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Offered Price</div>
                                        <div className="text-2xl font-bold text-emerald-600">₹{offer.pricePerKg}<span className="text-sm text-neutral-400 font-normal">/kg</span></div>
                                    </div>
                                    <div className="text-right border-l border-neutral-100 pl-8">
                                        <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Quantity</div>
                                        <div className="text-xl font-bold text-neutral-800">{offer.quantityOffered.toLocaleString()} kg</div>
                                    </div>
                                </div>

                                <div className="z-10 w-full md:w-auto mt-4 md:mt-0">
                                    {offer.status === 'PENDING' || offer.status === 'CONNECTED' ? (
                                        <Link
                                            href={`/buyer/requests/${request.id}/offers/${offer.id}/accept`}
                                            className="block w-full md:w-auto px-6 py-3 bg-neutral-900 hover:bg-emerald-600 text-white text-center rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-200"
                                        >
                                            Accept Offer
                                        </Link>
                                    ) : (
                                        <button disabled className="px-6 py-3 bg-neutral-100 text-neutral-400 rounded-xl font-bold cursor-not-allowed">
                                            {offer.status}
                                        </button>
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
