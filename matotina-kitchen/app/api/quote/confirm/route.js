import nodemailer from "nodemailer";
import { supabaseAdmin as supabase } from "@/lib/supabase";

// POST /api/quote/confirm
// Accepts: JSON body with quote_id, pricing, terms, next steps
// Saves to quote_confirmations, updates quote status to "confirmed", sends email

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function buildEmailHtml({ quote, confirmation }) {
  const fmt = (val) => val ?? "—";
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) : "—";
  const fmtMoney = (n) =>
    n != null ? `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}` : "—";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Catering Quote – Matotina's Kitchen</title>
</head>
<body style="margin:0;padding:0;background:#f9f6f1;font-family:Georgia,serif;color:#3a2e1e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f1;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#7c3f00;padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;font-weight:normal;letter-spacing:1px;">Matotina's Kitchen</h1>
              <p style="margin:6px 0 0;color:#f5d9a8;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Catering Quote Confirmation</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:36px 40px 0;">
              <p style="margin:0;font-size:16px;line-height:1.7;">Dear <strong>${fmt(quote.name)}</strong>,</p>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:#5a4a3a;">
                Thank you for choosing Matotina's Kitchen! We're excited to be part of your event.
                Below is your confirmed catering quote — please review everything carefully.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:24px 40px 0;"><hr style="border:none;border-top:1px solid #e8ddd0;" /></td></tr>

          <!-- Client Details -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7c3f00;">Client Details</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;width:140px;">Name</td><td style="padding:4px 0;font-size:14px;font-weight:bold;">${fmt(quote.name)}</td></tr>
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;">Email</td><td style="padding:4px 0;font-size:14px;">${fmt(quote.email)}</td></tr>
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;">Phone</td><td style="padding:4px 0;font-size:14px;">${fmt(quote.phone)}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Event Summary -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7c3f00;">Event Summary</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;width:140px;">Event Type</td><td style="padding:4px 0;font-size:14px;">${fmt(quote.event_type)}</td></tr>
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;">Date & Time</td><td style="padding:4px 0;font-size:14px;">${fmtDate(quote.event_date)}${quote.event_time ? " at " + quote.event_time : ""}</td></tr>
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;">Venue</td><td style="padding:4px 0;font-size:14px;">${fmt(quote.venue)}</td></tr>
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;">Guests</td><td style="padding:4px 0;font-size:14px;">${fmt(quote.guests)}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Service Summary -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7c3f00;">Service Summary</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;width:140px;">Service Type</td><td style="padding:4px 0;font-size:14px;">${fmt(quote.service_type)}</td></tr>
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;vertical-align:top;">Menu / Food Items</td><td style="padding:4px 0;font-size:14px;">${fmt(quote.menu_preferences)}</td></tr>
                <tr><td style="padding:4px 0;font-size:14px;color:#5a4a3a;vertical-align:top;">Dietary Notes</td><td style="padding:4px 0;font-size:14px;">${fmt(quote.dietary_notes)}</td></tr>
              </table>
            </td>
          </tr>

          <!-- The Quote -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7c3f00;">Your Quote</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6ec;border-radius:8px;padding:16px;" bgcolor="#fdf6ec">
                <tr><td style="padding:6px 16px;font-size:14px;color:#5a4a3a;width:200px;">Total Price</td><td style="padding:6px 16px;font-size:14px;font-weight:bold;color:#3a2e1e;">${fmtMoney(confirmation.total_price)}</td></tr>
                ${confirmation.price_breakdown ? `<tr><td style="padding:6px 16px;font-size:14px;color:#5a4a3a;vertical-align:top;">Breakdown</td><td style="padding:6px 16px;font-size:13px;color:#5a4a3a;white-space:pre-line;">${confirmation.price_breakdown}</td></tr>` : ""}
                <tr><td colspan="2"><hr style="border:none;border-top:1px solid #e8ddd0;margin:8px 0;" /></td></tr>
                <tr><td style="padding:6px 16px;font-size:14px;color:#5a4a3a;">Deposit Required</td><td style="padding:6px 16px;font-size:14px;font-weight:bold;">${fmtMoney(confirmation.deposit_amount)}</td></tr>
                <tr><td style="padding:6px 16px;font-size:14px;color:#5a4a3a;">Deposit Due</td><td style="padding:6px 16px;font-size:14px;">${fmtDate(confirmation.deposit_due_date)}</td></tr>
                <tr><td colspan="2"><hr style="border:none;border-top:1px solid #e8ddd0;margin:8px 0;" /></td></tr>
                <tr><td style="padding:6px 16px;font-size:14px;color:#5a4a3a;">Balance Due</td><td style="padding:6px 16px;font-size:14px;font-weight:bold;">${fmtMoney(confirmation.balance_amount)}</td></tr>
                <tr><td style="padding:6px 16px;font-size:14px;color:#5a4a3a;">Balance Due Date</td><td style="padding:6px 16px;font-size:14px;">${fmtDate(confirmation.balance_due_date)}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Terms -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7c3f00;">Terms & Conditions</h2>
              ${confirmation.whats_included ? `
              <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#3a2e1e;">What's Included</p>
              <p style="margin:0 0 16px;font-size:14px;color:#5a4a3a;line-height:1.7;white-space:pre-line;">${confirmation.whats_included}</p>` : ""}
              ${confirmation.whats_not_included ? `
              <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#3a2e1e;">What's Not Included</p>
              <p style="margin:0 0 16px;font-size:14px;color:#5a4a3a;line-height:1.7;white-space:pre-line;">${confirmation.whats_not_included}</p>` : ""}
              ${confirmation.cancellation_policy ? `
              <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#3a2e1e;">Cancellation Policy</p>
              <p style="margin:0 0 0;font-size:14px;color:#5a4a3a;line-height:1.7;white-space:pre-line;">${confirmation.cancellation_policy}</p>` : ""}
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7c3f00;">Next Steps</h2>
              ${confirmation.deposit_instructions ? `
              <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#3a2e1e;">Deposit Payment Instructions</p>
              <p style="margin:0 0 16px;font-size:14px;color:#5a4a3a;line-height:1.7;white-space:pre-line;">${confirmation.deposit_instructions}</p>` : ""}
              ${confirmation.contact_info ? `
              <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#3a2e1e;">Questions? Contact Us</p>
              <p style="margin:0;font-size:14px;color:#5a4a3a;line-height:1.7;white-space:pre-line;">${confirmation.contact_info}</p>` : ""}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:36px 40px;text-align:center;margin-top:24px;">
              <hr style="border:none;border-top:1px solid #e8ddd0;margin-bottom:24px;" />
              <p style="margin:0;font-size:13px;color:#9a8a7a;">Matotina's Kitchen · Km. 30 National Road, Tunasan, Muntinlupa City</p>
              <p style="margin:6px 0 0;font-size:13px;color:#9a8a7a;">matotina1393@gmail.com</p>
              <p style="margin:16px 0 0;font-size:12px;color:#b8a898;font-style:italic;">We look forward to making your event unforgettable.</p>
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

export async function POST(req) {
  const body = await req.json();

  const {
    quote_id,
    total_price,
    price_breakdown,
    deposit_amount,
    deposit_due_date,
    balance_amount,
    balance_due_date,
    cancellation_policy,
    whats_included,
    whats_not_included,
    deposit_instructions,
    contact_info,
  } = body;

  if (!quote_id || !total_price) {
    return new Response(
      JSON.stringify({ message: "quote_id and total_price are required." }),
      { status: 400 }
    );
  }

  // Fetch the quote for client + event details
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quote_id)
    .single();

  if (quoteError || !quote) {
    return new Response(
      JSON.stringify({ message: "Quote not found." }),
      { status: 404 }
    );
  }

  // Coerce empty strings to null so Postgres numeric columns don't get ""
  const toNum = (v) => (v === "" || v == null ? null : Number(v));
  const toStr = (v) => (v === "" || v == null ? null : v);

  const confirmation = {
    total_price:         toNum(total_price),
    price_breakdown:     toStr(price_breakdown),
    deposit_amount:      toNum(deposit_amount),
    deposit_due_date:    toStr(deposit_due_date),
    balance_amount:      toNum(balance_amount),
    balance_due_date:    toStr(balance_due_date),
    cancellation_policy: toStr(cancellation_policy),
    whats_included:      toStr(whats_included),
    whats_not_included:  toStr(whats_not_included),
    deposit_instructions: toStr(deposit_instructions),
    contact_info:        toStr(contact_info),
  };

  // Save to quote_confirmations
  const { error: insertError } = await supabase
    .from("quote_confirmations")
    .insert([{ quote_id, ...confirmation }]);

  if (insertError) {
    return new Response(
      JSON.stringify({ message: insertError.message }),
      { status: 500 }
    );
  }

  // Update quote status to "confirmed"
  await supabase.from("quotes").update({ status: "confirmed" }).eq("id", quote_id);

  // Send email
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_FROM,
      to: quote.email,
      subject: `Your Catering Quote is Confirmed – Matotina's Kitchen`,
      html: buildEmailHtml({ quote, confirmation }),
    });
  } catch (emailError) {
    console.error("Email send error:", emailError);
    return new Response(
      JSON.stringify({ message: "Saved but failed to send email: " + emailError.message }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ message: "Confirmation saved and email sent!" }),
    { status: 200 }
  );
}

// Add this to the bottom of your existing confirm/route.js

// GET /api/quote/confirm?quote_id=...
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const quote_id = searchParams.get("quote_id");

  if (!quote_id) {
    return new Response(
      JSON.stringify({ message: "quote_id is required." }),
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("quote_confirmations")
    .select("*")
    .eq("quote_id", quote_id)
    .single();

  if (error || !data) {
    return new Response(
      JSON.stringify({ message: "Confirmation not found." }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify(data), { status: 200 });
}