"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];
const COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#3b82f6"];

// ── Inner component that uses useSearchParams ─────────────────
function ReviewForm() {
  const searchParams = useSearchParams();
  const token        = searchParams.get("token");

  const [booking, setBooking]       = useState(null);
  const [status, setStatus]         = useState("loading");
  const [rating, setRating]         = useState(0);
  const [hovered, setHovered]       = useState(0);
  const [comment, setComment]       = useState("");
  const [name, setName]             = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const textareaRef                 = useRef(null);

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    const validate = async () => {
      try {
        const res = await fetch(`/api/reviews/validate?token=${token}`);
        if (!res.ok) { setStatus("invalid"); return; }
        const data = await res.json();
        setBooking(data);
        setName(data.name || "");
        setStatus("valid");
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (!comment.trim()) { setError("Please write a short review."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, rating, comment }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setStatus("submitted");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hovered || rating;

  return (
    <div className="review-card">
      <div className="review-logo">
        <span className="review-logo-dot" />
        Matotina&apos;s Kitchen
      </div>

      <div className="review-logo">
  <span className="review-logo-dot" />
  Matotina&apos;s Kitchen
</div>

{/* Back button */}
<button
  onClick={() => window.history.back()}
  style={{
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "none", border: "none", cursor: "pointer",
    color: "#6b7280", fontSize: "13px", padding: "0",
    marginBottom: "24px", fontFamily: "'Outfit', sans-serif",
    transition: "color 0.2s",
  }}
  onMouseEnter={e => e.currentTarget.style.color = "#9ca3af"}
  onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
  Back
</button>

      {/* Loading */}
      {status === "loading" && (
        <div className="state-wrap">
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Validating your link...</p>
          <div className="loading-dots">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        </div>
      )}

      {/* Invalid */}
      {status === "invalid" && (
        <div className="state-wrap">
          <div className="state-icon" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </div>
          <h2 className="state-title">Invalid Link</h2>
          <p className="state-sub">This review link is invalid or has already been used. Please check your email for the correct link.</p>
        </div>
      )}

      {/* Form */}
      {status === "valid" && (
        <>
          <h1 className="review-heading">How was your experience?</h1>
          <p className="review-sub">
            Hi <strong>{booking?.name || "there"}</strong>, we'd love to hear about your event. Your honest feedback helps us improve and helps others choose with confidence.
          </p>
          <div className="review-divider" />

          <div className="stars-label">Your Rating</div>
          <div className="stars-wrap">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="star-btn"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`Rate ${star} stars`}
              >
                <svg className="star-svg" width="40" height="40" viewBox="0 0 24 24">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={star <= activeRating ? (COLORS[activeRating - 1] || "#facc15") : "transparent"}
                    stroke={star <= activeRating ? (COLORS[activeRating - 1] || "#facc15") : "#374151"}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
          <div className="stars-feedback" style={{ color: activeRating ? COLORS[activeRating - 1] : "#374151" }}>
            {activeRating ? LABELS[activeRating - 1] : "Tap a star to rate"}
          </div>

          <div className="review-field">
            <label className="review-label">Your Name</label>
            <input className="review-input" placeholder="How should we credit your review?" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="review-field">
            <label className="review-label">Your Review</label>
            <textarea ref={textareaRef} className="review-textarea" placeholder="Tell us about your experience — the food, the service, the event..." value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} />
            <div className="char-count">{comment.length} / 500</div>
          </div>

          {error && <div className="review-error">⚠ {error}</div>}

          <button className="review-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting && <span className="btn-spinner" />}
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </>
      )}

      {/* Success */}
      {status === "submitted" && (
        <div className="success-wrap">
          <div className="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h2 className="success-title">Thank you, {name || "friend"}!</h2>
          <p className="success-sub">Your review has been submitted. We truly appreciate you taking the time — it means a lot to our team and helps future clients feel confident choosing Matotina's Kitchen.</p>
        </div>
      )}
    </div>
  );
}

// ── Suspense fallback ─────────────────────────────────────────
function ReviewFallback() {
  return (
    <div style={{ width: "100%", maxWidth: "520px", background: "#0f1117", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "48px 44px", display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: "6px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ width: "8px", height: "8px", background: "#3b82f6", borderRadius: "50%", animation: `bounce 1.2s ease ${(i - 1) * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────
export default function ReviewPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .review-root { min-height: 100vh; background: #08090d; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; padding: 32px 20px; position: relative; overflow: hidden; }
        .review-bg-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%); top: -100px; right: -100px; pointer-events: none; }
        .review-bg-glow-2 { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(250,204,21,0.05) 0%, transparent 70%); bottom: -80px; left: -80px; pointer-events: none; }
        .review-card { position: relative; width: 100%; max-width: 520px; background: #0f1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 48px 44px; box-shadow: 0 40px 100px rgba(0,0,0,0.6); animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes cardIn { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .review-logo { font-family: 'DM Serif Display', serif; font-size: 15px; color: #3b82f6; letter-spacing: 0.02em; margin-bottom: 32px; display: flex; align-items: center; gap: 8px; }
        .review-logo-dot { width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; }
        .review-heading { font-family: 'DM Serif Display', serif; font-size: 30px; color: #ffffff; line-height: 1.25; margin-bottom: 10px; }
        .review-sub { font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 36px; font-weight: 300; }
        .review-sub strong { color: #9ca3af; font-weight: 500; }
        .review-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 32px; }
        .stars-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7280; font-weight: 500; margin-bottom: 14px; }
        .stars-wrap { display: flex; gap: 10px; margin-bottom: 10px; }
        .star-btn { background: none; border: none; cursor: pointer; padding: 0; transition: transform 0.15s; line-height: 1; }
        .star-btn:hover { transform: scale(1.15); }
        .star-btn:active { transform: scale(0.95); }
        .star-svg { display: block; transition: all 0.15s; }
        .stars-feedback { font-size: 13px; font-weight: 500; min-height: 20px; margin-bottom: 28px; transition: color 0.2s; }
        .review-field { margin-bottom: 20px; }
        .review-label { display: block; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7280; font-weight: 500; margin-bottom: 8px; }
        .review-input, .review-textarea { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; padding: 12px 16px; font-size: 14px; font-family: 'Outfit', sans-serif; color: #ffffff; outline: none; transition: border-color 0.2s, background 0.2s; box-sizing: border-box; }
        .review-input::placeholder, .review-textarea::placeholder { color: #374151; }
        .review-input:focus, .review-textarea:focus { border-color: rgba(59,130,246,0.5); background: rgba(59,130,246,0.04); }
        .review-textarea { height: 120px; resize: none; }
        .char-count { text-align: right; font-size: 11px; color: #374151; margin-top: 6px; }
        .review-error { font-size: 12px; color: #f87171; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        .review-btn { width: 100%; padding: 14px; background: #3b82f6; border: none; color: #ffffff; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s, transform 0.1s; margin-top: 8px; }
        .review-btn:hover:not(:disabled) { background: #2563eb; }
        .review-btn:active:not(:disabled) { transform: scale(0.99); }
        .review-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 8px; vertical-align: middle; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .success-wrap { text-align: center; padding: 20px 0; }
        .success-icon { width: 72px; height: 72px; border-radius: 50%; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .success-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: #ffffff; margin-bottom: 12px; }
        .success-sub { font-size: 14px; color: #6b7280; line-height: 1.6; font-weight: 300; }
        .state-wrap { text-align: center; padding: 20px 0; }
        .state-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .state-title { font-family: 'DM Serif Display', serif; font-size: 24px; color: #ffffff; margin-bottom: 10px; }
        .state-sub { font-size: 14px; color: #6b7280; line-height: 1.6; }
        .loading-dots { display: flex; gap: 6px; justify-content: center; margin-top: 24px; }
        .loading-dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; animation: bounce 1.2s ease infinite; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>

      <div className="review-root">
        <div className="review-bg-glow" />
        <div className="review-bg-glow-2" />
        <Suspense fallback={<ReviewFallback />}>
          <ReviewForm />
        </Suspense>
      </div>
    </>
  );
}