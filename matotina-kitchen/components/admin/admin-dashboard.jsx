"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/admin-sidebar";
import Overview from "@/components/admin/admin-overview";
import MenuManagement from "@/components/admin/admin-menumanagement";
import Reservations from "@/components/admin/admin-reservation";
import Reviews from "@/components/admin/admin-reviews";

const SECTION_TITLES = {
  overview: "Dashboard",
  menu: "Menu Management",
  reservations: "Reservations / Quotes",
  reviews: "Reviews / Feedback",
};

function renderContent(active) {
  switch (active) {
    case "overview":     return <Overview />;
    case "menu":         return <MenuManagement />;
    case "reservations": return <Reservations />;
    case "reviews":      return <Reviews />;
    default:             return <Overview />;
  }
}

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dashboard-root {
          display: flex;
          min-height: 100vh;
          background: #13100d;
          font-family: 'DM Sans', sans-serif;
        }

        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .topbar {
          height: 64px;
          background: #0f0d0b;
          border-bottom: 1px solid rgba(180,120,60,0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          flex-shrink: 0;
        }

        .topbar-title {
          font-family: 'Playfair Display', serif;
          font-size: 19px;
          color: #f0e8d8;
          letter-spacing: 0.01em;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .topbar-dot {
          width: 8px;
          height: 8px;
          background: rgba(120,200,120,0.7);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(120,200,120,0.5);
        }

        .topbar-status {
          font-size: 12px;
          color: rgba(240,232,216,0.3);
          letter-spacing: 0.08em;
        }

        .content-area {
          flex: 1;
          padding: 48px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Shared empty state styles used by all section components */
        .section-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 16px;
          opacity: 0;
          animation: fadeUp 0.4s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(180,120,60,0.08);
          border: 1px solid rgba(180,120,60,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(180,120,60,0.6);
          margin-bottom: 8px;
        }

        .empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #f0e8d8;
          font-weight: 600;
        }

        .empty-sub {
          font-size: 14px;
          color: rgba(240,232,216,0.3);
          max-width: 340px;
          line-height: 1.6;
          font-weight: 300;
        }
      `}</style>

      <div className="dashboard-root">
        <Sidebar active={active} onNavigate={setActive} />

        <div className="main-area">
          <header className="topbar">
            <span className="topbar-title">{SECTION_TITLES[active]}</span>
            <div className="topbar-right">
              <div className="topbar-dot" />
              <span className="topbar-status">Online</span>
            </div>
          </header>

          <main className="content-area">
            {renderContent(active)}
          </main>
        </div>
      </div>
    </>
  );
}