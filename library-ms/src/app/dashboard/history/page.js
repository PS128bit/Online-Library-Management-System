"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues/history?search=${search}`);
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [search]);

  return (
    <DashboardLayout>
      <style>{`
        .page-top { margin-bottom: 24px; }
        .page-top h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 400; }
        .page-top p { font-size: 12px; color: #555; margin-top: 2px; }

        .search-bar { display: flex; align-items: center; gap: 8px; background: #18181F; border: 1px solid #26263A; border-radius: 10px; padding: 10px 14px; margin-bottom: 20px; }
        .search-bar input { background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #888; width: 100%; }
        .search-bar input::placeholder { color: #444; }

        .table-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; overflow: hidden; }
        .table-head { display: grid; grid-template-columns: 2.5fr 1.2fr 1fr 1fr 1fr; padding: 12px 18px; border-bottom: 1px solid #26263A; }
        .table-head span { font-size: 10px; color: #444; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
        .table-row { display: grid; grid-template-columns: 2.5fr 1.2fr 1fr 1fr 1fr; padding: 14px 18px; border-bottom: 1px solid #1E1E2A; align-items: center; transition: background 0.15s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #1A1A24; }

        .book-icon-wrap { display: flex; align-items: center; gap: 12px; }
        .book-icon { width: 36px; height: 46px; border-radius: 6px; background: #E8763A11; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .book-title { font-size: 13px; color: #ccc; }
        .book-author { font-size: 11px; color: #555; margin-top: 2px; }
        .cell { font-size: 12px; color: #666; }

        .badge { display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 500; }
        .badge.returned { background: #3DBE7222; color: #3DBE72; }
        .badge.overdue { background: #FF6B3522; color: #FF6B35; }
        .badge.active { background: #E8763A22; color: #E8763A; }

        .empty-state { text-align: center; padding: 64px 18px; color: #444; font-size: 13px; }
        .skeleton { background: #1E1E2A; border-radius: 8px; height: 16px; margin: 8px 0; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="page-top">
        <h1>History</h1>
        <p>Your complete book borrowing history</p>
      </div>

      <div className="search-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input placeholder="Search by book title..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table-card">
        <div className="table-head">
          <span>Book</span>
          <span>Category</span>
          <span>Issued</span>
          <span>Returned</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div style={{ padding: "18px" }}>
            {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ marginBottom: "16px" }} />)}
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">No borrowing history yet</div>
        ) : (
          history.map((issue) => {
            const isOverdue = issue.status === "RETURNED" && new Date(issue.returnedAt) > new Date(issue.dueDate);
            return (
              <div key={issue.id} className="table-row">
                <div className="book-icon-wrap">
                  <div className="book-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8763A" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="book-title">{issue.book.title}</div>
                    <div className="book-author">{issue.book.author}</div>
                  </div>
                </div>
                <div className="cell">{issue.book.category}</div>
                <div className="cell">{new Date(issue.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                <div className="cell">{issue.returnedAt ? new Date(issue.returnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</div>
                <div>
                  {issue.status === "RETURNED"
                    ? <span className={`badge ${isOverdue ? "overdue" : "returned"}`}>{isOverdue ? "Late return" : "Returned"}</span>
                    : <span className="badge active">Active</span>
                  }
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}