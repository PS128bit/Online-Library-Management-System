"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function BrowsePage() {
  const { data: session } = useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [requesting, setRequesting] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const categories = ["Programming", "Self Help", "Science", "Mathematics", "Business", "History", "Literature", "Other"];

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search, category: categoryFilter, status: "all" });
      const res = await fetch(`/api/books?${params}`);
      const data = await res.json();
      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [page, search, categoryFilter]);

  const handleRequest = async (bookId) => {
    setRequesting(bookId);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/issues/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); }
      else { setSuccessMsg(`"${data.bookTitle}" requested successfully!`); }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setRequesting(null);
      setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 4000);
    }
  };

  const getAvailabilityBadge = (book) => {
    if (book.available === 0) return <span className="badge out">Unavailable</span>;
    if (book.available <= 2) return <span className="badge low">Low Stock</span>;
    return <span className="badge available">Available</span>;
  };

  return (
    <DashboardLayout>
      <style>{`
        .page-top { margin-bottom: 24px; }
        .page-top h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 400; }
        .page-top p { font-size: 12px; color: #555; margin-top: 2px; }

        .alert { border-radius: 10px; padding: 10px 16px; font-size: 13px; margin-bottom: 16px; }
        .alert.success { background: #3DBE7215; border: 1px solid #3DBE7244; color: #3DBE72; }
        .alert.error { background: #FF6B3515; border: 1px solid #FF6B3544; color: #FF6B35; }

        .filters { display: flex; gap: 10px; margin-bottom: 20px; }
        .search-bar { flex: 1; display: flex; align-items: center; gap: 8px; background: #18181F; border: 1px solid #26263A; border-radius: 10px; padding: 10px 14px; }
        .search-bar input { background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #888; width: 100%; }
        .search-bar input::placeholder { color: #444; }
        .filter-select { background: #18181F; border: 1px solid #26263A; border-radius: 10px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #666; outline: none; cursor: pointer; }
        .filter-select option { background: #18181F; }

        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; margin-bottom: 24px; }

        .book-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; padding: 18px; display: flex; flex-direction: column; gap: 12px; transition: border-color 0.15s; }
        .book-card:hover { border-color: #E8763A44; }

        .book-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .book-icon { width: 42px; height: 42px; border-radius: 10px; background: #E8763A18; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .book-info { flex: 1; min-width: 0; }
        .book-title { font-size: 14px; color: #ccc; font-weight: 500; line-height: 1.3; }
        .book-author { font-size: 12px; color: #555; margin-top: 3px; }

        .book-meta { display: flex; align-items: center; justify-content: space-between; }
        .book-category { font-size: 11px; color: #555; background: #1E1E2A; padding: 3px 9px; border-radius: 6px; }
        .book-copies { font-size: 11px; color: #666; }

        .badge { display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 500; }
        .badge.available { background: #3DBE7222; color: #3DBE72; }
        .badge.low { background: #E8C87022; color: #E8C870; }
        .badge.out { background: #FF6B3522; color: #FF6B35; }

        .request-btn { width: 100%; padding: 10px; background: #E8763A; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #fff; cursor: pointer; transition: background 0.15s; margin-top: auto; }
        .request-btn:hover { background: #D4682E; }
        .request-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .request-btn.unavailable { background: #1E1E2A; color: #555; cursor: not-allowed; }

        .pagination { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .page-btn { padding: 7px 14px; background: #18181F; border: 1px solid #26263A; border-radius: 8px; color: #666; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .page-btn.active { background: #E8763A22; border-color: #E8763A; color: #E8763A; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .empty-state { text-align: center; padding: 64px 18px; color: #444; font-size: 13px; }
        .skeleton-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; padding: 18px; height: 180px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="page-top">
        <h1>Browse Books</h1>
        <p>Discover and request books from our collection</p>
      </div>

      {successMsg && <div className="alert success">✓ {successMsg}</div>}
      {errorMsg && <div className="alert error">✕ {errorMsg}</div>}

      <div className="filters">
        <div className="search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="filter-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="books-grid">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">No books found</div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-card-top">
                <div className="book-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8763A" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                  </svg>
                </div>
                <div className="book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-author">{book.author}</div>
                </div>
                {getAvailabilityBadge(book)}
              </div>
              <div className="book-meta">
                <span className="book-category">{book.category}</span>
                <span className="book-copies">{book.available} / {book.totalCopies} available</span>
              </div>
              <button
                className={`request-btn ${book.available === 0 ? "unavailable" : ""}`}
                disabled={book.available === 0 || requesting === book.id}
                onClick={() => handleRequest(book.id)}
              >
                {requesting === book.id ? "Requesting..." : book.available === 0 ? "Unavailable" : "Request Book"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
          <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
        ))}
        <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>→</button>
      </div>
    </DashboardLayout>
  );
}