'use client'

import { updateRequest } from "./actions";
import { useFormStatus } from "react-dom";
import Link from "next/link";

// Using useFormState (or useActionState if available/preferred in newer Next.js)
import { useFormState } from "react-dom";

export default function EditRequestForm({ request }: { request: any }) {
    const [state, formAction] = useFormState(updateRequest, null);

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="requestId" value={request.id} />

            {state?.error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Crop Type</label>
                    <input
                        type="text"
                        name="cropType"
                        defaultValue={request.cropType}
                        required
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Quantity (kg)</label>
                    <input
                        type="number"
                        name="quantityRequired"
                        defaultValue={request.quantityRequired}
                        required
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Target Price (₹/kg)</label>
                    <input
                        type="number"
                        name="pricePerKg"
                        defaultValue={request.pricePerKg}
                        required
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Delivery Preference</label>
                    <select
                        name="deliveryType"
                        defaultValue={request.deliveryType}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                        <option value="FARMER_DELIVER">Farmer Delivers</option>
                        <option value="BUYER_PICKUP">Buyer Pick Up</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Location</label>
                <input
                    type="text"
                    name="location"
                    defaultValue={request.location}
                    required
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Instructions (Optional)</label>
                <textarea
                    name="instructions"
                    defaultValue={request.instructions || ""}
                    rows={3}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                ></textarea>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Status</label>
                <select
                    name="status"
                    defaultValue={request.status}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                    <option value="ACTIVE">Active</option>
                    <option value="PASSIVE">Paused</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>

            <div className="flex gap-4 pt-4">
                <Link
                    href="/buyer/dashboard"
                    className="flex-1 py-3 text-center border border-neutral-200 text-neutral-600 rounded-xl font-medium hover:bg-neutral-50 transition"
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
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-200 transition disabled:opacity-70"
        >
            {pending ? "Saving..." : "Save Changes"}
        </button>
    );
}
