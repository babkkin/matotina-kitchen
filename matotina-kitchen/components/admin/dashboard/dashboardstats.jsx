"use client";

import { useEffect, useState } from "react";

const statConfig = [
  {
    key: "total",
    label: "Total Bookings",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  },
  {
    key: "pending",
    label: "New",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>,
  },
  {
    key: "menuItems",
    label: "Menu Items",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
  },
];

export default function DashboardStats() {
  const [stats, setStats]     = useState({ total: 0, pending: 0, confirmed: 0, menuItems: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/quote/list"), fetch("/api/menu")])
      .then(([qr, mr]) => Promise.all([qr.json(), mr.json()]))
      .then(([quotes, menu]) => {
        setStats({
          total:     quotes.length,
          pending:   quotes.filter(q => (q.status || "new").toLowerCase() === "new").length,
          confirmed: quotes.filter(q => (q.status || "").toLowerCase() === "confirmed").length,
          menuItems: menu.length,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
      {statConfig.map(({ key, label, color, bg, icon }) => (
        <div key={key} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "20px 22px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {icon}
          </div>
          <div>
            <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: "4px" }}>{label}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", fontWeight: 700, color: loading ? "#374151" : "#ffffff", lineHeight: 1 }}>
              {loading ? "—" : stats[key]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}