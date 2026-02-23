"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import AddItemModal from "@/components/admin/admin-additem";
import EditItemModal from "@/components/admin/admin-edititem";
import DeleteItemModal from "@/components/admin/admin-deleteitem";

export default function Menu({ isAdmin = false }) {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAdd, setShowAdd]       = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to load menu.");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // Derive unique categories from items
  const categories = useMemo(() => {
    const unique = [...new Set(items.map((i) => i.category).filter(Boolean))];
    return ["All", ...unique];
  }, [items]);

  // Filtered items based on active category
  const filtered = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  const handleAdd = async (form) => {
    const res = await fetch("/api/menu/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) fetchItems();
  };

  const handleEdit = async (form) => {
    const res = await fetch("/api/menu/manage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) fetchItems();
  };

  const handleDelete = async () => {
    const res = await fetch("/api/menu/manage", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteItem.id }) });
    if (res.ok) { setDeleteItem(null); fetchItems(); }
  };

  if (loading) return <LoadingState isAdmin={isAdmin} />;
  if (error)   return <ErrorState message={error} onRetry={fetchItems} isAdmin={isAdmin} />;

  // ── CLIENT VIEW ─────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <section id="menu" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10 relative">
            <h2 className="text-4xl md:text-5xl mb-4 text-gray-600">Our Menu</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A taste of what we offer — every menu is customized for your event
            </p>
            <Link href="/menu" className="absolute top-0 right-0 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition">
              View All Menu →
            </Link>
          </div>

          {/* Client Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                  activeCategory === cat
                    ? "bg-gray-700 text-white border-gray-700"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition">
                <div className="relative h-64 overflow-hidden">
                  {item.image_url
                    ? <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-110 transition duration-300" />
                    : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No Image</div>
                  }
                </div>
                <div className="p-6 bg-white">
                  <div className="text-sm text-gray-400 mb-1">{item.category}</div>
                  <h3 className="text-2xl mb-2 text-gray-600">{item.title}</h3>
                  <p className="text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 mt-12">No items in this category yet.</p>
          )}
        </div>
      </section>
    );
  }

  // ── ADMIN VIEW ──────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div style={{ width: "100%", maxWidth: "1100px", fontFamily: "'DM Sans', sans-serif", animation: "fadeUp 0.4s ease forwards" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "#f0e8d8", fontWeight: 600 }}>Menu Management</h2>
            <p style={{ fontSize: "13px", color: "#8a7a6a", marginTop: "4px", fontWeight: 300 }}>
              {filtered.length} of {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "rgba(180,120,60,0.2)", border: "1px solid rgba(180,120,60,0.5)", color: "#e0aa70", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Add Item
          </button>
        </div>

        {/* Admin Filter Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "7px 18px",
                borderRadius: "2px",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.18s",
                border: activeCategory === cat ? "1px solid rgba(180,120,60,0.7)" : "1px solid rgba(180,120,60,0.2)",
                background: activeCategory === cat ? "rgba(180,120,60,0.25)" : "rgba(180,120,60,0.05)",
                color: activeCategory === cat ? "#e0aa70" : "#8a7a6a",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{ overflow: "hidden", borderRadius: "6px", border: "1px solid rgba(180,120,60,0.25)", background: "#1a1612", transition: "border-color 0.2s, box-shadow 0.2s" }}
            >
              <div style={{ position: "relative", height: "200px", background: "rgba(180,120,60,0.06)", overflow: "hidden" }}>
                {item.image_url
                  ? <Image src={item.image_url} alt={item.title} fill style={{ objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a6a3a", fontSize: "13px", letterSpacing: "0.1em" }}>No Image</div>
                }
              </div>

              <div style={{ padding: "20px 22px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#c8955a", marginBottom: "6px" }}>
                  {item.category}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#f0e8d8", marginBottom: "8px", fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#9a8a7a", lineHeight: "1.6", fontWeight: 300, marginBottom: "18px" }}>
                  {item.description}
                </p>

                <div style={{ display: "flex", gap: "8px", paddingTop: "16px", borderTop: "1px solid rgba(180,120,60,0.15)" }}>
                  <button
                    onClick={() => setEditItem(item)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "rgba(180,120,60,0.12)", border: "1px solid rgba(180,120,60,0.3)", color: "#e0aa70", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteItem(item)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "rgba(224,112,112,0.1)", border: "1px solid rgba(224,112,112,0.3)", color: "#e07070", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8a7a6a", fontSize: "14px" }}>
            No items in this category yet.
          </div>
        )}
      </div>

      {showAdd    && <AddItemModal    onClose={() => setShowAdd(false)}   onSave={handleAdd} />}
      {editItem   && <EditItemModal   onClose={() => setEditItem(null)}   onSave={handleEdit} item={editItem} />}
      {deleteItem && <DeleteItemModal onClose={() => setDeleteItem(null)} onConfirm={handleDelete} />}
    </>
  );
}

// ── Loading State ─────────────────────────────────────────────
function LoadingState({ isAdmin }) {
  const cards = [1, 2, 3];
  if (!isAdmin) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
            <div className="h-5 w-80 bg-gray-100 rounded animate-pulse mx-auto" />
          </div>
          <div className="flex justify-center gap-2 mb-10">
            {[1,2,3].map((i) => <div key={i} className="h-9 w-24 bg-gray-100 rounded-full animate-pulse" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200 animate-pulse" />
                <div className="p-6 bg-white space-y-3">
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <div style={{ width: "100%", maxWidth: "1100px" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
        {[1,2,3].map((i) => <div key={i} style={{ height: "32px", width: "80px", background: "rgba(180,120,60,0.1)", borderRadius: "4px", animation: "pulse 1.5s ease infinite" }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
        {cards.map((i) => (
          <div key={i} style={{ borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(180,120,60,0.12)", background: "#1a1612" }}>
            <div style={{ height: "200px", background: "rgba(180,120,60,0.06)", animation: "pulse 1.5s ease infinite" }} />
            <div style={{ padding: "20px 22px" }}>
              <div style={{ height: "10px", width: "60px", background: "rgba(180,120,60,0.2)", borderRadius: "4px", marginBottom: "10px", animation: "pulse 1.5s ease infinite" }} />
              <div style={{ height: "20px", width: "140px", background: "rgba(240,232,216,0.08)", borderRadius: "4px", marginBottom: "10px", animation: "pulse 1.5s ease infinite" }} />
              <div style={{ height: "14px", width: "100%", background: "rgba(240,232,216,0.05)", borderRadius: "4px", animation: "pulse 1.5s ease infinite" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────
function ErrorState({ message, onRetry, isAdmin }) {
  if (!isAdmin) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">{message}</p>
          <button onClick={onRetry} className="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition">Try again</button>
        </div>
      </section>
    );
  }
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "#9a8a7a", marginBottom: "16px" }}>{message}</p>
      <button onClick={onRetry} style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#e0aa70", border: "1px solid rgba(180,120,60,0.4)", padding: "10px 20px", borderRadius: "4px", background: "transparent", cursor: "pointer" }}>
        Try again
      </button>
    </div>
  );
}