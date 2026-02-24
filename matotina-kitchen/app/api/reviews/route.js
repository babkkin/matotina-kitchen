import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  const { token, name, rating, comment } = await req.json();

  if (!token || !name || !rating || !comment) {
    return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return new Response(JSON.stringify({ message: "Rating must be between 1 and 5." }), { status: 400 });
  }

  // Find the quote by token
  const { data: quote, error: quoteError } = await supabaseAdmin
    .from("quotes")
    .select("id, review_token_used")
    .eq("review_token", token)
    .single();

  if (quoteError || !quote) {
    return new Response(JSON.stringify({ message: "Invalid or expired token." }), { status: 404 });
  }

  if (quote.review_token_used) {
    return new Response(JSON.stringify({ message: "This review link has already been used." }), { status: 410 });
  }

  // Save the review
  const { error: reviewError } = await supabaseAdmin
    .from("reviews")
    .insert([{ quote_id: quote.id, name, rating, comment }]);

  if (reviewError) {
    return new Response(JSON.stringify({ message: reviewError.message }), { status: 500 });
  }

  // Mark token as used
  await supabaseAdmin
    .from("quotes")
    .update({ review_token_used: true })
    .eq("id", quote.id);

  return new Response(JSON.stringify({ message: "Review submitted successfully." }), { status: 201 });
}

// GET /api/reviews — fetch all reviews
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

// PUT /api/reviews — admin saves a reply to a review
export async function PUT(req) {
  const { id, reply } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ message: "Review ID is required." }), { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .update({ reply: reply || null })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}