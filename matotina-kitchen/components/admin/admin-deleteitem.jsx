"use client";

export default function DeleteItemModal({ onClose, onConfirm }) {
  const s = styles;

  return (
    <div style={s.backdrop} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={s.title}>Delete this item?</h3>
        <p style={s.sub}>This action cannot be undone.</p>
        <div style={s.actions}>
          <button onClick={onClose} style={s.cancelBtn}>Cancel</button>
          <button onClick={onConfirm} style={s.deleteBtn}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop:  { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "24px" },
  modal:     { background: "#1c1814", border: "1px solid rgba(180,120,60,0.45)", borderRadius: "4px", width: "100%", maxWidth: "380px", padding: "36px", boxShadow: "0 32px 80px rgba(0,0,0,0.8)", textAlign: "center" },
  title:     { fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#f0e8d8", marginBottom: "12px", fontWeight: 600 },
  sub:       { fontSize: "13px", color: "#9a8a7a", marginBottom: "32px", fontWeight: 300 },
  actions:   { display: "flex", gap: "12px" },
  cancelBtn: { flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#c8b89a", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer" },
  deleteBtn: { flex: 2, padding: "12px", background: "rgba(224,112,112,0.15)", border: "1px solid rgba(224,112,112,0.45)", color: "#e07070", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer" },
};