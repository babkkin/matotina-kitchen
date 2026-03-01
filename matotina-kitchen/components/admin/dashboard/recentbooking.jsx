"use client";

import { useEffect, useState } from "react";

const STATUS_STYLES = {
  new:       { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",    border: "rgba(245,158,11,0.25)" },
  confirmed: { color: "#4ade80", bg: "rgba(74,222,128,0.1)",    border: "rgba(74,222,128,0.25)" },
  completed: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)",    border: "rgba(59,130,246,0.25)" },
  cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.2)" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[(status || "new").toLowerCase()] || STATUS_STYLES.new;
  return (
    <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px", color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {status || "new"}
    </span>
  );
}

export default function RecentBookings({ onNavigate }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("/api/quote/list")
      .then(r => r.json())
      .then(d => {
        const sorted = [...d].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setBookings(sorted.slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden", marginBottom: "24px" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>Recent Bookings</h3>
          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "3px" }}>Latest quote submissions</p>
        </div>
        <button onClick={() => onNavigate && onNavigate("reservations")} style={{ fontSize: "12px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>View all →</button>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>Loading...</div>
      ) : bookings.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>No bookings yet.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Name", "Event Type", "Event Date", "Guests", "Status"].map(h => (
                  <th key={h} style={{ padding: "11px 24px", textAlign: "left", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: i < bookings.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "13px 24px", fontSize: "13px", color: "#ffffff", fontWeight: 500 }}>{b.name || "—"}</td>
                  <td style={{ padding: "13px 24px", fontSize: "13px", color: "#9ca3af" }}>{b.event_type || "—"}</td>
                  <td style={{ padding: "13px 24px", fontSize: "13px", color: "#9ca3af" }}>
                    {b.event_date ? new Date(b.event_date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                  <td style={{ padding: "13px 24px", fontSize: "13px", color: "#9ca3af" }}>{b.guests || "—"}</td>
                  <td style={{ padding: "13px 24px" }}><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}