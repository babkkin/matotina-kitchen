"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/admin-sidebar";
import Overview from "@/components/admin/admin-overview";
import MenuManagement from "@/components/admin/admin-menumanagement";
import Reservations from "@/components/admin/admin-reservation";
import Reviews from "@/components/admin/admin-reviews";

const SECTION_TITLES = {
  overview:     "Dashboard",
  menu:         "Menu Management",
  reservations: "Reservations / Quotes",
  reviews:      "Reviews / Feedback",
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .dashboard-root { display: flex; min-height: 100vh; background: #0d0d14; font-family: 'Inter', sans-serif; }
        .main-area { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .topbar {
          height: 60px; background: #0a0a0f;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; flex-shrink: 0;
        }
        .topbar-title { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 600; color: #ffffff; }
        .topbar-right { display: flex; align-items: center; gap: 8px; }
        .topbar-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 6px rgba(34,197,94,0.6); }
        .topbar-status { font-size: 12px; color: #6b7280; letter-spacing: 0.05em; }
        .content-area { flex: 1; padding: 40px 36px; display: flex; align-items: flex-start; justify-content: flex-start; overflow-y: auto; }

        /* Empty section shared styles */
        .section-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 14px; width: 100%; padding: 80px 0; opacity: 0; animation: fadeUp 0.4s ease forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .empty-icon { width: 68px; height: 68px; border-radius: 14px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); display: flex; align-items: center; justify-content: center; color: #3b82f6; margin-bottom: 6px; }
        .empty-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; color: #ffffff; font-weight: 600; }
        .empty-sub { font-size: 13px; color: #6b7280; max-width: 320px; line-height: 1.6; font-weight: 300; }
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