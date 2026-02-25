"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import AddItemModal from "@/components/admin/admin-additem";
import EditItemModal from "@/components/admin/admin-edititem";
import DeleteItemModal from "@/components/admin/admin-deleteitem";

const DESC_LIMIT = 120;

function ExpandableDesc({ text, dark = false }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text && text.length > DESC_LIMIT;
  const displayed = isLong && !expanded ? text.slice(0, DESC_LIMIT).trimEnd() + "…" : text;

  if (!text) return null;

  return (
    <p style={{
      fontSize: dark ? "13px" : "14px",
      color: dark ? "#6b7280" : "#6b7280",
      lineHeight: "1.6",
      marginBottom: dark ? "16px" : "0",
    }}>
      {displayed}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "12px", fontWeight: 600, marginLeft: "4px", padding: 0,
            color: dark ? "#3b82f6" : "#374151",
            textDecoration: "underline", textUnderlineOffset: "2px",
          }}
        >
          {expanded ? "Less" : "More"}
        </button>
      )}
    </p>
  );
}

export default function Menu({ isAdmin = false }) {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAdd, setShowAdd]       = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to load menu.");
      setItems(await res.json());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const categories = useMemo(() => ["All", ...[...new Set(items.map((i) => i.category).filter(Boolean))]], [items]);
  const filtered   = useMemo(() => activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory), [items, activeCategory]);

  const handleAdd    = async (form) => { const res = await fetch("/api/menu/manage", { method: "POST",   headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });            if (res.ok) fetchItems(); };
  const handleEdit   = async (form) => { const res = await fetch("/api/menu/manage", { method: "PUT",    headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });            if (res.ok) fetchItems(); };
  const handleDelete = async ()     => { const res = await fetch("/api/menu/manage", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteItem.id }) }); if (res.ok) { setDeleteItem(null); fetchItems(); } };

  if (loading) return <LoadingState isAdmin={isAdmin} />;
  if (error)   return <ErrorState message={error} onRetry={fetchItems} isAdmin={isAdmin} />;

  // ── CLIENT VIEW ─────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <section id="menu" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back to Home
            </Link>
          </div>
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl mb-4 text-gray-600">Our Menu</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">A taste of what we offer — every menu is customized for your event</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition ${activeCategory === cat ? "bg-gray-700 text-white border-gray-700" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition">
                <div className="relative h-64 overflow-hidden">
                  {item.image_url
                    ? <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-110 transition duration-300" />
                    : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No Image</div>}
                </div>
                <div className="p-6 bg-white">
                  <div className="text-sm text-gray-400 mb-1">{item.category}</div>
                  <h3 className="text-2xl mb-2 text-gray-600">{item.title}</h3>
                  <ExpandableDesc text={item.description} dark={false} />
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-center text-gray-400 mt-12">No items in this category yet.</p>}
        </div>
      </section>
    );
  }

  // ── ADMIN VIEW ──────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div style={{ width: "100%", maxWidth: "1100px", fontFamily: "'Inter', sans-serif", animation: "fadeUp 0.4s ease forwards" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", color: "#ffffff", fontWeight: 700 }}>Menu Management</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{filtered.length} of {items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#3b82f6", border: "none", color: "#ffffff", fontSize: "13px", fontWeight: 600, borderRadius: "6px", cursor: "pointer", transition: "background 0.2s" }}
            onMouseOver={(e) => e.currentTarget.style.background = "#2563eb"}
            onMouseOut={(e) => e.currentTarget.style.background = "#3b82f6"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Add Item
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                cursor: "pointer", transition: "all 0.15s", fontFamily: "'Inter', sans-serif",
                border: activeCategory === cat ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                background: activeCategory === cat ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                color: activeCategory === cat ? "#93c5fd" : "#6b7280",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {filtered.map((item) => (
            <div key={item.id} style={{ overflow: "hidden", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "#111118", transition: "border-color 0.2s, box-shadow 0.2s" }}>

              <div style={{ position: "relative", height: "190px", background: "rgba(255,255,255,0.03)", overflow: "hidden" }}>
                {item.image_url
                  ? <Image src={item.image_url} alt={item.title} fill style={{ objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", fontSize: "13px" }}>No Image</div>
                }
              </div>

              <div style={{ padding: "18px 20px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "6px", fontWeight: 500 }}>
                  {item.category}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", color: "#ffffff", marginBottom: "6px", fontWeight: 600 }}>
                  {item.title}
                </h3>

                <ExpandableDesc text={item.description} dark={true} />

                <div style={{ display: "flex", gap: "8px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "14px" }}>
                  <button
                    onClick={() => setEditItem(item)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "5px", cursor: "pointer" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteItem(item)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "5px", cursor: "pointer" }}
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
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280", fontSize: "14px" }}>No items in this category yet.</div>
        )}
      </div>

      {showAdd    && <AddItemModal    onClose={() => setShowAdd(false)}   onSave={handleAdd} />}
      {editItem   && <EditItemModal   onClose={() => setEditItem(null)}   onSave={handleEdit} item={editItem} />}
      {deleteItem && <DeleteItemModal onClose={() => setDeleteItem(null)} onConfirm={handleDelete} />}
    </>
  );
}

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
          <div className="flex justify-center gap-2 mb-10">{[1,2,3].map((i) => <div key={i} className="h-9 w-24 bg-gray-100 rounded-full animate-pulse" />)}</div>
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
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {[1,2,3].map((i) => <div key={i} style={{ height: "30px", width: "80px", background: "rgba(59,130,246,0.1)", borderRadius: "20px", animation: "pulse 1.5s ease infinite" }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {cards.map((i) => (
          <div key={i} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "#111118" }}>
            <div style={{ height: "190px", background: "rgba(255,255,255,0.03)", animation: "pulse 1.5s ease infinite" }} />
            <div style={{ padding: "18px 20px" }}>
              <div style={{ height: "10px", width: "60px", background: "rgba(59,130,246,0.15)", borderRadius: "4px", marginBottom: "10px", animation: "pulse 1.5s ease infinite" }} />
              <div style={{ height: "18px", width: "140px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", marginBottom: "10px", animation: "pulse 1.5s ease infinite" }} />
              <div style={{ height: "13px", width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: "4px", animation: "pulse 1.5s ease infinite" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <p style={{ color: "#6b7280", marginBottom: "16px" }}>{message}</p>
      <button onClick={onRetry} style={{ fontSize: "13px", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.3)", padding: "10px 20px", borderRadius: "6px", background: "transparent", cursor: "pointer" }}>Try again</button>
    </div>
  );
}