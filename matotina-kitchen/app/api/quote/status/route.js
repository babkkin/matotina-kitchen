import { supabaseAdmin as supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function buildThankYouEmail({ quote, token }) {
  const reviewLink = `https://matotina-kitchen.vercel.app/review?token=${token}`;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thank You – Matotina's Kitchen</title>
</head>
<body style="margin:0;padding:0;background:#f9f6f1;font-family:Georgia,serif;color:#3a2e1e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f1;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#7c3f00;padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;font-weight:normal;letter-spacing:1px;">Matotina's Kitchen</h1>
              <p style="margin:6px 0 0;color:#f5d9a8;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Thank You for Choosing Us</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px 0;">
              <p style="margin:0;font-size:16px;line-height:1.7;">Dear <strong>${quote.name}</strong>,</p>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:#5a4a3a;">
                It was truly a pleasure catering your <strong>${quote.event_type}</strong>.
                We hope everything was to your satisfaction and that your guests enjoyed every bite!
              </p>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:#5a4a3a;">
                We'd love to hear your feedback. It only takes a minute and means the world to us.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <a href="${reviewLink}"
                style="display:inline-block;padding:16px 40px;background:#7c3f00;color:#ffffff;text-decoration:none;font-size:15px;font-family:Georgia,serif;border-radius:6px;letter-spacing:0.5px;">
                ⭐ Leave a Review
              </a>
              <p style="margin:16px 0 0;font-size:12px;color:#9a8a7a;">
                Or copy this link: <a href="${reviewLink}" style="color:#7c3f00;word-break:break-all;">${reviewLink}</a>
              </p>
            </td>
          </tr>
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e8ddd0;" /></td></tr>
          <tr>
            <td style="padding:28px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#9a8a7a;">Matotina's Kitchen · Km. 30 National Road, Tunasan, Muntinlupa City</p>
              <p style="margin:6px 0 0;font-size:13px;color:#9a8a7a;">info@matotinaskitchen.com</p>
              <p style="margin:16px 0 0;font-size:12px;color:#b8a898;font-style:italic;">We look forward to serving you again.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// PATCH /api/quote/status
// Accepts: { id, status }
// Updates the status of a quote

export async function PATCH(req) {
  const { id, status } = await req.json();

  if (!id || !status) {
    return new Response(
      JSON.stringify({ message: "id and status are required." }),
      { status: 400 }
    );
  }

  const validStatuses = ["new", "contacted", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return new Response(
      JSON.stringify({ message: "Invalid status value." }),
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", id);

  if (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }

  // If marked as completed, send thank-you email with review token
  if (status === "completed") {
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (!quoteError && quote) {
      const token = crypto.randomBytes(32).toString("hex");

      await supabase
        .from("quotes")
        .update({ review_token: token, review_token_used: false })
        .eq("id", id);

      try {
        await transporter.sendMail({
          from: process.env.GMAIL_FROM,
          to: quote.email,
          subject: `Thank You from Matotina's Kitchen – We'd Love Your Feedback!`,
          html: buildThankYouEmail({ quote, token }),
        });
      } catch (emailError) {
        console.error("Thank-you email error:", emailError);
      }
    }
  }

  return new Response(
    JSON.stringify({ message: "Status updated." }),
    { status: 200 }
  );
}