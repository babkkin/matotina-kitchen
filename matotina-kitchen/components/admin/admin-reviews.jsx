"use client";

import { useState, useEffect, useMemo } from "react";

const COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#3b82f6"];
const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

const FILTERS = [
  { id: "newest",  label: "Newest" },
  { id: "oldest",  label: "Oldest" },
  { id: "highest", label: "Highest Rated" },
  { id: "lowest",  label: "Lowest Rated" },
];

function StarDisplay({ rating }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={s <= rating ? COLORS[rating - 1] : "transparent"}
            stroke={s <= rating ? COLORS[rating - 1] : "#374151"}
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function averageRating(reviews) {
  if (!reviews.length) return "—";
  return (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
}

function RatingBar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
      <span style={{ fontSize: "12px", color: "#6b7280", width: "64px", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "3px", transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: "12px", color: "#6b7280", width: "24px", textAlign: "right" }}>{count}</span>
    </div>
  );
}

function sortReviews(reviews, filter) {
  const copy = [...reviews];
  switch (filter) {
    case "oldest":  return copy.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case "highest": return copy.sort((a, b) => b.rating - a.rating);
    case "lowest":  return copy.sort((a, b) => a.rating - b.rating);
    default:        return copy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

function ReviewCard({ review, onReplySaved }) {
  const [replyText, setReplyText]   = useState(review.reply || "");
  const [editing, setEditing]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, reply: replyText }),
      });
      if (!res.ok) throw new Error("Failed to save.");
      const updated = await res.json();
      onReplySaved(updated);
      setEditing(false);
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch {
      setSaveMsg("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, reply: null }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      onReplySaved(updated);
      setReplyText("");
      setEditing(false);
    } catch {
      setSaveMsg("Failed to delete.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "22px" }}>

      {/* Review Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "14px", color: "#ffffff", marginBottom: "3px" }}>{review.name}</div>
          <div style={{ fontSize: "11px", color: "#4b5563" }}>
            {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px" }}>
          <StarDisplay rating={review.rating} />
          <span style={{ fontSize: "10px", fontWeight: 500, color: COLORS[review.rating - 1], letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {LABELS[review.rating - 1]}
          </span>
        </div>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "12px" }} />

      {/* Comment */}
      <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.7", fontStyle: "italic", marginBottom: "16px" }}>
        "{review.comment}"
      </p>

      {/* Existing Reply Display */}
      {review.reply && !editing && (
        <div style={{ padding: "12px 14px", background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)", borderLeft: "3px solid #3b82f6", borderRadius: "0 6px 6px 0", marginBottom: "12px" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "#3b82f6", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
            Your Response
          </div>
          <p style={{ fontSize: "13px", color: "#93c5fd", lineHeight: "1.6" }}>{review.reply}</p>
        </div>
      )}

      {/* Reply Editor */}
      {editing && (
        <div style={{ marginBottom: "12px" }}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your response..."
            style={{ width: "100%", height: "90px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(59,130,246,0.35)", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#ffffff", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", lineHeight: "1.6" }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {review.reply ? "Edit Reply" : "Reply"}
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving || !replyText.trim()}
              style={{ padding: "6px 14px", background: "#3b82f6", border: "none", color: "#ffffff", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer", fontFamily: "'Inter', sans-serif", opacity: saving || !replyText.trim() ? 0.6 : 1 }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => { setEditing(false); setReplyText(review.reply || ""); }}
              disabled={saving}
              style={{ padding: "6px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
            >
              Cancel
            </button>
            {review.reply && (
              <button
                onClick={handleDelete}
                disabled={saving}
                style={{ padding: "6px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
              >
                Delete Reply
              </button>
            )}
          </>
        )}
        {saveMsg && <span style={{ fontSize: "12px", color: saveMsg === "Saved!" ? "#4ade80" : "#f87171" }}>{saveMsg}</span>}
      </div>
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [filter, setFilter]   = useState("newest");

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => { if (!r.ok) throw new Error("Failed to load."); return r.json(); })
      .then((d) => { setReviews(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const handleReplySaved = (updated) => {
    setReviews((prev) => prev.map((r) => r.id === updated.id ? updated : r));
  };

  const sorted = useMemo(() => sortReviews(reviews, filter), [reviews, filter]);
  const avg    = averageRating(reviews);
  const total  = reviews.length;
  const counts = [1, 2, 3, 4, 5].map((s) => reviews.filter((r) => r.rating === s).length);

  if (loading) return (
    <div style={{ width: "100%", maxWidth: "1100px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "22px" }}>
            <div style={{ height: "14px", width: "80px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", marginBottom: "12px", animation: "pulse 1.5s ease infinite" }} />
            <div style={{ height: "12px", width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: "4px", animation: "pulse 1.5s ease infinite" }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );

  if (error) return <div style={{ color: "#f87171", fontSize: "14px" }}>Failed to load reviews: {error}</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div style={{ width: "100%", maxWidth: "1100px", fontFamily: "'Inter', sans-serif", animation: "fadeUp 0.4s ease forwards" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", color: "#ffffff", fontWeight: 700 }}>Reviews & Feedback</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{total} review{total !== 1 ? "s" : ""}</p>
          </div>

          {total > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "'Inter', sans-serif",
                    border: filter === f.id ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                    background: filter === f.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                    color: filter === f.id ? "#93c5fd" : "#6b7280",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {total > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "24px 28px", marginBottom: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingRight: "24px", borderRight: "1px solid rgba(255,255,255,0.07)", minWidth: "100px" }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "48px", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>{avg}</span>
              <StarDisplay rating={Math.round(parseFloat(avg))} />
              <span style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>{total} total</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "4px 0" }}>
              {[5, 4, 3, 2, 1].map((s) => (
                <RatingBar key={s} label={`${s} star${s !== 1 ? "s" : ""}`} count={counts[s - 1]} total={total} color={COLORS[s - 1]} />
              ))}
            </div>
          </div>
        )}

        {/* Empty */}
        {total === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "12px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p style={{ fontSize: "15px", color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "6px" }}>No reviews yet</p>
            <p style={{ fontSize: "13px" }}>Reviews will appear here once clients complete their bookings.</p>
          </div>
        )}

        {/* Reviews Grid */}
        {total > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {sorted.map((r, i) => (
              <div key={r.id} style={{ animation: `fadeUp 0.3s ease ${i * 0.03}s both` }}>
                <ReviewCard review={r} onReplySaved={handleReplySaved} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}