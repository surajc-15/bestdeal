'use client'

import { rejectOffer } from "./reject-actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RejectOfferButton({ offerId }: { offerId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleReject = async () => {
        setIsLoading(true);
        const result = await rejectOffer(offerId, reason || undefined);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Offer rejected. Farmer has been notified.");
            setIsOpen(false);
            router.push("/buyer/dashboard");
        }
        setIsLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
                Reject Offer
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Reject Offer</h3>
                <p className="text-sm text-neutral-600 mb-4">
                    Are you sure you want to reject this offer? The farmer will be notified via email.
                </p>

                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Reason (Optional)
                </label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Price too high, quantity not suitable..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows={3}
                />

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Rejecting...
                            </>
                        ) : (
                            "Confirm Reject"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
