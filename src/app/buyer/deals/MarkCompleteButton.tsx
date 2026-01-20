'use client'

import { markDeliveryComplete } from "@/app/buyer/actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MarkCompleteButton({ transactionId }: { transactionId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleMarkComplete = async () => {
        if (!confirm("Are you sure you want to mark this delivery as complete? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        const result = await markDeliveryComplete(transactionId);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("🎉 Congratulations! " + (result.message || "Delivery confirmed successfully!"), {
                duration: 5000,
            });
            router.refresh();
        }
        setIsLoading(false);
    };

    return (
        <button
            onClick={handleMarkComplete}
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {isLoading ? (
                <>
                    <span className="animate-spin">⏳</span>
                    Processing...
                </>
            ) : (
                <>
                    ✅ Mark as Delivered
                </>
            )}
        </button>
    );
}
