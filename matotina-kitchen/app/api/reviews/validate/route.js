import { supabaseAdmin } from "@/lib/supabase";

// GET /api/reviews/validate?token=xxx
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ message: "Token is required." }), { status: 400 });
  }

  // Find the quote with this token
  const { data, error } = await supabaseAdmin
    .from("quotes")
    .select("id, name, email, review_token_used")
    .eq("review_token", token)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ message: "Invalid or expired token." }), { status: 404 });
  }

  // Token already used
  if (data.review_token_used) {
    return new Response(JSON.stringify({ message: "This review link has already been used." }), { status: 410 });
  }

  return new Response(JSON.stringify({ id: data.id, name: data.name, email: data.email }), { status: 200 });
}