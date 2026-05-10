"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); }
      else { setSuccess(true); setTimeout(() => router.push("/login"), 3000); }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #FAF8F5; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .card { background: #fff; border-radius: 20px; border: 1px solid #EDE9E2; padding: 40px; width: 420px; box-shadow: 0 8px 40px rgba(180,160,120,0.10); }
        .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; text-decoration: none; }
        .logo-icon { width: 32px; height: 32px; background: #C8A96E; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
        h1 { font-family: 'Playfair Display', serif; font-size: 24px; color: #2C1F0E; font-weight: 400; margin-bottom: 6px; }
        .sub { font-size: 13px; color: #9C8060; font-weight: 300; margin-bottom: 28px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 11px; color: #7A6245; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
        .field input { width: 100%; padding: 13px 16px; border: 1px solid #EDE9E2; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #2C1F0E; background: #FAF8F5; outline: none; }
        .field input:focus { border-color: #C8A96E; }
        .error { background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C; border-radius: 10px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px; }
        .success { background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; border-radius: 10px; padding: 16px; font-size: 13px; }
        .btn { width: 100%; padding: 14px; background: #2C1F0E; color: #F5EFE6; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; margin: 20px 0 16px; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .back { text-align: center; font-size: 13px; color: #9C8060; }
        .back a { color: #C8A96E; text-decoration: none; font-weight: 500; }
      `}</style>

      <div className="card">
        <Link href="/" className="logo">
          <div className="logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#2C1F0E", fontWeight: 500 }}>Libra</span>
        </Link>

        {success ? (
          <div className="success">✓ Password reset successful! Redirecting to login...</div>
        ) : !token ? (
          <div className="error">Invalid or missing reset token. Please request a new link.</div>
        ) : (
          <>
            <h1>Reset password</h1>
            <p className="sub">Enter your new password below.</p>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>New password</label>
                <input type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="field">
                <label>Confirm password</label>
                <input type="password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              {error && <div className="error">{error}</div>}
              <button className="btn" type="submit" disabled={loading}>{loading ? "Resetting..." : "Reset password"}</button>
            </form>
          </>
        )}
        <div className="back"><Link href="/login">← Back to login</Link></div>
      </div>
    </>
  );
}