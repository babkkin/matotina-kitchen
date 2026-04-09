// app/api/lil-tina/route.js
import { NextResponse } from "next/server";

const MENUS = {
  Wedding: [
    "Beef Caldereta with tender chunks of beef in rich tomato sauce",
    "Creamy Chicken Pastel in puff pastry shell",
    "Baked Salmon with lemon butter and capers",
    "Pancit Malabon with fresh seafood toppings",
    "Steamed Jasmine Rice",
    "Ensaladang Talong with salted egg and tomato",
    "Leche Flan and Buko Pandan for dessert",
  ],
  Birthday: [
    "Crispy Pork Lechon Belly with liver sauce",
    "Creamy Carbonara with bacon and mushroom",
    "Sweet & Sour Fish Fillet",
    "Pancit Canton Guisado",
    "Steamed Rice",
    "Fresh Lumpia with peanut sauce",
    "Mango Float and Bibingka for dessert",
  ],
  "Corporate Event": [
    "Chicken Cordon Bleu with cream sauce",
    "Beef Steak Tagalog in onion-soy glaze",
    "Buttered Vegetables medley",
    "Steamed Jasmine Rice",
    "Caesar Salad with croutons and parmesan",
    "Dinner Rolls",
    "Assorted Pastries and fresh fruit for dessert",
  ],
  Debut: [
    "Roasted Whole Chicken with herb stuffing",
    "Creamy Mushroom Pasta",
    "Breaded Fish Fillet with tartar sauce",
    "Chopsuey with quail eggs",
    "Steamed Rice",
    "Mixed Green Salad with balsamic dressing",
    "Chocolate Fountain with fruits and marshmallows",
  ],
  Christening: [
    "Arroz Caldo with fried garlic and egg",
    "Fried Chicken (Golden Crispy)",
    "Pancit Bihon with vegetables",
    "Cheese Macaroni Salad",
    "Steamed Rice",
    "Dinuguan with Puto",
    "Sapin-Sapin and Kutsinta for dessert",
  ],
  Anniversary: [
    "Surf & Turf — Grilled Tenderloin and Buttered Shrimp",
    "Creamy Seafood Pasta",
    "Grilled Vegetables with olive oil and sea salt",
    "Garlic Fried Rice",
    "Tomato Caprese Salad",
    "Dinner Rolls with herb butter",
    "Chocolate Lava Cake and Crème Brûlée for dessert",
  ],
  Reunion: [
    "Kare-Kare with bagoong and fermented shrimp paste",
    "Sinigang na Baboy (Pork in Sour Broth)",
    "Grilled Liempo with atchara",
    "Pancit Palabok with all the toppings",
    "Steamed Rice",
    "Ensaladang Mangga",
    "Halo-Halo and Mais con Hielo for dessert",
  ],
};

const DEFAULT_MENU = [
  "Adobong Manok sa Gata (Chicken Adobo in Coconut Milk)",
  "Sinigang na Hipon (Shrimp in Sour Broth)",
  "Pinakbet with bagnet crumbles",
  "Pancit Bihon Guisado",
  "Steamed Jasmine Rice",
  "Achara (Pickled Green Papaya)",
  "Leche Flan for dessert",
];

function buildMenu(eventType, serviceType, guests, dietaryRestrictions, menuPreferences) {
  const base = MENUS[eventType] ?? DEFAULT_MENU;

  const lines = [
    `🍽️  Suggested Menu for your ${eventType || "event"}`,
    serviceType ? `📋  Service Style: ${serviceType}` : "",
    guests      ? `👥  Estimated Guests: ${guests}`   : "",
    "",
    "── Recommended Dishes ──────────────────",
    ...base.map((dish, i) => `${i + 1}. ${dish}`),
  ].filter(Boolean);

  if (dietaryRestrictions) {
    lines.push("", `⚠️  Dietary Notes: ${dietaryRestrictions}`);
    lines.push("   → Our team will prepare suitable alternatives for the above.");
  }

  if (menuPreferences) {
    lines.push("", `💬  Your preference "${menuPreferences}" has been noted.`);
    lines.push("   → We'll incorporate this into your final proposal.");
  }

  lines.push(
    "",
    "────────────────────────────────────────",
    "✏️  Feel free to edit this suggestion before submitting.",
    "    Our team will finalize the menu with you after review.",
  );

  return lines.join("\n");
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      eventType           = "",
      serviceType         = "",
      guests              = "",
      dietaryRestrictions = "",
      menuPreferences     = "",
    } = body;

    // Simulate a short processing delay
    await new Promise((r) => setTimeout(r, 600));

    const menu = buildMenu(eventType, serviceType, guests, dietaryRestrictions, menuPreferences);
    return NextResponse.json({ menu });
  } catch (err) {
    console.error("[lil-tina]", err);
    return NextResponse.json({ message: "Failed to generate menu." }, { status: 500 });
  }
}