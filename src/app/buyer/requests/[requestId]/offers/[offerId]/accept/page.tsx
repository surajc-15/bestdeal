import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AcceptOfferForm from "./AcceptOfferForm";

export default async function AcceptOfferPage(props: { params: Promise<{ requestId: string; offerId: string }> }) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user) redirect("/auth/sign-in");

    const offer = await prisma.farmerResponse.findUnique({
        where: { id: params.offerId },
        include: { farmer: true, request: true }
    });

    if (!offer || offer.requestId !== params.requestId) return <div>Offer not found</div>;

    return (
        <div className="min-h-screen bg-neutral-50 p-6 pt-24 font-sans text-neutral-900 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl shadow-neutral-200 overflow-hidden border border-neutral-100">
                <div className="bg-emerald-600 p-8 text-white text-center">
                    <h1 className="text-3xl font-bold mb-2">Accept Offer</h1>
                    <p className="opacity-90">Confirm deal with {offer.farmer.name}</p>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-8 pb-8 border-b border-neutral-100">
                        <div className="text-center w-1/2 border-r border-neutral-100">
                            <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Price</span>
                            <span className="text-2xl font-bold text-emerald-600">₹{offer.pricePerKg}/kg</span>
                        </div>
                        <div className="text-center w-1/2">
                            <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Quantity</span>
                            <span className="text-2xl font-bold text-neutral-800">{offer.quantityOffered.toLocaleString()} kg</span>
                        </div>
                    </div>

                    <AcceptOfferForm
                        requestId={params.requestId}
                        offerId={offer.id}
                        farmerName={offer.farmer.name || 'Farmer'}
                        initialQuantity={offer.quantityOffered}
                        initialPrice={offer.pricePerKg}
                    />
                </div>
            </div>
        </div>
    );
}
