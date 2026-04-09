// app/api/lil-tina/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin as supabase } from "@/lib/supabase";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create the model with a system instruction for consistent behavior
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `
You are Lil Tina, a professional catering consultant.
Output strictly as a menu recommendation according to the rules.
Do NOT add greetings, explanations, or commentary.
Only use dishes from the list provided in the prompt.
Respect dietary restrictions and event style.
End your response with a short warm note.
`
});

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      eventType = "",
      serviceType = "",
      cuisineStyle = "",
      guests = "",
      eventDuration = "",
      venueType = "",
      budgetRange = "",
      dietaryRestrictions = "",
      menuPreferences = "",
    } = body;

    // ── 1. Fetch all available menu items from Supabase ──────────────────────
    const { data: menuItems, error: dbError } = await supabase
      .from("menu_items")
      .select("title, category, description")
      .order("category")
      .order("title");

    if (dbError) {
      console.error("[lil-tina] Supabase error:", dbError);
      return Response.json(
        { message: "Could not load menu items. Please try again." },
        { status: 500 }
      );
    }

    if (!menuItems || menuItems.length === 0) {
      return Response.json(
        { message: "No menu items found. Please add items to the menu first." },
        { status: 404 }
      );
    }

    // ── 2. Format menu items grouped by category for the prompt ──────────────
    const grouped = menuItems.reduce((acc, item) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(
        item.description
          ? `• ${item.title} — ${item.description}`
          : `• ${item.title}`
      );
      return acc;
    }, {});

    const menuCatalog = Object.entries(grouped)
      .map(([cat, items]) => `${cat.toUpperCase()}:\n${items.join("\n")}`)
      .join("\n\n");

    // ── 3. Build the prompt with all original rules ──────────────────────────
    const prompt = `
You are Lil Tina, a friendly catering consultant for Matotina's Kitchen — a Filipino catering business in Muntinlupa City, Philippines.

A client is planning the following event:

- Event Type: ${eventType || "Not specified"}
- Service Style: ${serviceType || "Not specified"}
- Cuisine Preference: ${cuisineStyle || "Not specified"}
- Number of Guests: ${guests || "Not specified"}
- Event Duration: ${eventDuration || "Not specified"}
- Venue Setup: ${venueType || "Not specified"}
- Budget Range: ${budgetRange || "Not specified"}
- Dietary Restrictions / Allergies: ${dietaryRestrictions || "None mentioned"}
- Special Requests: ${menuPreferences || "None mentioned"}

Below is the COMPLETE list of dishes Matotina's Kitchen offers. You MUST only recommend dishes from this list — do not suggest or invent any dish that is not listed here.

===== AVAILABLE MENU =====
${menuCatalog}
==========================

Based on the event details and the available menu above, suggest a well-balanced catering package.

Rules:
- Only use dishes from the list above, using their exact titles
- Scale the number of dishes to the guest count and event duration
- For buffet: suggest 2–3 proteins, 1–2 vegetables, 1–2 rice or carb options, 1 soup, 1–2 desserts
- For plated/sit-down: suggest 1 starter, 1 main, 1 side, 1 dessert
- For cocktail/stations: suggest bite-sized or station-style items from the list
- Respect dietary restrictions — skip or flag dishes that conflict
- Respect the cuisine preference when choosing between available options
- Do not include pricing
- Do not use markdown # headers — use plain labels like "PROTEINS:", "DESSERTS:", etc.
- End with a short warm note that this is a suggestion and can be adjusted

If the available menu does not have enough suitable items for a category, say so honestly rather than inventing dishes.
`.trim();

    // ── 4. Call the Gemini API ───────────────────────────────────────────────
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const menu = result.response.text().trim();

    if (!menu) {
      return Response.json(
        { message: "No menu was generated." },
        { status: 500 }
      );
    }

    return Response.json({ menu });
  } catch (err) {
    console.error("[lil-tina]", err);
    return Response.json(
      { message: err.message || "Failed to generate menu." },
      { status: 500 }
    );
  }
}