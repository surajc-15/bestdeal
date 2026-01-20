'use server'

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendOfferMadeEmail, sendOfferReceivedEmail } from "@/lib/mail";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitOffer(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const requestId = formData.get("requestId") as string;
    const pricePerKg = parseFloat(formData.get("pricePerKg") as string);
    const quantity = parseFloat(formData.get("quantity") as string);
    const message = formData.get("message") as string;

    if (!requestId || !pricePerKg || !quantity) {
        return { error: "Missing required fields" };
    }

    try {
        // 1. Fetch Request & Buyer Details
        const request = await prisma.purchaseRequest.findUnique({
            where: { id: requestId },
            include: { buyer: true }
        });

        if (!request) return { error: "Request not found" };

        // 2. Fetch Farmer Details (User who is logged in)
        const farmer = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!farmer) return { error: "Farmer profile not found" };

        // 3. Create Offer in DB
        // Note: You need to ensure FarmerResponse model allows these fields. 
        // Based on previous schema assumption, we might need to adjust if schema differs.
        const offer = await prisma.farmerResponse.create({
            data: {
                requestId: requestId,
                farmerId: farmer.id,
                pricePerKg: pricePerKg,
                quantityOffered: quantity,
                status: "CONNECTED",
                message: message
            }
        });

        // 4. Send Emails
        const emailData = {
            buyerName: request.buyer.name || "Buyer",
            buyerEmail: request.buyer.email!,
            farmerName: farmer.name || "Farmer",
            farmerEmail: farmer.email!,
            farmerPhone: farmer.phone || "N/A",
            cropType: request.cropType,
            quantityOffered: quantity,
            priceOffered: pricePerKg,
            message: message
        };

        // Send concurrently
        await Promise.all([
            sendOfferMadeEmail(emailData),
            sendOfferReceivedEmail(emailData)
        ]);

    } catch (error) {
        console.error("Error submitting offer:", error);
        return { error: "Failed to submit offer. Please try again." };
    }

    return { success: true };
}
