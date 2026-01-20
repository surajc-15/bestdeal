import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const mailOptions = {
            from: '"BestDeal Marketplace" <' + process.env.EMAIL_USER + '>',
            to: email,
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
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.error("Error sending welcome email:", error);
        // Don't block registration if email fails
        return { success: false, error };
    }
};
