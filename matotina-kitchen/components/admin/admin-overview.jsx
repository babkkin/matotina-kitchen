export default function Overview() {
  return (
    <div className="section-empty">
      <div className="empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      </div>
      <h2 className="empty-title">Dashboard / Overview</h2>
      <p className="empty-sub">Your kitchen's at-a-glance summary will appear here.</p>
    </div>
  );
}