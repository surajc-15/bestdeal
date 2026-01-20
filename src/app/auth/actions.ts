'use server'

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { sendWelcomeEmail } from "@/lib/mail"

export async function registerUser(prevState: any, formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as Role

    if (!name || !email || !password || !role) {
        return { error: "All fields are required" }
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters" }
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return { error: "User with this email already exists" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        },
        })

    // Send Welcome Email (Non-blocking)
    sendWelcomeEmail(email, name);

    return { success: "Account created successfully! Please sign in." }

} catch (error) {
    console.error("Registration error:", error)
    return { error: "Something went wrong. Please try again." }
}
}

export async function loginUser(prevState: any, formData: FormData) {
    try {
        await signIn("credentials", formData)
    } catch (error) {
        if ((error as Error).message.includes("CredentialsSignin")) {
            return { error: "Invalid credentials." }
        }
        throw error // NextJS redirects throw errors, so we must rethrow
    }
}
