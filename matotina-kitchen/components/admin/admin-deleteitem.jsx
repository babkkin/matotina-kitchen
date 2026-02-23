"use client";

export default function DeleteItemModal({ onClose, onConfirm }) {
  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.iconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
        </div>
        <h3 style={styles.title}>Delete this item?</h3>
        <p style={styles.sub}>This action cannot be undone. The item will be permanently removed from your menu.</p>
        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={onConfirm} style={styles.deleteBtn}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop:   { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "24px" },
  modal:      { background: "#111118", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "10px", width: "100%", maxWidth: "380px", padding: "36px", boxShadow: "0 32px 80px rgba(0,0,0,0.8)", textAlign: "center" },
  iconWrap:   { width: "52px", height: "52px", borderRadius: "12px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  title:      { fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", color: "#ffffff", marginBottom: "10px", fontWeight: 700 },
  sub:        { fontSize: "13px", color: "#6b7280", marginBottom: "28px", lineHeight: "1.6" },
  actions:    { display: "flex", gap: "12px" },
  cancelBtn:  { flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", fontSize: "13px", fontFamily: "'Inter', sans-serif", borderRadius: "6px", cursor: "pointer" },
  deleteBtn:  { flex: 2, padding: "12px", background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.35)", color: "#f87171", fontSize: "13px", fontWeight: 600, fontFamily: "'Inter', sans-serif", borderRadius: "6px", cursor: "pointer" },
};