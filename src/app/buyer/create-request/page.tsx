'use client'

import { useActionState } from "react"
import { createPurchaseRequest } from "./actions"
import Link from "next/link"

export default function CreateRequestPage() {
    const [state, action, isPending] = useActionState(createPurchaseRequest, null)

    return (
        <div className="min-h-screen bg-neutral-50 p-6 pt-24 font-sans text-neutral-900">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
                <div className="mb-8">
                    <Link href="/buyer/dashboard" className="text-sm text-neutral-500 hover:text-emerald-600 mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-neutral-900">Create Purchase Request</h1>
                    <p className="text-neutral-600">Post a new requirement for farmers to see.</p>
                </div>

                <form action={action} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Crop Name</label>
                            <input
                                name="cropType"
                                type="text"
                                required
                                placeholder="e.g. Basmati Rice"
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Quantity Required (kg)</label>
                            <input
                                name="quantityRequired"
                                type="number"
                                min="1"
                                step="any"
                                required
                                placeholder="e.g. 1000"
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Max Price (₹/kg)</label>
                            <input
                                name="pricePerKg"
                                type="number"
                                min="1"
                                step="any"
                                required
                                placeholder="e.g. 45"
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Delivery Location</label>
                            <input
                                name="location"
                                type="text"
                                required
                                placeholder="e.g. Mumbai, MH"
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700">Delivery Preference</label>
                        <select
                            name="deliveryType"
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                        >
                            <option value="FARMER_DELIVER">Farmer Delivers (Transport Paid by Farmer/Negotiated)</option>
                            <option value="BUYER_PICKUP">Buyer Pick Up (Ex-Farm Gate)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700">Additional Instructions / Quality Specs</label>
                        <textarea
                            name="instructions"
                            rows={3}
                            placeholder="e.g. Moisture content < 12%, specific variety, packaging needs..."
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Publishing Request..." : "Post Request"}
                    </button>
                </form>
            </div>
        </div>
    )
}
