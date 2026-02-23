"use client";

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    id: "menu",
    label: "Menu Management",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5h18M3 10h18M3 15h12" />
      </svg>
    ),
  },
  {
    id: "reservations",
    label: "Reservations / Quotes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "reviews",
    label: "Reviews / Feedback",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: #0f0d0b;
          border-right: 1px solid rgba(180,120,60,0.15);
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          flex-shrink: 0;
          position: relative;
        }

        .sidebar::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 1px; height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(180,120,60,0.3) 30%, rgba(180,120,60,0.3) 70%, transparent);
          pointer-events: none;
        }

        .sidebar-logo {
          padding: 32px 28px 24px;
          border-bottom: 1px solid rgba(180,120,60,0.1);
        }

        .sidebar-logo-badge {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(180,120,60,0.6);
          margin-bottom: 6px;
        }

        .sidebar-logo-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #f0e8d8;
          line-height: 1.2;
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-label {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(240,232,216,0.25);
          padding: 0 12px;
          margin-bottom: 8px;
          margin-top: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 2px;
          border: 1px solid transparent;
          cursor: pointer;
          color: rgba(240,232,216,0.45);
          font-size: 13.5px;
          font-weight: 400;
          letter-spacing: 0.01em;
          transition: all 0.18s ease;
          background: none;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          color: rgba(240,232,216,0.85);
          background: rgba(180,120,60,0.06);
          border-color: rgba(180,120,60,0.12);
        }

        .nav-item.active {
          color: #c8955a;
          background: rgba(180,120,60,0.12);
          border-color: rgba(180,120,60,0.25);
        }

        .nav-item.active .nav-icon {
          color: #c8955a;
        }

        .nav-icon {
          flex-shrink: 0;
          opacity: 0.8;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(180,120,60,0.1);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 2px;
          border: 1px solid transparent;
          cursor: pointer;
          color: rgba(224,112,112,0.55);
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          transition: all 0.18s ease;
          background: none;
          width: 100%;
          text-align: left;
        }

        .logout-btn:hover {
          color: rgba(224,112,112,0.9);
          background: rgba(224,112,112,0.07);
          border-color: rgba(224,112,112,0.2);
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-badge">Admin Panel</div>
          <div className="sidebar-logo-title">Matotina's Kitchen</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Navigation</div>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}