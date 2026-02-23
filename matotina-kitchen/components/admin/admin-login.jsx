"use client";

import { useState, useEffect } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      if (!res.ok) {
        setError(data.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin-13/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-root {
          min-height: 100vh;
          background: #0f0d0b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .bg-texture {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(ellipse 80% 60% at 10% 90%, rgba(180,120,60,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 10%, rgba(180,120,60,0.08) 0%, transparent 60%);
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(180,120,60,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,120,60,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .card {
          position: relative;
          width: 100%;
          max-width: 420px;
          margin: 24px;
          background: rgba(20,17,14,0.92);
          border: 1px solid rgba(180,120,60,0.25);
          border-radius: 2px;
          padding: 52px 44px 44px;
          box-shadow:
            0 0 0 1px rgba(180,120,60,0.06),
            0 32px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(180,120,60,0.1);
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? "translateY(0)" : "translateY(16px)"};
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: rgba(180,120,60,0.5);
          border-style: solid;
        }
        .corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

        .badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(180,120,60,0.7);
          border: 1px solid rgba(180,120,60,0.2);
          padding: 4px 10px;
          margin-bottom: 20px;
          border-radius: 1px;
        }

        .title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #f0e8d8;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .subtitle {
          font-size: 13px;
          color: rgba(240,232,216,0.35);
          font-weight: 300;
          margin-bottom: 36px;
          letter-spacing: 0.01em;
        }

        .divider {
          width: 32px;
          height: 1px;
          background: rgba(180,120,60,0.4);
          margin-bottom: 32px;
        }

        .field {
          margin-bottom: 20px;
        }

        .label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(240,232,216,0.45);
          margin-bottom: 8px;
        }

        .input-wrap {
          position: relative;
        }

        .input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(180,120,60,0.2);
          border-radius: 1px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #f0e8d8;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .input::placeholder { color: rgba(240,232,216,0.2); }

        .input:focus {
          border-color: rgba(180,120,60,0.55);
          background: rgba(180,120,60,0.04);
        }

        .toggle-pw {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(240,232,216,0.3);
          cursor: pointer;
          font-size: 13px;
          padding: 4px;
          transition: color 0.2s;
        }
        .toggle-pw:hover { color: rgba(180,120,60,0.7); }

        .error {
          font-size: 12px;
          color: #e07070;
          margin-bottom: 16px;
          padding: 10px 14px;
          background: rgba(224,112,112,0.07);
          border: 1px solid rgba(224,112,112,0.2);
          border-radius: 1px;
          letter-spacing: 0.01em;
        }

        .btn {
          width: 100%;
          padding: 13px;
          background: rgba(180,120,60,0.15);
          border: 1px solid rgba(180,120,60,0.45);
          color: #c8955a;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          position: relative;
          overflow: hidden;
          margin-top: 8px;
        }

        .btn:hover:not(:disabled) {
          background: rgba(180,120,60,0.28);
          color: #e0aa70;
          border-color: rgba(180,120,60,0.7);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 1.5px solid rgba(180,120,60,0.3);
          border-top-color: #c8955a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .footer {
          margin-top: 32px;
          text-align: center;
          font-size: 11px;
          color: rgba(240,232,216,0.2);
          letter-spacing: 0.08em;
        }

        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: rgba(180,120,60,0.4);
          border-radius: 50%;
          margin: 0 8px;
          vertical-align: middle;
        }
      `}</style>

      <div className="admin-root">
        <div className="bg-texture" />
        <div className="grid-lines" />

        <div className="card">
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          <div className="badge">Restricted Access</div>
          <h1 className="title">Admin Portal</h1>
          <p className="subtitle">Matotina&apos;s Kitchen — Staff only</p>
          <div className="divider" />

          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="label" htmlFor="username">Username</label>
              <input
                id="username"
                className="input"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  className="input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: "44px" }}
                  required
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>
            </div>

            {error && <div className="error">⚠ {error}</div>}

            <button className="btn" type="submit" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <div className="footer">
            <span>Secure Login</span>
            <span className="dot" />
            <span>Admin-13</span>
          </div>
        </div>
      </div>
    </>
  );
}