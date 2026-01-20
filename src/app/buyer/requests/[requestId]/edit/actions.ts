'use server'

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateRequest(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const requestId = formData.get("requestId") as string;
    const cropType = formData.get("cropType") as string;
    const quantityRequired = parseFloat(formData.get("quantityRequired") as string);
    const pricePerKg = parseFloat(formData.get("pricePerKg") as string);
    const location = formData.get("location") as string;
    const deliveryType = formData.get("deliveryType") as any;
    const instructions = formData.get("instructions") as string;
    const status = formData.get("status") as any;

    if (!requestId || !cropType || !quantityRequired || !pricePerKg || !location) {
        return { error: "Missing required fields" };
    }

    try {
        // Verify ownership
        const existing = await prisma.purchaseRequest.findUnique({
            where: { id: requestId, buyerId: session.user.id }
        });

        if (!existing) return { error: "Request not found or access denied" };

        await prisma.purchaseRequest.update({
            where: { id: requestId },
            data: {
                cropType,
                quantityRequired,
                pricePerKg,
                location,
                deliveryType,
                instructions,
                status
            }
        });

        revalidatePath("/buyer/dashboard");

    } catch (error) {
        console.error("Error updating request:", error);
        return { error: "Failed to update request" };
    }

    redirect("/buyer/dashboard");
}
