"use client";
import { useEffect, useState } from "react";

const STATUSES = [
  { key: "new",       label: "New",       color: "#3b82f6", bg: "rgba(59,130,246,0.15)",  text: "#93c5fd"  },
  { key: "contacted", label: "Contacted", color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  text: "#fcd34d"  },
  { key: "confirmed", label: "Confirmed", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)",  text: "#c4b5fd"  },
  { key: "completed", label: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.15)",  text: "#6ee7b7"  },
  { key: "cancelled", label: "Cancelled", color: "#6b7280", bg: "rgba(107,114,128,0.15)", text: "#9ca3af"  },
];

const NEXT_STATUSES = {
  new:       ["contacted", "cancelled"],
  contacted: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const EMPTY_CONFIRMATION = {
  total_price: "", price_breakdown: "",
  deposit_amount: "", deposit_due_date: "",
  balance_amount: "", balance_due_date: "",
  cancellation_policy: "", whats_included: "",
  whats_not_included: "", deposit_instructions: "", contact_info: "",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function StatusBadge({ status }) {
  const meta = STATUSES.find(s => s.key === status);
  if (!meta) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", fontSize: "11px", fontWeight: 500,
      letterSpacing: "0.06em", textTransform: "uppercase",
      background: meta.bg, color: meta.text,
      border: `1px solid ${meta.color}33`,
    }}>
      {meta.label}
    </span>
  );
}



const inputStyle = {
  width: "100%", padding: "10px 12px", fontSize: "13px",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#ffffff", outline: "none", fontFamily: "'Inter', sans-serif",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block", fontSize: "11px", fontWeight: 600,
  color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px",
};

// ── Confirmation Modal ─────────────────────────────────────────────────────────
function ConfirmationModal({ quote, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_CONFIRMATION);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.total_price) { setError("Total price is required."); return; }
    setSending(true);
    setError(null);
    const res = await fetch("/api/quote/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote_id: quote.id, ...form }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) { setError(data.message || "Something went wrong."); return; }
    onSuccess(quote.id);
  };

  const SectionLabel = ({ children }) => (
    <p style={{ fontSize: "11px", fontWeight: 600, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid rgba(139,92,246,0.2)" }}>
      {children}
    </p>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", padding: "16px" }}>
      <div style={{ background: "#0f0f17", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ padding: "28px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "sticky", top: 0, background: "#0f0f17", zIndex: 10 }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>Send Confirmation & Quote</p>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 700, color: "#ffffff" }}>{quote.name}</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{quote.event_type} · {formatDate(quote.event_date)}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "32px" }}>
          {/* The Quote */}
          <div style={{ marginBottom: "32px" }}>
            <SectionLabel>The Quote</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Total Price (₱) <span style={{ color: "#f87171" }}>*</span></label>
                <input type="number" name="total_price" value={form.total_price} onChange={handleChange} placeholder="e.g. 85000" style={inputStyle} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Price Breakdown</label>
                <textarea name="price_breakdown" rows={3} value={form.price_breakdown} onChange={handleChange}
                  placeholder={"Buffet for 150 pax – ₱70,000\nService staff (5) – ₱10,000\nSetup & cleanup – ₱5,000"}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
              <div>
                <label style={labelStyle}>Deposit Amount (₱)</label>
                <input type="number" name="deposit_amount" value={form.deposit_amount} onChange={handleChange} placeholder="e.g. 25000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Deposit Due Date</label>
                <input type="date" name="deposit_due_date" value={form.deposit_due_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Balance Amount (₱)</label>
                <input type="number" name="balance_amount" value={form.balance_amount} onChange={handleChange} placeholder="e.g. 60000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Balance Due Date</label>
                <input type="date" name="balance_due_date" value={form.balance_due_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div style={{ marginBottom: "32px" }}>
            <SectionLabel>Terms</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>What&apos;s Included</label>
                <textarea name="whats_included" rows={3} value={form.whats_included} onChange={handleChange}
                  placeholder={"Setup and breakdown\nService staff\nChafing dishes and serving utensils"}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
              <div>
                <label style={labelStyle}>What&apos;s Not Included</label>
                <textarea name="whats_not_included" rows={2} value={form.whats_not_included} onChange={handleChange}
                  placeholder={"Venue rental\nTables and chairs\nDecoration"}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
              <div>
                <label style={labelStyle}>Cancellation Policy</label>
                <textarea name="cancellation_policy" rows={2} value={form.cancellation_policy} onChange={handleChange}
                  placeholder="Deposit is non-refundable. Cancellations within 7 days forfeit 50% of total."
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div style={{ marginBottom: "32px" }}>
            <SectionLabel>Next Steps</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Deposit Payment Instructions</label>
                <textarea name="deposit_instructions" rows={3} value={form.deposit_instructions} onChange={handleChange}
                  placeholder={"GCash: 09XX XXX XXXX (Juan dela Cruz)\nBDO: Account No. 1234-5678-90\nSend proof of payment to our email."}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
              <div>
                <label style={labelStyle}>Contact Info for Questions</label>
                <textarea name="contact_info" rows={2} value={form.contact_info} onChange={handleChange}
                  placeholder={"Call or text: 09XX XXX XXXX\nEmail: matotina1393@gmail.com"}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: "13px", padding: "12px 16px", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "12px", fontSize: "13px", fontWeight: 500, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
              Cancel
            </button>
            <button type="submit" disabled={sending}
              style={{ flex: 1, padding: "12px", fontSize: "13px", fontWeight: 600, background: "#8b5cf6", border: "none", color: "#ffffff", cursor: "pointer", fontFamily: "'Inter', sans-serif", opacity: sending ? 0.6 : 1 }}>
              {sending ? "Sending…" : "✉️ Send Confirmation Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Add this new modal component before RowActionsModal

function ViewQuoteModal({ quote, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`/api/quote/confirm?quote_id=${quote.id}`);
      const data = await res.json();
      if (!res.ok) setError(data.message || "Failed to load quote details.");
      else setDetails(data);
      setLoading(false);
    };
    fetchDetails();
  }, [quote.id]);

  const SectionLabel = ({ children }) => (
    <p style={{ fontSize: "11px", fontWeight: 600, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid rgba(139,92,246,0.2)" }}>
      {children}
    </p>
  );

  const Field = ({ label, value }) => value ? (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ ...labelStyle, marginBottom: "6px" }}>{label}</p>
      <p style={{ fontSize: "13px", color: "#d1d5db", whiteSpace: "pre-line", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "10px 12px" }}>{value}</p>
    </div>
  ) : null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", padding: "16px" }}>
      <div style={{ background: "#0f0f17", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ padding: "28px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "sticky", top: 0, background: "#0f0f17", zIndex: 10 }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>✓ Confirmed Quote Details</p>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 700, color: "#ffffff" }}>{quote.name}</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{quote.event_type} · {formatDate(quote.event_date)}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: "32px" }}>
          {loading && <p style={{ color: "#6b7280", fontSize: "13px" }}>Loading quote details...</p>}
          {error && <p style={{ color: "#f87171", fontSize: "13px" }}>{error}</p>}
          {details && (
            <>
              <div style={{ marginBottom: "32px" }}>
                <SectionLabel>The Quote</SectionLabel>
                <Field label="Total Price" value={details.total_price ? `₱${Number(details.total_price).toLocaleString()}` : null} />
                <Field label="Price Breakdown" value={details.price_breakdown} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Field label="Deposit Amount" value={details.deposit_amount ? `₱${Number(details.deposit_amount).toLocaleString()}` : null} />
                  <Field label="Deposit Due Date" value={details.deposit_due_date ? formatDate(details.deposit_due_date) : null} />
                  <Field label="Balance Amount" value={details.balance_amount ? `₱${Number(details.balance_amount).toLocaleString()}` : null} />
                  <Field label="Balance Due Date" value={details.balance_due_date ? formatDate(details.balance_due_date) : null} />
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <SectionLabel>Terms</SectionLabel>
                <Field label="What's Included" value={details.whats_included} />
                <Field label="What's Not Included" value={details.whats_not_included} />
                <Field label="Cancellation Policy" value={details.cancellation_policy} />
              </div>

              <div style={{ marginBottom: "32px" }}>
                <SectionLabel>Next Steps</SectionLabel>
                <Field label="Deposit Payment Instructions" value={details.deposit_instructions} />
                <Field label="Contact Info for Questions" value={details.contact_info} />
              </div>
            </>
          )}

          <button onClick={onClose}
            style={{ width: "100%", padding: "12px", fontSize: "13px", color: "#9ca3af", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Row Actions Modal ──────────────────────────────────────────────────────────
function RowActionsModal({ quote, onClose, onStatusChange, onConfirm, onViewQuote, updating }) {
  const nextStatuses = NEXT_STATUSES[quote.status] || [];
  const statusMeta = STATUSES.find(s => s.key === quote.status);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", padding: "16px" }}>
      <div style={{ background: "#0f0f17", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "420px", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "#111118", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em" }}>Quote Actions</p>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>{quote.name}</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>{quote.event_type} · {formatDate(quote.event_date)}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Current status</span>
            <StatusBadge status={quote.status} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: "28px 32px" }}>
          {nextStatuses.length > 0 ? (
            <>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>Move to</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {nextStatuses.map(s => {
                  const meta = STATUSES.find(st => st.key === s);
                  const isConfirm = s === "confirmed";
                  const isCancelled = s === "cancelled";
                  return (
                    <button
                      key={s}
                      disabled={updating === quote.id}
                      onClick={() => {
                        if (isConfirm) { onClose(); onConfirm(quote); }
                        else { onStatusChange(quote.id, s); onClose(); }
                      }}
                      style={{
                        width: "100%", padding: "14px 18px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        fontSize: "13px", fontWeight: 500, cursor: "pointer", textAlign: "left",
                        fontFamily: "'Inter', sans-serif", transition: "opacity 0.15s",
                        background: isCancelled ? "transparent" : isConfirm ? "rgba(139,92,246,0.2)" : meta.bg,
                        border: isCancelled ? "1px solid rgba(248,113,113,0.3)" : isConfirm ? "1px solid rgba(139,92,246,0.4)" : `1px solid ${meta.color}33`,
                        color: isCancelled ? "#f87171" : isConfirm ? "#c4b5fd" : meta.text,
                      }}
                    >
                      <span>{isConfirm ? "✉️ Confirm & Send Quote" : `Mark as ${meta.label}`}</span>
                      <span style={{ opacity: 0.5, fontSize: "16px" }}>→</span>
                    </button>
                  );
                })}
                
                  {quote.status === "confirmed" && (
                    <button
                      onClick={() => { onViewQuote(quote); onClose(); }}
                      style={{
                        width: "100%", padding: "14px 18px", marginBottom: "10px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        fontSize: "13px", fontWeight: 500, cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                        background: "rgba(245, 157, 39, 0.1)", border: "1px solid rgba(245, 157, 39, 0.3)",
                        color: "rgba(245, 157, 39, 0.8)",
                      }}
                    >
                      <span>📄 View Sent Quote</span>
                      <span style={{ opacity: 0.5, fontSize: "16px" }}>→</span>
                    </button>
                  )}
                                  

                
              </div>
            </>
          ) : (
            <p style={{ fontSize: "13px", color: "#6b7280", fontStyle: "italic" }}>No further actions available.</p>
          )}

          <button
            onClick={onClose}
            style={{ width: "100%", marginTop: "16px", padding: "12px", fontSize: "13px", color: "#6b7280", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
          >
            Close
          </button>
          
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Reservations() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [filterStatus, setFilterStatus] = useState("new");
  const [confirmingQuote, setConfirmingQuote] = useState(null);
  const [actionsQuote, setActionsQuote] = useState(null);
  const [viewingQuote, setViewingQuote] = useState(null);

  const fetchQuotes = async () => {
    const res = await fetch("/api/quote/list");
    const data = await res.json();
    if (!res.ok) setError(data.message || "Failed to load quotes.");
    else setQuotes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    const res = await fetch("/api/quote/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (!res.ok) alert("Failed to update status.");
    else setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    setUpdating(null);
  };

  const handleConfirmSuccess = (id) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: "confirmed" } : q));
    setConfirmingQuote(null);
  };

  const filtered = quotes.filter(q => q.status === filterStatus);
  const activeStatusMeta = STATUSES.find(s => s.key === filterStatus);

  if (loading) return (
    <div style={{ fontFamily: "'Inter', sans-serif", padding: "40px", color: "#6b7280", fontSize: "14px" }}>Loading quotes...</div>
  );
  if (error) return (
    <div style={{ fontFamily: "'Inter', sans-serif", padding: "40px", color: "#f87171", fontSize: "14px" }}>Error: {error}</div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {confirmingQuote && (
        <ConfirmationModal
          quote={confirmingQuote}
          onClose={() => setConfirmingQuote(null)}
          onSuccess={handleConfirmSuccess}
        />
      )}
      {actionsQuote && (
        <RowActionsModal
          quote={actionsQuote}
          onClose={() => setActionsQuote(null)}
          onStatusChange={handleStatusChange}
          onConfirm={setConfirmingQuote}
          onViewQuote={setViewingQuote}
          updating={updating}
        />
      )}

      {viewingQuote && (
        <ViewQuoteModal
          quote={viewingQuote}
          onClose={() => setViewingQuote(null)}
        />
      )}

      <div style={{ width: "100%", fontFamily: "'Inter', sans-serif", animation: "fadeUp 0.4s ease forwards" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", color: "#ffffff", fontWeight: 700 }}>Reservations & Quotes</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
              {quotes.length} total · {quotes.filter(q => q.status === "new").length} new inquiries
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0" }}>
          {STATUSES.map(s => {
            const isActive = filterStatus === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setFilterStatus(s.key)}
                style={{
                  padding: "10px 20px", fontSize: "13px", fontWeight: 500,
                  cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  background: "none", border: "none",
                  borderBottom: isActive ? `2px solid ${s.color}` : "2px solid transparent",
                  color: isActive ? s.text : "#6b7280",
                  marginBottom: "-1px", transition: "all 0.15s",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280", fontSize: "14px" }}>
            No {activeStatusMeta?.label.toLowerCase()} quotes yet.
          </div>
        ) : (
          <div style={{ border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", fontFamily: "'Inter', sans-serif", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>
              <thead>
                <tr style={{ background: "#111118", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Client", "Event", "Date & Time", "Guests", "Service", "Submitted", ""].map((h, i) => (
                    <th key={i} style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((quote, idx) => (
                  <tr key={quote.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"}
                  >
                    <td style={{ padding: "18px 20px", verticalAlign: "top" }}>
                      <p style={{ fontWeight: 600, color: "#ffffff", marginBottom: "3px" }}>{quote.name}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>{quote.email}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>{quote.phone}</p>
                    </td>
                    <td style={{ padding: "18px 20px", verticalAlign: "top" }}>
                      <p style={{ color: "#d1d5db", marginBottom: "3px" }}>{quote.event_type}</p>
                      {quote.venue && <p style={{ fontSize: "12px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{quote.venue}</p>}
                    </td>
                    <td style={{ padding: "18px 20px", verticalAlign: "top", whiteSpace: "nowrap" }}>
                      <p style={{ color: "#d1d5db", marginBottom: "3px" }}>{formatDate(quote.event_date)}</p>
                      {quote.event_time && <p style={{ fontSize: "12px", color: "#6b7280" }}>{quote.event_time}</p>}
                    </td>
                    <td style={{ padding: "18px 20px", verticalAlign: "top" }}>
                      <p style={{ color: "#d1d5db", fontWeight: 500 }}>{quote.guests}</p>
                      <p style={{ fontSize: "11px", color: "#6b7280" }}>guests</p>
                    </td>
                    <td style={{ padding: "18px 20px", verticalAlign: "top" }}>
                      <p style={{ color: "#d1d5db", marginBottom: "3px" }}>{quote.service_type}</p>
                      {quote.budget_range && <p style={{ fontSize: "12px", color: "#6b7280" }}>{quote.budget_range}</p>}
                    </td>
                    <td style={{ padding: "18px 20px", verticalAlign: "top", color: "#6b7280", fontSize: "12px", whiteSpace: "nowrap" }}>
                      {formatDate(quote.created_at)}
                    </td>
                    <td style={{ padding: "18px 20px", verticalAlign: "top", textAlign: "right" }}>
                      {NEXT_STATUSES[quote.status]?.length > 0 && (
                        <button
                          onClick={() => setActionsQuote(quote)}
                          style={{
                            padding: "7px 14px", fontSize: "11px", fontWeight: 500,
                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                            color: "#9ca3af", cursor: "pointer", fontFamily: "'Inter', sans-serif",
                            letterSpacing: "0.06em", textTransform: "uppercase",
                          }}
                        >
                          Actions
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}