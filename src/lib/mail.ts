import { Resend } from 'resend';

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Domain Configuration
const DOMAIN = 'surajc.in';
const ADMIN_EMAIL = process.env.EMAIL_USER; // Read reply-to/admin address from env

// Sender Identities
const Senders = {
    ONBOARDING: `BestDeal Welcome <onboarding@${DOMAIN}>`,
    SUPPORT: `BestDeal Support <support@${DOMAIN}>`,
    NO_REPLY: `BestDeal Notifications <no-reply@${DOMAIN}>`,
};

/**
 * Sends a welcome email to new users.
 * Uses: onboarding@surajc.com
 * Reply-To: Admin Email (from .env)
 */
export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const data = await resend.emails.send({
            from: Senders.ONBOARDING,
            to: [email],
            reply_to: ADMIN_EMAIL, // User replies go to support/admin
            subject: 'Welcome to BestDeal! 🌾',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Welcome to BestDeal, ${name}!</h1>
          <p>Thank you for joining India's #1 Direct Agricultural Marketplace.</p>
          <p>We are thrilled to have you on board. Whether you are a farmer looking for the best prices or a buyer seeking quality produce, we are here to support you.</p>
          <br/>
          <p><strong>Your journey to fair trade starts here.</strong></p>
          <br/>
          <a href="http://localhost:3000/auth/sign-in" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to your Dashboard</a>
          <br/><br/>
          <p style="color: #666; font-size: 12px;">Best Regards,<br/>Team BestDeal</p>
        </div>
      `,
        });

        if (data.error) {
            console.error("Resend Welcome Email Error:", data.error);
            return { success: false, error: data.error };
        }

        console.log("Welcome email sent ID:", data.data?.id);
        return { success: true, data };
    } catch (error) {
        console.error("Unexpected error sending welcome email:", error);
        return { success: false, error };
    }
};

interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}

/**
 * Sends a contact form submission to the admin using the Support identity.
 * Uses: support@surajc.com
 * Reply-To: The user who submitted the form (so admin can reply to them)
 */
export const sendContactFormEmail = async (data: ContactFormData) => {
    try {
        // Sends TO the admin (EMAIL_USER), FROM support@surajc.com
        const result = await resend.emails.send({
            from: Senders.SUPPORT,
            to: ADMIN_EMAIL || 'delivered@resend.dev', // Send to admin
            reply_to: data.email, // Admin replies go to the user
            subject: `New Contact Request from ${data.firstName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
            <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">New Contact Message</h2>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; color: #374151;">${data.message}</p>
            </div>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">Sent via BestDeal Contact Form</p>
        </div>
      `,
        });

        if (result.error) {
            console.error("Resend Contact Email Error:", result.error);
            return { success: false, error: result.error };
        }

        console.log("Contact email sent ID:", result.data?.id);
        return { success: true };
    } catch (error) {
        console.error("Unexpected error sending contact email:", error);
        throw error;
    }
};
