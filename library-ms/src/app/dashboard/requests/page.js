"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import Link from "next/link";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/issues/my?status=ISSUED");
      const data = await res.json();
      setRequests(data.issuedBooks || []);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const getDaysLeft = (dueDate) => {
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return <span style={{ color: "#FF6B35" }}>{Math.abs(days)} days overdue</span>;
    if (days === 0) return <span style={{ color: "#E8C870" }}>Due today</span>;
    return <span style={{ color: "#3DBE72" }}>{days} days left</span>;
  };

  return (
    <DashboardLayout>
      <style>{`
        .page-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .page-top h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 400; }
        .page-top p { font-size: 12px; color: #555; margin-top: 2px; }

        .browse-btn { display: flex; align-items: center; gap: 8px; background: #E8763A; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; text-decoration: none; transition: background 0.15s; }
        .browse-btn:hover { background: #D4682E; }

        .requests-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }

        .request-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; padding: 20px; display: flex; flex-direction: column; gap: 14px; transition: border-color 0.15s; }
        .request-card:hover { border-color: #E8763A44; }
        .request-card.overdue { border-color: #FF6B3544; background: #FF6B350A; }

        .card-top { display: flex; align-items: flex-start; gap: 12px; }
        .card-icon { width: 40px; height: 52px; border-radius: 6px; background: #E8763A18; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .card-title { font-size: 14px; color: #ccc; font-weight: 500; line-height: 1.3; }
        .card-author { font-size: 12px; color: #555; margin-top: 3px; }

        .card-meta { display: flex; flex-direction: column; gap: 6px; }
        .meta-row { display: flex; align-items: center; justify-content: space-between; }
        .meta-label { font-size: 11px; color: #444; text-transform: uppercase; letter-spacing: 0.05em; }
        .meta-value { font-size: 12px; color: #888; }

        .progress-bar { height: 4px; background: #1E1E2A; border-radius: 2px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }

        .empty-state { text-align: center; padding: 80px 18px; color: #444; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 20px; color: #555; margin-bottom: 8px; }
        .empty-sub { font-size: 13px; color: #444; margin-bottom: 24px; }

        .skeleton-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; height: 180px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="page-top">
        <div>
          <h1>My Requests</h1>
          <p>Books you currently have issued</p>
        </div>
        <Link href="/dashboard/browse" className="browse-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Browse Books
        </Link>
      </div>

      {loading ? (
        <div className="requests-grid">
          {[1,2,3].map((i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">No active requests</div>
          <div className="empty-sub">You don't have any books issued right now.</div>
          <Link href="/dashboard/browse" className="browse-btn" style={{ display: "inline-flex" }}>Browse and request a book</Link>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((issue) => {
            const due = new Date(issue.dueDate);
            const issued = new Date(issue.issuedAt);
            const total = due - issued;
            const elapsed = new Date() - issued;
            const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
            const isOverdue = due < new Date();
            const progressColor = isOverdue ? "#FF6B35" : progress > 75 ? "#E8C870" : "#3DBE72";

            return (
              <div key={issue.id} className={`request-card ${isOverdue ? "overdue" : ""}`}>
                <div className="card-top">
                  <div className="card-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8763A" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="card-title">{issue.book.title}</div>
                    <div className="card-author">{issue.book.author}</div>
                  </div>
                </div>

                <div className="card-meta">
                  <div className="meta-row">
                    <span className="meta-label">Issued</span>
                    <span className="meta-value">{issued.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Due</span>
                    <span className="meta-value">{due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Time left</span>
                    <span className="meta-value">{getDaysLeft(issue.dueDate)}</span>
                  </div>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%`, background: progressColor }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}