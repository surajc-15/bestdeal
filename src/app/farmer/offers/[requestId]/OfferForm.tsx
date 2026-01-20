'use client'

import { useFormStatus } from "react-dom";
import { submitOffer } from "../actions";
import { useActionState } from "react";
// If useActionState is not available (Next.js 14), use useFormState.
// Assuming Next.js 14/15, useActionState is experimental or named useFormState.
// Let's use standard form action for simplicity first, or useActionState if available.
// NextJS 14 stable uses useFormState.

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OfferForm({ requestId, defaultQuantity, targetPrice }: { requestId: string, defaultQuantity: number, targetPrice: number }) {
    const [state, formAction] = useFormState(submitOffer, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        }
        if (state?.success) {
            toast.success("Offer Sent Successfully!");
            // Redirect after a short delay to let the toast be seen
            setTimeout(() => {
                router.push("/farmer/dashboard");
            }, 1500);
        }
    }, [state, router]);

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="requestId" value={requestId} />



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Quantity to Offer (kg)</label>
                    <input
                        type="number"
                        name="quantity"
                        defaultValue={defaultQuantity}
                        min={1}
                        step="any"
                        required
                        className="w-full p-3 bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Price per kg (₹)</label>
                    <input
                        type="number"
                        name="pricePerKg"
                        defaultValue={targetPrice}
                        min={1}
                        step="any"
                        required
                        className="w-full p-3 bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    />
                    <p className="text-xs text-neutral-500">You can propose a different price for negotiation.</p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Message (Optional)</label>
                <textarea
                    name="message"
                    rows={4}
                    placeholder="E.g. Quality assurance, harvest date, transport details..."
                    className="w-full p-3 bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                ></textarea>
            </div>

            <div className="pt-4">
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
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Offer...
                </span>
            ) : "Submit Offer"}
        </button>
    );
}
