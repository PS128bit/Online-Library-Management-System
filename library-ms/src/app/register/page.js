"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);

  const checkStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(val.length === 0 ? 0 : score);
  };

  const getSegmentClass = (index) => {
    if (strength === 0 || index >= strength) return "strength-seg";
    if (strength <= 1) return "strength-seg weak";
    if (strength <= 2) return "strength-seg medium";
    return "strength-seg strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .register-page {
          font-family: 'DM Sans', sans-serif;
          background: #F6FAF4;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .card {
          display: flex;
          width: 900px;
          min-height: 620px;
          background: #fff;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid #E2EDE0;
          box-shadow: 0 8px 48px rgba(120,160,110,0.09);
        }

        /* Left panel */
        .left {
          width: 32%;
          background: linear-gradient(160deg, #EEF5E8 0%, #DCE8C8 100%);
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
          background: rgba(160,195,120,0.15);
          top: -80px;
          right: -100px;
        }

        .left::after {
          content: '';
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(160,195,120,0.10);
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
          background: #7AAD5A;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          color: #2E4A1E;
          font-weight: 500;
          line-height: 1.2;
        }

        .logo-text span {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 300;
          color: #6A8A52;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .left-content { z-index: 1; }

        .left-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #1E3412;
          font-weight: 400;
          line-height: 1.35;
          margin-bottom: 12px;
        }

        .left-content h2 em {
          font-style: italic;
          color: #7AAD5A;
        }

        .left-content p {
          font-size: 12.5px;
          color: #4A6A38;
          line-height: 1.75;
          font-weight: 300;
        }

        .perks {
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1;
        }

        .perk {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.50);
          border-radius: 12px;
          padding: 11px 14px;
          border: 1px solid rgba(120,180,90,0.18);
        }

        .perk-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7AAD5A;
          flex-shrink: 0;
        }

        .perk-text {
          font-size: 12px;
          color: #2E4A1E;
          font-weight: 300;
        }

        /* Right panel */
        .right {
          flex: 1;
          padding: 48px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .right h1 {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 400;
          color: #1A2E10;
          margin-bottom: 6px;
        }

        .right p.sub {
          font-size: 13.5px;
          color: #6A8A52;
          font-weight: 300;
          margin-bottom: 32px;
        }

        .name-row {
          display: flex;
          gap: 16px;
        }

        .name-row .field { flex: 1; }

        .field { margin-bottom: 20px; }

        .field label {
          display: block;
          font-size: 11.5px;
          color: #4A6A38;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .field input {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid #E2EDE0;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1A2E10;
          background: #F6FAF4;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          font-weight: 300;
        }

        .field input:focus {
          border-color: #7AAD5A;
          background: #fff;
        }

        .field input::placeholder { color: #ACC4A0; }

        .strength-bar {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }

        .strength-seg {
          height: 3px;
          flex: 1;
          border-radius: 2px;
          background: #E2EDE0;
          transition: background 0.3s;
        }

        .strength-seg.weak { background: #E87070; }
        .strength-seg.medium { background: #E8C870; }
        .strength-seg.strong { background: #7AAD5A; }

        .terms {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 24px;
          margin-top: 4px;
        }

        .terms input[type=checkbox] {
          margin-top: 3px;
          accent-color: #7AAD5A;
          flex-shrink: 0;
          cursor: pointer;
        }

        .terms label {
          font-size: 12.5px;
          color: #6A8A52;
          font-weight: 300;
          line-height: 1.5;
          cursor: pointer;
        }

        .terms label a {
          color: #7AAD5A;
          text-decoration: none;
          font-weight: 500;
        }

        .terms label a:hover { text-decoration: underline; }

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

        .btn-register {
          width: 100%;
          padding: 15px;
          background: #2E4A1E;
          color: #EEF5E8;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 22px;
        }

        .btn-register:hover { background: #3D6028; }
        .btn-register:active { transform: scale(0.99); }
        .btn-register:disabled { opacity: 0.6; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .divider-line { flex: 1; height: 1px; background: #E2EDE0; }

        .divider span {
          font-size: 12px;
          color: #ACC4A0;
          font-weight: 300;
        }

        .login-link {
          text-align: center;
          font-size: 13px;
          color: #6A8A52;
          font-weight: 300;
        }

        .login-link a {
          color: #7AAD5A;
          text-decoration: none;
          font-weight: 500;
        }

        .login-link a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .card { flex-direction: column; width: 100%; }
          .left { width: 100%; min-height: 200px; }
          .right { padding: 36px 28px; }
          .name-row { flex-direction: column; gap: 0; }
        }
      `}</style>

      <div className="register-page">
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
              <h2>Join a world of <em>endless</em> reading.</h2>
              <p>Create your free account and get instant access to our entire collection of books and resources.</p>
            </div>

            <div className="perks">
              <div className="perk">
                <div className="perk-dot"></div>
                <div className="perk-text">Browse 4,200+ books instantly</div>
              </div>
              <div className="perk">
                <div className="perk-dot"></div>
                <div className="perk-text">Track your issued books</div>
              </div>
              <div className="perk">
                <div className="perk-dot"></div>
                <div className="perk-text">Get due date reminders</div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="right">
            <h1>Create your account</h1>
            <p className="sub">Free forever — no credit card needed</p>

            <form onSubmit={handleSubmit}>
              <div className="name-row">
                <div className="field">
                  <label htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Muhammad"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Anas"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkStrength(e.target.value);
                  }}
                  required
                />
                <div className="strength-bar">
                  <div className={getSegmentClass(0)}></div>
                  <div className={getSegmentClass(1)}></div>
                  <div className={getSegmentClass(2)}></div>
                  <div className={getSegmentClass(3)}></div>
                </div>
              </div>

              <div className="terms">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="terms">
                  I agree to the <Link href="/terms">Terms of Service</Link> and{" "}
                  <Link href="/privacy">Privacy Policy</Link>
                </label>
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button className="btn-register" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line"></div>
              <span>already a member?</span>
              <div className="divider-line"></div>
            </div>

            <div className="login-link">
              Already have an account?{" "}
              <Link href="/login">Sign in</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}