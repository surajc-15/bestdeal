import { Resend } from 'resend';

// Initialize Resend with API Key
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
            replyTo: ADMIN_EMAIL, // User replies go to support/admin
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

interface DeliveryConfirmationData {
    farmerEmail: string;
    farmerName: string;
    buyerName: string;
    buyerEmail: string;
    cropType: string;
    quantity: number;
    price: number;
    totalAmount: number;
}

/**
 * Sends delivery confirmation email to both farmer and buyer
 * Confirms successful delivery and transaction completion
 */
export const sendDeliveryConfirmationEmail = async (data: DeliveryConfirmationData) => {
    try {
        // Email to Farmer
        const farmerEmail = await resend.emails.send({
            from: Senders.NO_REPLY,
            to: [data.farmerEmail],
            replyTo: data.buyerEmail,
            subject: `🎉 Delivery Confirmed - ${data.cropType} Transaction Complete!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #10b981; padding: 30px; border-radius: 12px; background: linear-gradient(to bottom, #f0fdf4, #ffffff);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; font-size: 32px; margin: 0;">🎉 Congratulations!</h1>
                <p style="color: #059669; font-size: 18px; margin-top: 10px;">Delivery Successfully Completed</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px solid #10b981; margin-bottom: 20px;">
                <h2 style="color: #047857; margin-top: 0;">Transaction Summary</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Product:</td>
                        <td style="padding: 10px 0; color: #111827; font-weight: bold; text-align: right;">${data.cropType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Quantity Delivered:</td>
                        <td style="padding: 10px 0; color: #111827; font-weight: bold; text-align: right;">${data.quantity.toLocaleString()} kg</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Price per kg:</td>
                        <td style="padding: 10px 0; color: #111827; font-weight: bold; text-align: right;">₹${data.price.toLocaleString()}</td>
                    </tr>
                    <tr style="border-top: 2px solid #10b981;">
                        <td style="padding: 15px 0; color: #047857; font-weight: bold; font-size: 18px;">Total Amount:</td>
                        <td style="padding: 15px 0; color: #10b981; font-weight: bold; font-size: 20px; text-align: right;">₹${data.totalAmount.toLocaleString()}</td>
                    </tr>
                </table>
            </div>

            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
                <p style="margin: 0; color: #047857;"><strong>Buyer:</strong> ${data.buyerName}</p>
                <p style="margin: 5px 0 0 0; color: #047857;"><strong>Email:</strong> ${data.buyerEmail}</p>
            </div>

            <p style="color: #374151; line-height: 1.6;">
                The buyer has confirmed receipt of the delivery. This transaction is now complete. 
                Thank you for using BestDeal to connect with buyers directly!
            </p>

            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>💡 Next Steps:</strong> Payment processing will be handled as per your agreement with the buyer. 
                    For any issues, please contact the buyer directly or reach out to our support team.
                </p>
            </div>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px; text-align: center;">
                Best Regards,<br/>
                <strong>Team BestDeal</strong><br/>
                India's #1 Direct Agricultural Marketplace
            </p>
        </div>
      `,
        });

        // Email to Buyer
        const buyerEmail = await resend.emails.send({
            from: Senders.NO_REPLY,
            to: [data.buyerEmail],
            replyTo: data.farmerEmail,
            subject: `✅ Delivery Confirmed - ${data.cropType} Order Complete`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #10b981; padding: 30px; border-radius: 12px; background: linear-gradient(to bottom, #f0fdf4, #ffffff);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; font-size: 32px; margin: 0;">✅ Order Complete!</h1>
                <p style="color: #059669; font-size: 18px; margin-top: 10px;">Delivery Confirmation</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px solid #10b981; margin-bottom: 20px;">
                <h2 style="color: #047857; margin-top: 0;">Order Summary</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Product:</td>
                        <td style="padding: 10px 0; color: #111827; font-weight: bold; text-align: right;">${data.cropType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Quantity Received:</td>
                        <td style="padding: 10px 0; color: #111827; font-weight: bold; text-align: right;">${data.quantity.toLocaleString()} kg</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Price per kg:</td>
                        <td style="padding: 10px 0; color: #111827; font-weight: bold; text-align: right;">₹${data.price.toLocaleString()}</td>
                    </tr>
                    <tr style="border-top: 2px solid #10b981;">
                        <td style="padding: 15px 0; color: #047857; font-weight: bold; font-size: 18px;">Total Amount:</td>
                        <td style="padding: 15px 0; color: #10b981; font-weight: bold; font-size: 20px; text-align: right;">₹${data.totalAmount.toLocaleString()}</td>
                    </tr>
                </table>
            </div>

            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
                <p style="margin: 0; color: #047857;"><strong>Farmer:</strong> ${data.farmerName}</p>
                <p style="margin: 5px 0 0 0; color: #047857;"><strong>Email:</strong> ${data.farmerEmail}</p>
            </div>

            <p style="color: #374151; line-height: 1.6;">
                This email confirms that you have successfully received your order of <strong>${data.quantity.toLocaleString()} kg of ${data.cropType}</strong> 
                from ${data.farmerName}. The transaction is now complete.
            </p>

            <p style="color: #374151; line-height: 1.6;">
                Thank you for using BestDeal! We hope you're satisfied with your purchase.
            </p>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px; text-align: center;">
                Best Regards,<br/>
                <strong>Team BestDeal</strong><br/>
                India's #1 Direct Agricultural Marketplace
            </p>
        </div>
      `,
        });

        if (farmerEmail.error || buyerEmail.error) {
            console.error("Delivery confirmation email error:", farmerEmail.error || buyerEmail.error);
            return { success: false, error: farmerEmail.error || buyerEmail.error };
        }

        console.log("Delivery confirmation emails sent");
        return { success: true };
    } catch (error) {
        console.error("Unexpected error sending delivery confirmation:", error);
        return { success: false, error };
    }
};

interface OfferRejectedData {
    farmerEmail: string;
    farmerName: string;
    buyerName: string;
    cropType: string;
    quantityOffered: number;
    priceOffered: number;
    rejectionReason?: string;
}

/**
 * Sends offer rejection email to farmer
 * Notifies farmer their offer was not accepted
 */
export const sendOfferRejectedEmail = async (data: OfferRejectedData) => {
    try {
        await resend.emails.send({
            from: Senders.NO_REPLY,
            to: [data.farmerEmail],
            subject: `Offer Not Accepted - ${data.cropType}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f59e0b; padding: 30px; border-radius: 12px; background: linear-gradient(to bottom, #fffbeb, #ffffff);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #d97706; font-size: 28px; margin: 0;">Offer Not Accepted</h1>
                <p style="color: #92400e; font-size: 16px; margin-top: 10px;">Regarding ${data.cropType}</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
                Dear ${data.farmerName},
            </p>

            <p style="color: #374151; line-height: 1.6;">
                Thank you for your interest in supplying <strong>${data.cropType}</strong> to ${data.buyerName}. 
                Unfortunately, your offer has not been accepted at this time.
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px solid #fbbf24; margin: 20px 0;">
                <h3 style="color: #d97706; margin-top: 0;">Your Offer Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Quantity Offered:</td>
                        <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${data.quantityOffered.toLocaleString()} kg</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Price Offered:</td>
                        <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">₹${data.priceOffered.toLocaleString()}/kg</td>
                    </tr>
                </table>
            </div>

            ${data.rejectionReason ? `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>Note from Buyer:</strong><br/>
                    ${data.rejectionReason}
                </p>
            </div>
            ` : ''}

            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <strong>💡 What's Next?</strong><br/>
                    You can submit a new offer with adjusted terms if the request is still active. 
                    Check the dashboard for other available opportunities!
                </p>
            </div>

            <p style="color: #374151; line-height: 1.6;">
                We appreciate your participation in BestDeal and encourage you to continue exploring other opportunities.
            </p>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px; text-align: center;">
                Best Regards,<br/>
                <strong>Team BestDeal</strong><br/>
                India's #1 Direct Agricultural Marketplace
            </p>
        </div>
      `,
        });
        console.log("Offer rejected email sent to:", data.farmerEmail);
    } catch (error) {
        console.error("Failed to send offer rejected email:", error);
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
            replyTo: data.email, // Admin replies go to the user
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

/** ---------------- Offer Emails ---------------- */

interface OfferEmailData {
    buyerName: string;
    buyerEmail: string;
    farmerName: string;
    farmerEmail: string;
    farmerPhone: string;
    cropType: string;
    quantityOffered: number;
    priceOffered: number;
    message?: string;
}

/**
 * Email to the BUYER when they receive an offer.
 * Reply-To: Farmer's email
 */
export const sendOfferReceivedEmail = async (data: OfferEmailData) => {
    try {
        await resend.emails.send({
            from: Senders.NO_REPLY,
            to: data.buyerEmail,
            replyTo: data.farmerEmail,
            subject: `New Offer: ${data.cropType} from ${data.farmerName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #10b981; padding: 20px; text-align: center;">
                <h2 style="color: white; margin: 0;">New Offer Received! 🎉</h2>
            </div>
            <div style="padding: 20px;">
                <p>Hello <strong>${data.buyerName}</strong>,</p>
                <p>Great news! Farmer <strong>${data.farmerName}</strong> has made an offer for your request for <strong>${data.cropType}</strong>.</p>
                
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Quantity Offered:</strong> ${data.quantityOffered} kg</p>
                    <p style="margin: 5px 0;"><strong>Price Proposed:</strong> ₹${data.priceOffered}/kg</p>
                    ${data.message ? `<p style="margin: 5px 0; border-top: 1px solid #e5e7eb; padding-top: 5px;"><strong>Note:</strong> ${data.message}</p>` : ''}
                </div>

                <p><strong>Farmer Contact Details:</strong></p>
                <ul style="list-style: none; padding: 0;">
                    <li>📧 Email: <a href="mailto:${data.farmerEmail}">${data.farmerEmail}</a></li>
                    <li>📱 Phone: ${data.farmerPhone}</li>
                </ul>

                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    Review this offer in your dashboard to accept or negotiate.
                </p>
            </div>
        </div>
      `,
        });
        console.log(`Offer received email sent to ${data.buyerEmail}`);
    } catch (error) {
        console.error("Error sending offer-received email:", error);
    }
};

/**
 * Email to the FARMER confirming their offer.
 * Reply-To: Buyer's email
 */
export const sendOfferMadeEmail = async (data: OfferEmailData) => {
    try {
        await resend.emails.send({
            from: Senders.NO_REPLY,
            to: data.farmerEmail,
            replyTo: data.buyerEmail,
            subject: `Offer Sent: ${data.cropType} to ${data.buyerName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0f172a; padding: 20px; text-align: center;">
                <h2 style="color: white; margin: 0;">Offer Sent Successfully ✅</h2>
            </div>
            <div style="padding: 20px;">
                <p>Hello <strong>${data.farmerName}</strong>,</p>
                <p>Your offer has been sent to Buyer <strong>${data.buyerName}</strong> for <strong>${data.cropType}</strong>.</p>
                
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Quantity:</strong> ${data.quantityOffered} kg</p>
                    <p style="margin: 5px 0;"><strong>Price:</strong> ₹${data.priceOffered}/kg</p>
                </div>

                <p><strong>Buyer Contact Details:</strong></p>
                <p>You can contact them directly if needed:</p>
                <ul style="list-style: none; padding: 0;">
                    <li>📧 Email: <a href="mailto:${data.buyerEmail}">${data.buyerEmail}</a></li>
                </ul>

                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    We will notify you once the buyer responds to your offer.
                </p>
            </div>
        </div>
      `,
        });
        console.log(`Offer confirmation email sent to ${data.farmerEmail}`);
    } catch (error) {
        console.error("Error sending offer-made email:", error);
    }
};

export const sendOfferAcceptedEmail = async (data: {
    farmerEmail: string;
    farmerName: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    cropType: string;
    quantity: number;
    price: number;
    instructions: string;
}) => {
    try {
        await resend.emails.send({
            from: Senders.NO_REPLY, // Using NO_REPLY as transaction emails usually come from system
            to: [data.farmerEmail],
            replyTo: data.buyerEmail, // Farmer can reply directly to Buyer
            subject: `🎉 Offer Accepted! Sell your ${data.cropType}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #059669;">Great News, ${data.farmerName}!</h2>
                    <p><strong>${data.buyerName}</strong> has accepted your offer for <strong>${data.cropType}</strong>.</p>
                    
                    <div style="background-color: #f0fff4; padding: 20px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 20px 0;">
                        <h3 style="margin-top:0; color: #047857;">Deal Details</h3>
                        <p><strong>Quantity:</strong> ${data.quantity.toLocaleString()} kg</p>
                        <p><strong>Final Price:</strong> ₹${data.price}/kg</p>
                        <p><strong>Total Value:</strong> ₹${(data.quantity * data.price).toLocaleString()}</p>
                    </div>

                    <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border: 1px solid #fde68a; margin: 20px 0;">
                        <h3 style="margin-top:0; color: #d97706;">Instructions from Buyer</h3>
                        <p style="white-space: pre-wrap;">${data.instructions}</p>
                    </div>

                    <p>Please contact the buyer immediately to arrange the logistics:</p>
                    <p>
                        <strong>Phone:</strong> ${data.buyerPhone}<br>
                        <strong>Email:</strong> ${data.buyerEmail}
                    </p>

                    <p style="font-size: 14px; color: #666; margin-top: 30px;">
                        BestDeal Team<br>
                        We connect farmers directly to buyers.
                    </p>
                </div>
            `
        });
        console.log("Offer accepted email sent to:", data.farmerEmail);
    } catch (error) {
        console.error("Failed to send offer accepted email:", error);
    }
};
