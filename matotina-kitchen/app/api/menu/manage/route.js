import { supabaseAdmin } from "@/lib/supabase";

function extractFilename(url) {
  if (!url) return null;
  try {
    const parts = new URL(url).pathname.split("/");
    return parts[parts.length - 1];
  } catch {
    return null;
  }
}

export async function POST(req) {
  const body = await req.json();
  const { title, category, description, image_url } = body;

  if (!title || !category) {
    return new Response(JSON.stringify({ message: "Title and category are required." }), { status: 400 });
  }

  const { data, error } = await supabaseAdmin
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

  // Fetch the existing item to check if the image changed
  const { data: existing } = await supabaseAdmin
    .from("menu_items")
    .select("image_url")
    .eq("id", id)
    .single();

  // If image was replaced, delete the old one from storage
  if (existing?.image_url && existing.image_url !== image_url) {
    const filename = extractFilename(existing.image_url);
    if (filename) {
      await supabaseAdmin.storage.from("menu-images").remove([filename]);
    }
  }

  const { data, error } = await supabaseAdmin
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

  // Fetch the item first to get its image_url before deleting
  const { data: existing } = await supabaseAdmin
    .from("menu_items")
    .select("image_url")
    .eq("id", id)
    .single();

  // Delete the database record
  const { error } = await supabaseAdmin
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  // Delete the image from storage after the record is gone
  if (existing?.image_url) {
    const filename = extractFilename(existing.image_url);
    if (filename) {
      await supabaseAdmin.storage.from("menu-images").remove([filename]);
    }
  }

  return new Response(JSON.stringify({ message: "Deleted successfully." }), { status: 200 });
}