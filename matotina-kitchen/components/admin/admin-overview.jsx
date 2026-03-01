"use client";

import DashboardStats from "@/components/admin/dashboard/dashboardstats"
import RecentBookings    from "@/components/admin/dashboard/recentbooking";
import BookingStatusChart from "@/components/admin/dashboard/bookingstatuschart";
import QuickActions      from "@/components/admin/dashboard/quickactions";
import RecentReviews     from "@/components/admin/dashboard/recentreviews";

export default function Dashboard({ onNavigate }) {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ width: "100%", fontFamily: "'Inter', sans-serif", animation: "fadeUp 0.4s ease forwards" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", color: "#ffffff", fontWeight: 700 }}>Dashboard</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>Welcome back — here's what's happening with Matotina's Kitchen.</p>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Recent Bookings */}
        <RecentBookings onNavigate={onNavigate} />

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <BookingStatusChart />
          <QuickActions onNavigate={onNavigate} />
          <RecentReviews onNavigate={onNavigate} />
        </div>

      </div>
    </>
  );
}