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

    // Validation: Positive values
    if (finalQuantity <= 0) return { error: "Quantity must be greater than zero" };
    if (finalPrice <= 0) return { error: "Price must be greater than zero" };

    try {
        // 1. Fetch Offer to verify ownership match (optional additional security)
        const offer = await prisma.farmerResponse.findUnique({
            where: { id: offerId },
            include: { farmer: true, request: { include: { buyer: true } } }
        });

        if (!offer) return { error: "Offer not found" };
        if (offer.request.buyerId !== session.user.id) return { error: "Unauthorized" };

        // Validation: Cannot accept more than remaining quantity
        if (finalQuantity > offer.request.quantityRemaining) {
            return {
                error: `Cannot accept ${finalQuantity} kg. Only ${offer.request.quantityRemaining} kg remaining in this request.`
            };
        }

        // Validation: Cannot accept more than offered quantity
        if (finalQuantity > offer.quantityOffered) {
            return {
                error: `Cannot accept ${finalQuantity} kg. Farmer only offered ${offer.quantityOffered} kg.`
            };
        }

        // 2. Update Request Quantity (Smart Logic)
        const newQuantityRemaining = offer.request.quantityRemaining - finalQuantity;
        const shouldComplete = newQuantityRemaining <= 0;

        await prisma.purchaseRequest.update({
            where: { id: offer.requestId },
            data: {
                quantityRemaining: Math.max(0, newQuantityRemaining),
                status: shouldComplete ? 'COMPLETED' : offer.request.status
            }
        });

        // 3. Create Transaction
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

        // 4. Update Offer Status
        await prisma.farmerResponse.update({
            where: { id: offerId },
            data: { status: "ACCEPTED" }
        });

        // 5. Send Email
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
        revalidatePath("/farmer/dashboard");
        return { success: true };

    } catch (error) {
        console.error("Error accepting offer:", error);
        return { error: "Failed to accept offer" };
    }
}

export async function markDeliveryComplete(transactionId: string) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    try {
        // Fetch full transaction details for email
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                buyer: { select: { name: true, email: true } },
                farmer: { select: { name: true, email: true } },
                request: { select: { cropType: true } }
            }
        });

        if (!transaction) return { error: "Transaction not found" };
        if (transaction.buyerId !== session.user.id) return { error: "Unauthorized" };
        if (transaction.status === 'COMPLETED') return { error: "Already completed" };

        // Update transaction status to COMPLETED
        await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: 'COMPLETED' }
        });

        // Send delivery confirmation emails to both parties
        const { sendDeliveryConfirmationEmail } = await import("@/lib/mail");
        await sendDeliveryConfirmationEmail({
            farmerEmail: transaction.farmer.email!,
            farmerName: transaction.farmer.name!,
            buyerName: transaction.buyer.name!,
            buyerEmail: transaction.buyer.email!,
            cropType: transaction.request.cropType,
            quantity: transaction.quantitySold,
            price: transaction.totalAmount / transaction.quantitySold,
            totalAmount: transaction.totalAmount
        });

        revalidatePath("/buyer/deals");
        revalidatePath("/farmer/deals");
        return { success: true, message: "Delivery confirmed! Both parties have been notified via email." };

    } catch (error) {
        console.error("Error marking delivery complete:", error);
        return { error: "Failed to update status" };
    }
}
