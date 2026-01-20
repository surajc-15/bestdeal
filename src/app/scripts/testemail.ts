import { Resend } from "resend";

const resend = new Resend("re_JWLQHSzN_CDts2FZ8UGXdY4ks24G7WvLk");

async function sendTestEmail() {
  await resend.emails.send({
    from: "onboarding@surajc.in",          // sender (your domain)
    to: "7.maheshappa@gmail.com",                    // receiver (any email)
    subject: "Hello from BestDeal 🌾",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hello 👋</h2>
        <p>This is a test email sent using <strong>Resend</strong>.</p>
        <p>From: onboarding@surajc.com</p>
      </div>
    `,
  });

  console.log("Email sent successfully");
}

// call the function
sendTestEmail().catch(console.error);
