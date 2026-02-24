import { supabaseAdmin as supabase } from "@/lib/supabase";

// POST /api/quote
// Accepts: JSON body with quote request fields
// Returns: { message } — success or error message

export async function POST(req) {
  const body = await req.json();

  const {
    fullName,
    email,
    phone,
    eventType,
    eventDate,
    eventTime,
    venue,
    guests,
    serviceType,
    menuPreferences,
    dietaryRestrictions,
    budgetRange,
  } = body;

  // Validate required fields
  if (!fullName || !email || !phone || !eventType || !eventDate || !guests || !serviceType) {
    return new Response(
      JSON.stringify({ message: "Please fill in all required fields." }),
      { status: 400 }
    );
  }

  const { error } = await supabase.from("quotes").insert([
    {
      name: fullName,
      email,
      phone,
      event_type: eventType,
      event_date: eventDate,
      event_time: eventTime || null,
      venue: venue || null,
      guests: parseInt(guests),
      service_type: serviceType,
      menu_preferences: menuPreferences || null,
      dietary_notes: dietaryRestrictions || null,
      budget_range: budgetRange || null,
      status: "new",
    },
  ]);

  if (error) {
    console.error("Supabase insert error:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ message: "Quote request submitted successfully!" }),
    { status: 200 }
  );
}