import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req) {
  const body = await req.json();
  const { title, category, description, image_url } = body;

  if (!title || !category) {
    return new Response(JSON.stringify({ message: "Title and category are required." }), { status: 400 });
  }

  const { data, error } = await supabase
    .from("menu_items")
    .insert([{ title, category, description, image_url }])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
}

export async function PUT(req) {
  const body = await req.json();
  const { id, title, category, description, image_url } = body;

  if (!id) {
    return new Response(JSON.stringify({ message: "Item ID is required." }), { status: 400 });
  }

  const { data, error } = await supabase
    .from("menu_items")
    .update({ title, category, description, image_url })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function DELETE(req) {
  const { id } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ message: "Item ID is required." }), { status: 400 });
  }

  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Deleted successfully." }), { status: 200 });
}