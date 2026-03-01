"use client";

const actions = [
  {
    label: "Add Menu Item",
    description: "Add a new dish to the menu",
    section: "menu",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  },
  {
    label: "View All Bookings",
    description: "Manage quote submissions",
    section: "reservations",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  },
  {
    label: "View Reviews",
    description: "Read and reply to reviews",
    section: "reviews",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/></svg>,
  },
];

export default function QuickActions({ onNavigate }) {
  return (
    <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "22px" }}>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>Quick Actions</h3>
      <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "18px" }}>Common tasks</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {actions.map(({ label, description, section, href, color, bg, icon }) => (
          <button
            key={label}
            onClick={() => section && onNavigate ? onNavigate(section) : href && (window.location.href = href)}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.15s, border-color 0.15s", fontFamily: "'Inter', sans-serif" }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>{label}</div>
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>{description}</div>
            </div>
            <span style={{ color: "#4b5563", fontSize: "14px" }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}