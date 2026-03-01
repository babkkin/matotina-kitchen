"use client";

import { useEffect, useState } from "react";

const COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#3b82f6"];

function StarDisplay({ rating }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={s <= rating ? COLORS[rating - 1] : "transparent"}
            stroke={s <= rating ? COLORS[rating - 1] : "#374151"}
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

export default function RecentReviews({ onNavigate }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then(r => r.json())
      .then(d => {
        const sorted = [...d].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setReviews(sorted.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "22px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>Recent Reviews</h3>
        <button
          onClick={() => onNavigate && onNavigate("reviews")}
          style={{ fontSize: "12px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
        >
          View all →
        </button>
      </div>
      <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "18px" }}>Latest client feedback</p>

      {loading ? (
        <div style={{ color: "#6b7280", fontSize: "13px", textAlign: "center", padding: "20px" }}>Loading...</div>
      ) : reviews.length === 0 ? (
        <div style={{ color: "#6b7280", fontSize: "13px", textAlign: "center", padding: "20px" }}>No reviews yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {reviews.map(r => (
            <div key={r.id} style={{ padding: "14px", borderRadius: "6px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(59,130,246,0.15)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                    {(r.name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>{r.name || "Anonymous"}</div>
                    <div style={{ fontSize: "11px", color: "#4b5563" }}>
                      {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </div>
                <StarDisplay rating={r.rating || 5} />
              </div>
              {r.comment && (
                <p style={{ fontSize: "12px", color: "#9ca3af", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
                  "{r.comment.length > 80 ? r.comment.slice(0, 80) + "…" : r.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}