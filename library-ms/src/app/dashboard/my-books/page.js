"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function MyBooksPage() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ISSUED");

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues/my?status=${statusFilter}`);
      const data = await res.json();
      setIssuedBooks(data.issuedBooks || []);
    } catch (err) {
      console.error("Failed to fetch my books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyBooks(); }, [statusFilter]);

  const getDaysLeft = (dueDate) => {
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return <span style={{ color: "#FF6B35" }}>{Math.abs(days)}d overdue</span>;
    if (days === 0) return <span style={{ color: "#E8C870" }}>Due today</span>;
    return <span style={{ color: "#3DBE72" }}>{days}d left</span>;
  };

  const getStatusBadge = (issue) => {
    if (issue.status === "RETURNED") return <span className="badge returned">Returned</span>;
    const due = new Date(issue.dueDate);
    if (due < new Date()) return <span className="badge overdue">Overdue</span>;
    return <span className="badge active">Active</span>;
  };

  return (
    <DashboardLayout>
      <style>{`
        .page-top { margin-bottom: 24px; }
        .page-top h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 400; }
        .page-top p { font-size: 12px; color: #555; margin-top: 2px; }

        .filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
        .tab { padding: 8px 18px; border-radius: 9px; border: 1px solid #26263A; background: #18181F; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #555; cursor: pointer; transition: all 0.15s; }
        .tab.active { background: #E8763A18; border-color: #E8763A; color: #E8763A; font-weight: 500; }

        .table-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; overflow: hidden; }
        .table-head { display: grid; grid-template-columns: 2.5fr 1.2fr 1fr 1fr 1fr; padding: 12px 18px; border-bottom: 1px solid #26263A; }
        .table-head span { font-size: 10px; color: #444; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
        .table-row { display: grid; grid-template-columns: 2.5fr 1.2fr 1fr 1fr 1fr; padding: 14px 18px; border-bottom: 1px solid #1E1E2A; align-items: center; transition: background 0.15s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #1A1A24; }

        .book-icon-wrap { display: flex; align-items: center; gap: 12px; }
        .book-icon { width: 36px; height: 46px; border-radius: 6px; background: linear-gradient(135deg, #E8763A33, #E8763A11); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .book-title { font-size: 13px; color: #ccc; }
        .book-author { font-size: 11px; color: #555; margin-top: 2px; }
        .cell { font-size: 12px; color: #666; }

        .badge { display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 500; }
        .badge.active { background: #E8763A22; color: #E8763A; }
        .badge.overdue { background: #FF6B3522; color: #FF6B35; }
        .badge.returned { background: #3DBE7222; color: #3DBE72; }

        .empty-state { text-align: center; padding: 64px 18px; color: #444; font-size: 13px; }
        .skeleton { background: #1E1E2A; border-radius: 8px; height: 16px; margin: 8px 0; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="page-top">
        <h1>My Books</h1>
        <p>All your currently issued and returned books</p>
      </div>

      <div className="filter-tabs">
        <button className={`tab ${statusFilter === "ISSUED" ? "active" : ""}`} onClick={() => setStatusFilter("ISSUED")}>Currently Issued</button>
        <button className={`tab ${statusFilter === "RETURNED" ? "active" : ""}`} onClick={() => setStatusFilter("RETURNED")}>Returned</button>
        <button className={`tab ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>All</button>
      </div>

      <div className="table-card">
        <div className="table-head">
          <span>Book</span>
          <span>Category</span>
          <span>Issued</span>
          <span>Due Date</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div style={{ padding: "18px" }}>
            {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ marginBottom: "16px" }} />)}
          </div>
        ) : issuedBooks.length === 0 ? (
          <div className="empty-state">No books found</div>
        ) : (
          issuedBooks.map((issue) => (
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
              <div className="cell">
                <div>{new Date(issue.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                {issue.status === "ISSUED" && <div style={{ marginTop: "2px", fontSize: "11px" }}>{getDaysLeft(issue.dueDate)}</div>}
              </div>
              <div>{getStatusBadge(issue)}</div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}