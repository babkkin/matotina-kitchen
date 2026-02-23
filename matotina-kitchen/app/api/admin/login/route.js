import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { username, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  });

  if (error || !data.session) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
  }

  return new Response(
    JSON.stringify({ message: "Login successful" }),
    {
      status: 200,
      headers: {
        "Set-Cookie": `sb-access-token=${data.session.access_token}; Path=/; Max-Age=${60 * 60 * 8}; HttpOnly; SameSite=Lax`,
      },
    }
  );
}