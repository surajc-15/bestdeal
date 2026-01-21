'use server'

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { sendWelcomeEmail } from "@/lib/mail"
import { redirect } from "next/navigation"

export async function registerUser(prevState: any, formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as Role
    const phone = formData.get("phone") as string
    const location = formData.get("location") as string

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
                phone,
                location,
            },
        })

        // Send Welcome Email (Non-blocking)
        sendWelcomeEmail(email, name);

    } catch (error) {
        console.error("Registration error:", error)
        return { error: "Something went wrong. Please try again." }
    }

    // Redirect outside of try/catch to avoid catching NEXT_REDIRECT error
    redirect("/auth/sign-in");
}

export async function loginUser(prevState: any, formData: FormData) {
    try {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return { error: "Invalid credentials." }
            }
            return { error: "Unable to sign in right now." }
        }

        return { error: "Unexpected error. Please try again." }
    }

    // Redirect to dashboard on success (Role based redirection happens in middleware or callback usually, 
    // but here we can just redirect to home or a logic page. 
    // Ideally NextAuth's signIn handles the redirect by default unless redirect: false is used. 
    // If we want custom redirection logic, we can do it here or let NextAuth handle it.)
    // Since we are using server actions, signIn throws an error to redirect.
}
