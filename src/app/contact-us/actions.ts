'use server'

import { sendContactFormEmail } from "@/lib/mail";

export async function submitContactForm(prevState: any, formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!firstName || !lastName || !email || !message) {
        return { error: "All fields are required" };
    }

    try {
        await sendContactFormEmail({ firstName, lastName, email, message });
        return { success: "Message sent successfully! We'll get back to you soon." };
    } catch (error) {
        console.error("Contact form error:", error);
        return { error: "Failed to send message. Please try again." };
    }
}
