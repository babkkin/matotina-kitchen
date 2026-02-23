"use client";

import { useState, useEffect } from "react";

export default function AdminLogin() {
  const [username, setUsername]     = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Invalid credentials."); setLoading(false); return; }
      window.location.href = "/admin-13/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-root {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .login-glow {
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          top: -100px; left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .login-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .login-card {
          position: relative;
          width: 100%; max-width: 420px;
          margin: 24px;
          background: #111118;
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 8px;
          padding: 48px 40px 40px;
          box-shadow: 0 0 0 1px rgba(59,130,246,0.05), 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05);
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? "translateY(0)" : "translateY(16px)"};
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .login-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; color: #3b82f6;
          border: 1px solid rgba(59,130,246,0.25);
          padding: 4px 10px; border-radius: 20px; margin-bottom: 20px;
        }
        .login-badge-dot { width: 5px; height: 5px; background: #3b82f6; border-radius: 50%; }
        .login-title { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
        .login-sub { font-size: 13px; color: #6b7280; margin-bottom: 32px; }
        .login-divider { width: 32px; height: 2px; background: #3b82f6; border-radius: 2px; margin-bottom: 32px; }
        .login-field { margin-bottom: 18px; }
        .login-label { display: block; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }
        .login-input-wrap { position: relative; }
        .login-input {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px; padding: 12px 16px; font-size: 14px; font-family: 'Inter', sans-serif;
          color: #ffffff; outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .login-input::placeholder { color: #4b5563; }
        .login-input:focus { border-color: rgba(59,130,246,0.6); background: rgba(59,130,246,0.05); }
        .login-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6b7280; cursor: pointer; font-size: 12px; font-family: 'Inter', sans-serif; letter-spacing: 0.05em; padding: 4px; transition: color 0.2s; }
        .login-toggle:hover { color: #3b82f6; }
        .login-error { font-size: 12px; color: #f87171; margin-bottom: 16px; padding: 10px 14px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 6px; }
        .login-btn {
          width: 100%; padding: 13px;
          background: #3b82f6; border: none;
          color: #ffffff; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          letter-spacing: 0.02em; cursor: pointer; border-radius: 6px;
          transition: background 0.2s, transform 0.1s; margin-top: 8px;
        }
        .login-btn:hover:not(:disabled) { background: #2563eb; }
        .login-btn:active:not(:disabled) { transform: scale(0.99); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 8px; vertical-align: middle; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-footer { margin-top: 28px; text-align: center; font-size: 11px; color: #374151; letter-spacing: 0.06em; }
      `}</style>

      <div className="login-root">
        <div className="login-glow" />
        <div className="login-grid" />
        <div className="login-card">
          <div className="login-badge"><span className="login-badge-dot" /> Restricted Access</div>
          <h1 className="login-title">Admin Portal</h1>
          <p className="login-sub">Matotina's Kitchen — Staff only</p>
          <div className="login-divider" />

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label className="login-label">Username</label>
              <input className="login-input" type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
            </div>
            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <input className="login-input" type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: "52px" }} autoComplete="current-password" required />
                <button type="button" className="login-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "hide" : "show"}</button>
              </div>
            </div>
            {error && <div className="login-error">⚠ {error}</div>}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading && <span className="login-spinner" />}
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">Admin-13 · Secure Login</div>
        </div>
      </div>
    </>
  );
}