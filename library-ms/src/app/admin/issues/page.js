"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, overdue: 0, returned: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [issueForm, setIssueForm] = useState({ userId: "", bookId: "", dueDate: "" });
  const [issueError, setIssueError] = useState("");
  const [issueSaving, setIssueSaving] = useState(false);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search, status: statusFilter });
      const res = await fetch(`/api/admin/issues?${params}`);
      const data = await res.json();
      setIssues(data.issues || []);
      setStats(data.stats || { total: 0, active: 0, overdue: 0, returned: 0 });
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksAndUsers = async () => {
    try {
      const [booksRes, usersRes] = await Promise.all([
        fetch("/api/admin/books?page=1&search=&category=all&status=available"),
        fetch("/api/admin/users?page=1&search=&role=STUDENT&status=active"),
      ]);
      const booksData = await booksRes.json();
      const usersData = await usersRes.json();
      setBooks(booksData.books || []);
      setUsers(usersData.users || []);
    } catch (err) {
      console.error("Failed to fetch books/users", err);
    }
  };

  useEffect(() => { fetchIssues(); }, [page, search, statusFilter]);

  const handleReturn = async (id) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/issues", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "RETURNED" }),
      });
      if (res.ok) fetchIssues();
    } catch (err) {
      console.error("Failed to mark return", err);
    } finally {
      setActionLoading(null);
    }
  };

  const openIssueModal = async () => {
    await fetchBooksAndUsers();
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 14);
    setIssueForm({ userId: "", bookId: "", dueDate: defaultDue.toISOString().split("T")[0] });
    setIssueError("");
    setShowIssueModal(true);
  };

  const handleIssueBook = async () => {
    if (!issueForm.userId || !issueForm.bookId || !issueForm.dueDate) {
      setIssueError("All fields are required.");
      return;
    }
    setIssueSaving(true);
    setIssueError("");
    try {
      const res = await fetch("/api/admin/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueForm),
      });
      const data = await res.json();
      if (!res.ok) { setIssueError(data.error || "Something went wrong."); return; }
      setShowIssueModal(false);
      fetchIssues();
    } catch (err) {
      setIssueError("Network error. Please try again.");
    } finally {
      setIssueSaving(false);
    }
  };

  const getStatusBadge = (issue) => {
    if (issue.status === "RETURNED") return <span className="badge returned">Returned</span>;
    const due = new Date(issue.dueDate);
    if (due < new Date()) return <span className="badge overdue">Overdue</span>;
    return <span className="badge active">Active</span>;
  };

  const getDaysLeft = (issue) => {
    if (issue.status === "RETURNED") return "—";
    const due = new Date(issue.dueDate);
    const days = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return <span style={{ color: "#FF6B35" }}>{Math.abs(days)}d overdue</span>;
    if (days === 0) return <span style={{ color: "#E8C870" }}>Due today</span>;
    return <span style={{ color: "#3DBE72" }}>{days}d left</span>;
  };

  return (
    <DashboardLayout>
      <style>{`
        .page-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .page-top h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 400; }
        .page-top p { font-size: 12px; color: #555; margin-top: 2px; }

        .issue-btn { display: flex; align-items: center; gap: 8px; background: #9B6DFF; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
        .issue-btn:hover { background: #8A5EE8; }

        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
        .mini-stat { background: #18181F; border-radius: 12px; padding: 14px 16px; border: 1px solid #26263A; }
        .mini-stat.accent { border-color: #9B6DFF44; background: #9B6DFF0A; }
        .mini-stat.warn { border-color: #FF6B3544; background: #FF6B350A; }
        .mini-num { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 500; }
        .mini-num.purple { color: #9B6DFF; }
        .mini-num.orange { color: #FF6B35; }
        .mini-num.green { color: #3DBE72; }
        .mini-label { font-size: 11px; color: #555; margin-top: 3px; }

        .filters { display: flex; gap: 10px; margin-bottom: 20px; }
        .search-bar { flex: 1; display: flex; align-items: center; gap: 8px; background: #18181F; border: 1px solid #26263A; border-radius: 10px; padding: 10px 14px; }
        .search-bar input { background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #888; width: 100%; }
        .search-bar input::placeholder { color: #444; }
        .filter-select { background: #18181F; border: 1px solid #26263A; border-radius: 10px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #666; outline: none; cursor: pointer; }
        .filter-select option { background: #18181F; }

        .table-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; overflow: hidden; }
        .table-head { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1fr; padding: 12px 18px; border-bottom: 1px solid #26263A; }
        .table-head span { font-size: 10px; color: #444; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
        .table-row { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1fr; padding: 13px 18px; border-bottom: 1px solid #1E1E2A; align-items: center; transition: background 0.15s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #1A1A24; }

        .book-title { font-size: 13px; color: #ccc; }
        .book-author { font-size: 11px; color: #555; margin-top: 2px; }
        .user-name { font-size: 13px; color: #ccc; }
        .user-email { font-size: 11px; color: #555; margin-top: 2px; }
        .cell { font-size: 12px; color: #666; }

        .badge { display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 500; }
        .badge.active { background: #9B6DFF22; color: #9B6DFF; }
        .badge.overdue { background: #FF6B3522; color: #FF6B35; }
        .badge.returned { background: #3DBE7222; color: #3DBE72; }

        .return-btn { padding: 5px 12px; border-radius: 7px; border: none; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; cursor: pointer; background: #3DBE7218; color: #3DBE72; transition: all 0.15s; }
        .return-btn:hover { background: #3DBE7230; }
        .return-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .returned-label { font-size: 11px; color: #444; }

        .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-top: 1px solid #26263A; }
        .page-info { font-size: 12px; color: #555; }
        .page-btns { display: flex; gap: 6px; }
        .page-btn { padding: 6px 12px; background: #1E1E2A; border: 1px solid #26263A; border-radius: 7px; color: #666; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .page-btn.active { background: #9B6DFF22; border-color: #9B6DFF; color: #9B6DFF; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .empty-state { text-align: center; padding: 48px 18px; color: #444; font-size: 13px; }
        .skeleton { background: #1E1E2A; border-radius: 8px; height: 16px; margin: 8px 0; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 200; }
        .modal { background: #18181F; border-radius: 18px; border: 1px solid #26263A; padding: 28px; width: 460px; max-width: 95vw; }
        .modal h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #fff; font-weight: 400; margin-bottom: 4px; }
        .modal-sub { font-size: 12px; color: #555; margin-bottom: 22px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 11px; color: #666; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 7px; }
        .field select, .field input { width: 100%; padding: 11px 14px; background: #0F0F14; border: 1px solid #26263A; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #ccc; outline: none; }
        .field select:focus, .field input:focus { border-color: #9B6DFF; }
        .field select option { background: #18181F; }
        .modal-error { background: #FF6B3515; border: 1px solid #FF6B3544; color: #FF6B35; border-radius: 8px; padding: 9px 12px; font-size: 12px; margin-bottom: 14px; }
        .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
        .cancel-btn { padding: 10px 18px; background: #1E1E2A; border: 1px solid #26263A; border-radius: 10px; color: #666; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; }
        .save-btn { padding: 10px 18px; background: #9B6DFF; border: none; border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="page-top">
        <div>
          <h1>Issue / Return</h1>
          <p>Manage book issuance and returns</p>
        </div>
        <button className="issue-btn" onClick={openIssueModal}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Issue Book
        </button>
      </div>

      <div className="stats-row">
        <div className="mini-stat accent">
          <div className="mini-num purple">{stats.total}</div>
          <div className="mini-label">Total issues</div>
        </div>
        <div className="mini-stat">
          <div className="mini-num">{stats.active}</div>
          <div className="mini-label">Active issues</div>
        </div>
        <div className="mini-stat warn">
          <div className="mini-num orange">{stats.overdue}</div>
          <div className="mini-label">Overdue</div>
        </div>
        <div className="mini-stat">
          <div className="mini-num green">{stats.returned}</div>
          <div className="mini-label">Returned</div>
        </div>
      </div>

      <div className="filters">
        <div className="search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            placeholder="Search by book title or user name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="ISSUED">Active</option>
          <option value="OVERDUE">Overdue</option>
          <option value="RETURNED">Returned</option>
        </select>
      </div>

      <div className="table-card">
        <div className="table-head">
          <span>Book</span>
          <span>User</span>
          <span>Issued</span>
          <span>Due</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div style={{ padding: "18px" }}>
            {[1,2,3,4,5].map((i) => <div key={i} className="skeleton" style={{ marginBottom: "16px" }} />)}
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state">No issues found</div>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="table-row">
              <div>
                <div className="book-title">{issue.book.title}</div>
                <div className="book-author">{issue.book.author}</div>
              </div>
              <div>
                <div className="user-name">{issue.user.name}</div>
                <div className="user-email">{issue.user.email}</div>
              </div>
              <div className="cell">
                {new Date(issue.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <div className="cell">
                {new Date(issue.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <div>{getStatusBadge(issue)}</div>
              <div>
                {issue.status === "RETURNED" ? (
                  <span className="returned-label">
                    {new Date(issue.returnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                ) : (
                  <button
                    className="return-btn"
                    onClick={() => handleReturn(issue.id)}
                    disabled={actionLoading === issue.id}
                  >
                    {actionLoading === issue.id ? "..." : "Mark Returned"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        <div className="pagination">
          <div className="page-info">Page {page} of {totalPages}</div>
          <div className="page-btns">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        </div>
      </div>

      {showIssueModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowIssueModal(false); }}>
          <div className="modal">
            <h2>Issue a book</h2>
            <div className="modal-sub">Select a student and a book to issue</div>

            <div className="field">
              <label>Student</label>
              <select value={issueForm.userId} onChange={(e) => setIssueForm({ ...issueForm, userId: e.target.value })}>
                <option value="">Select a student...</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Book</label>
              <select value={issueForm.bookId} onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}>
                <option value="">Select a book...</option>
                {books.map((b) => <option key={b.id} value={b.id}>{b.title} — {b.available} available</option>)}
              </select>
            </div>
            <div className="field">
              <label>Due Date</label>
              <input
                type="date"
                value={issueForm.dueDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
              />
            </div>

            {issueError && <div className="modal-error">{issueError}</div>}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowIssueModal(false)}>Cancel</button>
              <button className="save-btn" onClick={handleIssueBook} disabled={issueSaving}>
                {issueSaving ? "Issuing..." : "Issue Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}