'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DeliveryType, Role } from "@prisma/client"
import { redirect } from "next/navigation"

export async function createPurchaseRequest(prevState: any, formData: FormData) {
    const session = await auth();

    if (!session?.user || session.user.role !== Role.BUYER) {
        return { error: "Unauthorized" }
    }

    const cropType = formData.get("cropType") as string
    const quantityRequired = parseFloat(formData.get("quantityRequired") as string)
    const pricePerKg = parseFloat(formData.get("pricePerKg") as string)
    const location = formData.get("location") as string
    const deliveryType = formData.get("deliveryType") as DeliveryType
    const instructions = formData.get("instructions") as string

    if (!cropType || isNaN(quantityRequired) || isNaN(pricePerKg) || !location || !deliveryType) {
        return { error: "Please fill in all required fields correctly." }
    }

    try {
        await prisma.purchaseRequest.create({
            data: {
                buyerId: session.user.id,
                cropType,
                quantityRequired,
                quantityRemaining: quantityRequired, // Initially same as required
                pricePerKg,
                location,
                deliveryType,
                instructions,
                status: 'ACTIVE',
            }
        })
    } catch (error) {
        console.error("Error creating request:", error)
        return { error: "Failed to create request. Please try again." }
    }

    redirect("/buyer/dashboard");
}
