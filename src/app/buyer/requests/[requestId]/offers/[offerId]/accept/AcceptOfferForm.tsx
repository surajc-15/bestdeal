'use client'

import { acceptOffer } from "@/app/buyer/actions";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AcceptOfferForm({ requestId, offerId, farmerName, initialQuantity, initialPrice }: { requestId: string, offerId: string, farmerName: string, initialQuantity: number, initialPrice: number }) {
    const [state, formAction] = useFormState(acceptOffer, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.error) toast.error(state.error);
        if (state?.success) {
            toast.success("Offer Accepted! Email sent to farmer.");
            setTimeout(() => router.push("/buyer/dashboard"), 2000);
        }
    }, [state, router]);

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="offerId" value={offerId} />
            <input type="hidden" name="requestId" value={requestId} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-800">Final Quantity (kg)</label>
                    <input
                        type="number"
                        name="finalQuantity"
                        defaultValue={initialQuantity}
                        required
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-neutral-900 font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-800">Final Price (₹/kg)</label>
                    <input
                        type="number"
                        name="finalPrice"
                        defaultValue={initialPrice}
                        required
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-neutral-900 font-bold"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-800">Delivery & Transport Instructions</label>
                <p className="text-xs text-neutral-500 mb-2">Provide clear details on where and when to deliver/pickup.</p>
                <textarea
                    name="instructions"
                    required
                    rows={4}
                    placeholder="e.g., Deliver to [Address] by [Date]. Transport charges will be paid by..."
                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-neutral-900"
                ></textarea>
            </div>

            <div className="flex gap-4 pt-2">
                <Link
                    href={`/buyer/requests/${requestId}`}
                    className="flex-1 py-3 text-center border border-neutral-200 text-neutral-600 rounded-xl font-bold hover:bg-neutral-50 transition"
                >
                    Cancel
                </Link>
                <SubmitButton />
            </div>
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-200 transition disabled:opacity-70 flex justify-center items-center gap-2"
        >
            {pending ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : "Confirm & Send"}
        </button>
    );
}
