export default function Reservations() {
  return (
    <div className="section-empty">
      <div className="empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="empty-title">Reservations / Quotes</h2>
      <p className="empty-sub">Manage bookings, event quotes, and scheduling here.</p>
    </div>
  );
}