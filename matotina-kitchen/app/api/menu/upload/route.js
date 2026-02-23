import { supabaseAdmin as supabase } from "@/lib/supabase";

// POST /api/menu/upload
// Accepts: multipart/form-data with a field named "file"
// Returns: { url } — the public URL of the uploaded image

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return new Response(JSON.stringify({ message: "No file provided." }), { status: 400 });
  }

  // Only allow images
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return new Response(JSON.stringify({ message: "Only JPEG, PNG, WEBP, and GIF are allowed." }), { status: 400 });
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return new Response(JSON.stringify({ message: "File must be under 5MB." }), { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  const { data: publicData } = supabase.storage
    .from("menu-images")
    .getPublicUrl(filename);

  return new Response(JSON.stringify({ url: publicData.publicUrl }), { status: 200 });
}