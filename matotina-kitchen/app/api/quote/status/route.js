import { supabaseAdmin as supabase } from "@/lib/supabase";

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

  return new Response(
    JSON.stringify({ message: "Status updated." }),
    { status: 200 }
  );
}