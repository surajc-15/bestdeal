'use server'

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendOfferAcceptedEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export async function acceptOffer(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const offerId = formData.get("offerId") as string;
    const instructions = formData.get("instructions") as string;
    const finalQuantity = parseFloat(formData.get("finalQuantity") as string);
    const finalPrice = parseFloat(formData.get("finalPrice") as string);

    if (!offerId || !instructions || !finalQuantity || !finalPrice) return { error: "Missing required fields" };

    try {
        // 1. Fetch Offer to verify ownership match (optional additional security)
        const offer = await prisma.farmerResponse.findUnique({
            where: { id: offerId },
            include: { farmer: true, request: { include: { buyer: true } } }
        });

        if (!offer) return { error: "Offer not found" };
        if (offer.request.buyerId !== session.user.id) return { error: "Unauthorized" };

        // 2. Create Transaction
        await prisma.transaction.create({
            data: {
                buyerId: session.user.id,
                farmerId: offer.farmerId,
                requestId: offer.requestId,
                quantitySold: finalQuantity,
                totalAmount: finalQuantity * finalPrice,
                status: "PENDING"
            }
        });

        // 3. Update Offer Status
        await prisma.farmerResponse.update({
            where: { id: offerId },
            data: { status: "ACCEPTED" }
        });

        // 4. Send Email
        await sendOfferAcceptedEmail({
            farmerEmail: offer.farmer.email!,
            farmerName: offer.farmer.name!,
            buyerName: offer.request.buyer.name!,
            buyerEmail: offer.request.buyer.email!,
            buyerPhone: offer.request.buyer.phone || "N/A",
            cropType: offer.request.cropType,
            quantity: finalQuantity,
            price: finalPrice,
            instructions: instructions
        });

        revalidatePath("/buyer/dashboard");
        return { success: true };

    } catch (error) {
        console.error("Error accepting offer:", error);
        return { error: "Failed to accept offer" };
    }
}
