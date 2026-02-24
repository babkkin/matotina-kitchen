"use client";

import { useState, useEffect, useMemo } from "react";

const COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#3b82f6"];
const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];
const PAGE_SIZE = 6;

const FILTERS = [
  { id: "newest",  label: "Newest" },
  { id: "oldest",  label: "Oldest" },
  { id: "highest", label: "Highest Rated" },
  { id: "lowest",  label: "Lowest Rated" },
];

function StarDisplay({ rating, size = 16 }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={s <= rating ? COLORS[rating - 1] : "transparent"}
            stroke={s <= rating ? COLORS[rating - 1] : "#d1d5db"}
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function averageRating(reviews) {
  if (!reviews.length) return 0;
  return (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
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

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleFilter = (f) => { setFilter(f); setVisible(PAGE_SIZE); };
  const sorted  = useMemo(() => sortReviews(reviews, filter), [reviews, filter]);
  const shown   = sorted.slice(0, visible);
  const hasMore = visible < sorted.length;
  const avg     = averageRating(reviews);
  const total   = reviews.length;

  return (
    <section style={{ padding: "80px 0", background: "#f9fafb" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#1f2937", marginBottom: "10px" }}>
            What Our Clients Say
          </h2>
          <p style={{ fontSize: "16px", color: "#9ca3af", marginBottom: "20px" }}>Real experiences from real events</p>

          {!loading && total > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "40px", padding: "10px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <StarDisplay rating={Math.round(avg)} />
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>{avg}</span>
              <span style={{ fontSize: "13px", color: "#9ca3af" }}>from {total} review{total !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        {!loading && total > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "36px" }}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFilter(f.id)}
                style={{
                  padding: "8px 20px", borderRadius: "20px", fontSize: "13px", fontWeight: 500,
                  cursor: "pointer", transition: "all 0.15s",
                  border: filter === f.id ? "1px solid #374151" : "1px solid #e5e7eb",
                  background: filter === f.id ? "#374151" : "#ffffff",
                  color: filter === f.id ? "#ffffff" : "#6b7280",
                  boxShadow: filter === f.id ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: "#ffffff", borderRadius: "12px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ height: "16px", width: "100px", background: "#f3f4f6", borderRadius: "4px", marginBottom: "16px", animation: "pulse 1.5s ease infinite" }} />
                <div style={{ height: "14px", width: "100%", background: "#f3f4f6", borderRadius: "4px", marginBottom: "8px", animation: "pulse 1.5s ease infinite" }} />
                <div style={{ height: "14px", width: "70%", background: "#f3f4f6", borderRadius: "4px", animation: "pulse 1.5s ease infinite" }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && total === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
            <svg style={{ margin: "0 auto 16px", display: "block" }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <p style={{ fontSize: "15px" }}>No reviews yet.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && total > 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginBottom: "36px" }}>
              {shown.map((r, i) => (
                <div
                  key={r.id}
                  style={{ background: "#ffffff", borderRadius: "12px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", animation: `fadeUp 0.4s ease ${(i % PAGE_SIZE) * 0.05}s both` }}
                >
                  {/* Top */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "15px", color: "#111827", marginBottom: "3px" }}>{r.name}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                        {new Date(r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <StarDisplay rating={r.rating} />
                      <span style={{ fontSize: "11px", fontWeight: 500, color: COLORS[r.rating - 1] }}>{LABELS[r.rating - 1]}</span>
                    </div>
                  </div>

                  <div style={{ height: "1px", background: "#f3f4f6", marginBottom: "14px" }} />

                  {/* Comment */}
                  <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.7", fontStyle: "italic", marginBottom: r.reply ? "16px" : "0" }}>
                    "{r.comment}"
                  </p>

                  {/* Owner Reply */}
                  {r.reply && (
                    <div style={{ marginTop: "16px", padding: "14px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #3b82f6", borderRadius: "0 8px 8px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
                          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#3b82f6", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          Response from Matotina's Kitchen
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>{r.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  style={{ padding: "12px 36px", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "24px", fontSize: "14px", fontWeight: 500, color: "#374151", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", transition: "all 0.15s" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                  onMouseOut={(e)  => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                >
                  Load More <span style={{ color: "#9ca3af", fontSize: "13px" }}>({sorted.length - visible} remaining)</span>
                </button>
              </div>
            )}

            {!hasMore && total > PAGE_SIZE && (
              <p style={{ textAlign: "center", fontSize: "13px", color: "#d1d5db" }}>All {total} reviews shown</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}