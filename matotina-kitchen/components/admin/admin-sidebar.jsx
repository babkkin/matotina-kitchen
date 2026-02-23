"use client";

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Dashboard",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  },
  {
    id: "menu",
    label: "Menu Management",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18M3 10h18M3 15h12"/></svg>,
  },
  {
    id: "reservations",
    label: "Reservations / Quotes",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  },
  {
    id: "reviews",
    label: "Reviews / Feedback",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@600;700&display=swap');
        .sidebar {
          width: 256px; min-height: 100vh;
          background: #0a0a0f;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column;
          font-family: 'Inter', sans-serif;
          flex-shrink: 0;
        }
        .sidebar-logo {
          padding: 28px 24px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-logo-badge {
          font-size: 10px; letter-spacing: 0.18em;
          text-transform: uppercase; color: #3b82f6;
          margin-bottom: 6px; font-weight: 500;
        }
        .sidebar-logo-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px; color: #ffffff; font-weight: 700;
        }
        .sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
        .nav-section-label {
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: #374151; padding: 0 10px; margin-bottom: 6px; margin-top: 2px; font-weight: 500;
        }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 6px; border: 1px solid transparent;
          cursor: pointer; color: #6b7280; font-size: 13.5px; font-weight: 400;
          transition: all 0.15s ease; background: none; width: 100%; text-align: left;
          font-family: 'Inter', sans-serif;
        }
        .nav-item:hover { color: #e5e7eb; background: rgba(255,255,255,0.05); }
        .nav-item.active {
          color: #ffffff; background: rgba(59,130,246,0.15);
          border-color: rgba(59,130,246,0.3);
        }
        .nav-item.active svg { color: #3b82f6; }
        .nav-icon { flex-shrink: 0; }
        .sidebar-footer { padding: 14px 12px; border-top: 1px solid rgba(255,255,255,0.06); }
        .logout-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 6px; border: 1px solid transparent;
          cursor: pointer; color: #6b7280; font-size: 13.5px;
          font-family: 'Inter', sans-serif; font-weight: 400;
          transition: all 0.15s ease; background: none; width: 100%; text-align: left;
        }
        .logout-btn:hover { color: #f87171; background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.15); }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-badge">Admin Panel</div>
          <div className="sidebar-logo-title">Matotina's Kitchen</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin-13/login";
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}