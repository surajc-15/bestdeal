'use server'

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendOfferRejectedEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export async function rejectOffer(offerId: string, rejectionReason?: string) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    try {
        // Fetch offer with farmer and request details
        const offer = await prisma.farmerResponse.findUnique({
            where: { id: offerId },
            include: {
                farmer: { select: { name: true, email: true } },
                request: {
                    include: { buyer: { select: { name: true } } }
                }
            }
        });

        if (!offer) return { error: "Offer not found" };
        if (offer.request.buyerId !== session.user.id) return { error: "Unauthorized" };

        // Update offer status to REJECTED
        await prisma.farmerResponse.update({
            where: { id: offerId },
            data: { status: "REJECTED" }
        });

        // Send rejection email to farmer
        await sendOfferRejectedEmail({
            farmerEmail: offer.farmer.email!,
            farmerName: offer.farmer.name!,
            buyerName: offer.request.buyer.name!,
            cropType: offer.request.cropType,
            quantityOffered: offer.quantityOffered,
            priceOffered: offer.pricePerKg,
            rejectionReason: rejectionReason
        });

        revalidatePath("/buyer/dashboard");
        revalidatePath("/farmer/dashboard");
        return { success: true };

    } catch (error) {
        console.error("Error rejecting offer:", error);
        return { error: "Failed to reject offer" };
    }
}
