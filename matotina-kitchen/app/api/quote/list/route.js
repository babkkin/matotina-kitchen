import { supabaseAdmin as supabase } from "@/lib/supabase";

// GET /api/quote/list
// Returns all quotes ordered by created_at desc

export async function GET() {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify(data), { status: 200 });
}