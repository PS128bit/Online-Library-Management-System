"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .login-page {
          font-family: 'DM Sans', sans-serif;
          background: #FAF8F5;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .card {
          display: flex;
          width: 900px;
          min-height: 580px;
          background: #fff;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid #EDE9E2;
          box-shadow: 0 8px 48px rgba(180,160,120,0.10);
        }

        /* Left panel */
        .left {
          width: 32%;
          background: linear-gradient(160deg, #F5EFE6 0%, #EDE3D4 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 32px;
          position: relative;
          overflow: hidden;
        }

        .left::before {
          content: '';
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: rgba(210,185,145,0.18);
          top: -80px;
          right: -100px;
        }

        .left::after {
          content: '';
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(210,185,145,0.13);
          bottom: -40px;
          left: -60px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: #C8A96E;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          color: #5C4A2A;
          font-weight: 500;
          line-height: 1.2;
        }

        .logo-text span {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 300;
          color: #9C8060;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .left-content { z-index: 1; }

        .left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #3D2E14;
          font-weight: 400;
          line-height: 1.35;
          margin-bottom: 12px;
        }

        .left-content h2 em {
          font-style: italic;
          color: #C8A96E;
        }

        .left-content p {
          font-size: 12.5px;
          color: #7A6245;
          line-height: 1.75;
          font-weight: 300;
        }

        .stat-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1;
        }

        .stat {
          background: rgba(255,255,255,0.55);
          border-radius: 14px;
          padding: 12px 16px;
          border: 1px solid rgba(200,169,110,0.2);
        }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #3D2E14;
          font-weight: 500;
        }

        .stat-label {
          font-size: 10.5px;
          color: #9C8060;
          font-weight: 300;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Right panel */
        .right {
          flex: 1;
          padding: 56px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .right h1 {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 400;
          color: #2C1F0E;
          margin-bottom: 6px;
        }

        .right p.sub {
          font-size: 13.5px;
          color: #9C8060;
          font-weight: 300;
          margin-bottom: 36px;
        }

        .role-pills {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
        }

        .pill {
          flex: 1;
          padding: 11px;
          border-radius: 10px;
          border: 1px solid #EDE9E2;
          text-align: center;
          font-size: 13px;
          color: #9C8060;
          cursor: pointer;
          background: #FAF8F5;
          font-weight: 400;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .pill.active {
          background: #FBF6EE;
          border-color: #C8A96E;
          color: #5C4A2A;
          font-weight: 500;
        }

        .field { margin-bottom: 22px; }

        .field label {
          display: block;
          font-size: 11.5px;
          color: #7A6245;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .field input {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid #EDE9E2;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #2C1F0E;
          background: #FAF8F5;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          font-weight: 300;
        }

        .field input:focus {
          border-color: #C8A96E;
          background: #fff;
        }

        .field input::placeholder { color: #C4B49A; }

        .forgot {
          text-align: right;
          margin-top: -12px;
          margin-bottom: 28px;
        }

        .forgot a {
          font-size: 12px;
          color: #C8A96E;
          text-decoration: none;
        }

        .forgot a:hover { text-decoration: underline; }

        .error-msg {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #B91C1C;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          margin-bottom: 20px;
          font-weight: 300;
        }

        .btn-login {
          width: 100%;
          padding: 15px;
          background: #2C1F0E;
          color: #F5EFE6;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 24px;
        }

        .btn-login:hover { background: #3D2E14; }
        .btn-login:active { transform: scale(0.99); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .divider-line { flex: 1; height: 1px; background: #EDE9E2; }

        .divider span {
          font-size: 12px;
          color: #C4B49A;
          font-weight: 300;
        }

        .register-link {
          text-align: center;
          font-size: 13px;
          color: #9C8060;
          font-weight: 300;
        }

        .register-link a {
          color: #C8A96E;
          text-decoration: none;
          font-weight: 500;
        }

        .register-link a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .card { flex-direction: column; width: 100%; }
          .left { width: 100%; min-height: 200px; }
          .stat-row { flex-direction: row; }
          .right { padding: 36px 28px; }
        }
      `}</style>

      <div className="login-page">
        <div className="card">

          {/* Left Panel */}
          <div className="left">
            <div className="logo">
              <div className="logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
              </div>
              <div className="logo-text">
                Libra
                <span>Library Management</span>
              </div>
            </div>

            <div className="left-content">
              <h2>Your gateway to <em>knowledge</em> awaits.</h2>
              <p>Access thousands of books, manage your reading journey, and discover new worlds — all in one place.</p>
            </div>

            <div className="stat-row">
              <div className="stat">
                <div className="stat-num">4,200+</div>
                <div className="stat-label">Books available</div>
              </div>
              <div className="stat">
                <div className="stat-num">890</div>
                <div className="stat-label">Active members</div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="right">
            <h1>Welcome back</h1>
            <p className="sub">Sign in to continue your reading journey</p>

            <div className="role-pills">
              <button
                className={`pill ${role === "STUDENT" ? "active" : ""}`}
                onClick={() => setRole("STUDENT")}
                type="button"
              >
                Student
              </button>
              <button
                className={`pill ${role === "ADMIN" ? "active" : ""}`}
                onClick={() => setRole("ADMIN")}
                type="button"
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="forgot">
                <Link href="/forgot-password">Forgot password?</Link>
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button className="btn-login" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line"></div>
              <span>new here?</span>
              <div className="divider-line"></div>
            </div>

            <div className="register-link">
              Don&apos;t have an account?{" "}
              <Link href="/register">Create one free</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}