"use client";

import { useEffect, useState } from "react";

const STATUS_CONFIG = [
  { key: "new",       label: "New",       color: "#f59e0b" },
  { key: "confirmed", label: "Confirmed", color: "#4ade80" },
  { key: "completed", label: "Completed", color: "#3b82f6" },
  { key: "cancelled", label: "Cancelled", color: "#f87171" },
];

export default function BookingStatusChart() {
  const [counts, setCounts]   = useState({});
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quote/list")
      .then(r => r.json())
      .then(d => {
        const c = { new: 0, confirmed: 0, completed: 0, cancelled: 0 };
        d.forEach(q => { const s = (q.status || "new").toLowerCase(); if (c[s] !== undefined) c[s]++; });
        setCounts(c);
        setTotal(d.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "22px" }}>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>Booking Status</h3>
      <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "22px" }}>Breakdown by current status</p>

      {loading ? (
        <div style={{ color: "#6b7280", fontSize: "13px", textAlign: "center", padding: "20px" }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {STATUS_CONFIG.map(({ key, label, color }) => {
            const count = counts[key] || 0;
            const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={key}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", width: "64px", flexShrink: 0 }}>{label}</span>
                  <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "3px", transition: "width 0.6s ease" }} />
                  </div>
                  <span style={{ fontSize: "12px", color: "#6b7280", width: "40px", textAlign: "right" }}>{count} <span style={{ color: "#374151" }}>({pct}%)</span></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}