"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Failed to fetch report", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  return (
    <DashboardLayout>
      <style>{`
        .page-top { margin-bottom: 24px; }
        .page-top h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 400; }
        .page-top p { font-size: 12px; color: #555; margin-top: 2px; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: #18181F; border-radius: 14px; padding: 18px; border: 1px solid #26263A; }
        .stat-card.accent { border-color: #9B6DFF44; background: #9B6DFF0A; }
        .stat-card.warn { border-color: #FF6B3544; background: #FF6B350A; }
        .stat-icon { width: 32px; height: 32px; border-radius: 9px; background: #1E1E2A; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .stat-icon.purple { background: #9B6DFF22; }
        .stat-icon.orange { background: #FF6B3522; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 26px; color: #fff; font-weight: 500; }
        .stat-num.purple { color: #9B6DFF; }
        .stat-num.orange { color: #FF6B35; }
        .stat-num.green { color: #3DBE72; }
        .stat-label { font-size: 11px; color: #555; margin-top: 4px; font-weight: 300; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .section-title { font-size: 13px; color: #ccc; font-weight: 500; margin-bottom: 14px; }

        .table-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; overflow: hidden; }
        .table-head { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 12px 18px; border-bottom: 1px solid #26263A; }
        .table-head span { font-size: 10px; color: #444; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
        .table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 12px 18px; border-bottom: 1px solid #1E1E2A; align-items: center; }
        .table-row:last-child { border-bottom: none; }
        .book-title { font-size: 13px; color: #ccc; }
        .book-sub { font-size: 11px; color: #555; margin-top: 2px; }
        .cell { font-size: 12px; color: #666; }

        .cat-table-head { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 12px 18px; border-bottom: 1px solid #26263A; }
        .cat-table-head span { font-size: 10px; color: #444; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
        .cat-row { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 12px 18px; border-bottom: 1px solid #1E1E2A; align-items: center; }
        .cat-row:last-child { border-bottom: none; }

        .badge { display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 500; }
        .badge.overdue { background: #FF6B3522; color: #FF6B35; }
        .badge.active { background: #9B6DFF22; color: #9B6DFF; }

        .bar-wrap { display: flex; align-items: center; gap: 8px; }
        .bar-bg { flex: 1; height: 6px; background: #1E1E2A; border-radius: 3px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 3px; background: #9B6DFF; }
        .bar-num { font-size: 11px; color: #666; width: 28px; text-align: right; }

        .empty-state { text-align: center; padding: 32px; color: #444; font-size: 13px; }
        .skeleton { background: #1E1E2A; border-radius: 8px; height: 16px; margin: 8px 0; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="page-top">
        <h1>Reports</h1>
        <p>Library activity overview and analytics</p>
      </div>

      {loading ? (
        <div style={{ padding: "18px" }}>
          {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ marginBottom: "24px", height: "80px" }} />)}
        </div>
      ) : !report ? (
        <div className="empty-state">Failed to load report</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card accent">
              <div className="stat-icon purple">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B6DFF" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
              </div>
              <div className="stat-num purple">{report.stats.totalBooks}</div>
              <div className="stat-label">Total books</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <div className="stat-num green">{report.stats.totalUsers}</div>
              <div className="stat-label">Total users</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <div className="stat-num">{report.stats.totalIssued}</div>
              <div className="stat-label">Total issued</div>
            </div>
            <div className="stat-card warn">
              <div className="stat-icon orange">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div className="stat-num orange">{report.stats.overdueCount}</div>
              <div className="stat-label">Overdue books</div>
            </div>
          </div>

          <div className="two-col">
            <div>
              <div className="section-title">Overdue books</div>
              <div className="table-card">
                <div className="table-head">
                  <span>Book / User</span>
                  <span>Due date</span>
                  <span>Days late</span>
                  <span>Status</span>
                </div>
                {report.overdueBooks.length === 0 ? (
                  <div className="empty-state">No overdue books 🎉</div>
                ) : (
                  report.overdueBooks.map((issue) => {
                    const daysLate = Math.abs(Math.ceil((new Date(issue.dueDate) - new Date()) / (1000 * 60 * 60 * 24)));
                    return (
                      <div key={issue.id} className="table-row">
                        <div>
                          <div className="book-title">{issue.book.title}</div>
                          <div className="book-sub">{issue.user.name}</div>
                        </div>
                        <div className="cell">{new Date(issue.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                        <div className="cell" style={{ color: "#FF6B35" }}>{daysLate}d</div>
                        <span className="badge overdue">Overdue</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <div className="section-title">Books by category</div>
              <div className="table-card">
                <div className="cat-table-head">
                  <span>Category</span>
                  <span>Books</span>
                  <span>Distribution</span>
                </div>
                {report.categoryStats.map((cat) => (
                  <div key={cat.category} className="cat-row">
                    <div className="cell">{cat.category}</div>
                    <div className="cell">{cat._count.category}</div>
                    <div className="bar-wrap">
                      <div className="bar-bg">
                        <div className="bar-fill" style={{ width: `${Math.min((cat._count.category / report.stats.totalBooks) * 100 * 5, 100)}%` }}></div>
                      </div>
                      <div className="bar-num">{cat._count.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="section-title">Most issued books</div>
            <div className="table-card">
              <div className="table-head">
                <span>Book</span>
                <span>Category</span>
                <span>Times issued</span>
                <span>Available</span>
              </div>
              {report.mostIssued.map((book) => (
                <div key={book.id} className="table-row">
                  <div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-sub">{book.author}</div>
                  </div>
                  <div className="cell">{book.category}</div>
                  <div className="cell" style={{ color: "#9B6DFF" }}>{book._count.issuedBooks}x</div>
                  <div className="cell">{book.available} / {book.totalCopies}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}