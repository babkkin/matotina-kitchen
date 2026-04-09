import { supabaseAdmin as supabase } from "@/lib/supabase";

// POST /api/quote
// Accepts: JSON body with quote request fields
// Returns: { message } — success or error message

export async function POST(req) {
  const body = await req.json();

  const {
    // Contact
    fullName,
    email,
    phone,
    // Event
    eventType,
    eventDate,
    eventTime,
    eventDuration,
    venue,
    venueType,
    guests,
    // Service
    serviceType,
    cuisineStyle,
    staffing,
    menuPreferences,
    dietaryRestrictions,
    // Optional
    budgetRange,
    isReturningClient,
    competingQuotes,
    referral,
    // AI
    aiMenu,
  } = body;

  // Validate required fields
  if (
    !fullName ||
    !email ||
    !phone ||
    !eventType ||
    !eventDate ||
    !eventDuration ||
    !venue ||
    !venueType ||
    !guests ||
    !serviceType ||
    !cuisineStyle ||
    !staffing
  ) {
    return new Response(
      JSON.stringify({ message: "Please fill in all required fields." }),
      { status: 400 }
    );
  }

  const { error } = await supabase.from("quotes").insert([
    {
      // Contact
      name:               fullName,
      email,
      phone,
      // Event
      event_type:         eventType,
      event_date:         eventDate,
      event_time:         eventTime         || null,
      event_duration:     eventDuration,
      venue,
      venue_type:         venueType,
      guests:             parseInt(guests, 10),
      // Service
      service_type:       serviceType,
      cuisine_style:      cuisineStyle,
      staffing,
      menu_preferences:   menuPreferences   || null,
      dietary_notes:      dietaryRestrictions || null,
      // Optional
      budget_range:       budgetRange       || null,
      is_returning_client: isReturningClient || null,
      competing_quotes:   competingQuotes   || null,
      referral:           referral          || null,
      // AI
      ai_menu:            aiMenu            || null,
      // Meta
      status:             "new",
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