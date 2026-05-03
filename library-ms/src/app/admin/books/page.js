"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, issued: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "", author: "", isbn: "", category: "Programming",
    totalCopies: 1, available: 1,
  });

  const categories = ["Programming", "Self Help", "Science", "Mathematics", "Business", "History", "Literature", "Other"];

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, search, category: categoryFilter, status: statusFilter,
      });
      const res = await fetch(`/api/admin/books?${params}`);
      const data = await res.json();
      setBooks(data.books || []);
      setStats(data.stats || { total: 0, available: 0, issued: 0, outOfStock: 0 });
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [page, search, categoryFilter, statusFilter]);

  const openAdd = () => {
    setEditBook(null);
    setForm({ title: "", author: "", isbn: "", category: "Programming", totalCopies: 1, available: 1 });
    setError("");
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditBook(book);
    setForm({
      title: book.title, author: book.author, isbn: book.isbn,
      category: book.category, totalCopies: book.totalCopies, available: book.available,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.author || !form.isbn) {
      setError("Title, author and ISBN are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/books", {
        method: editBook ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editBook?.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/admin/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) { setDeleteConfirm(null); fetchBooks(); }
    } catch (err) {
      console.error("Failed to delete book", err);
    }
  };

  const getStatusBadge = (book) => {
    if (book.available === 0) return <span className="badge out">Out of Stock</span>;
    if (book.available <= 2) return <span className="badge low">Low Stock</span>;
    return <span className="badge available">Available</span>;
  };

  return (
    <DashboardLayout>
      <style>{`
        .page-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .page-top h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 400; }
        .page-top p { font-size: 12px; color: #555; margin-top: 2px; }

        .add-btn { display: flex; align-items: center; gap: 8px; background: #9B6DFF; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
        .add-btn:hover { background: #8A5EE8; }

        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
        .mini-stat { background: #18181F; border-radius: 12px; padding: 14px 16px; border: 1px solid #26263A; }
        .mini-stat.accent { border-color: #9B6DFF44; background: #9B6DFF0A; }
        .mini-num { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 500; }
        .mini-num.purple { color: #9B6DFF; }
        .mini-num.orange { color: #FF6B35; }
        .mini-label { font-size: 11px; color: #555; margin-top: 3px; }

        .filters { display: flex; gap: 10px; margin-bottom: 20px; }
        .search-bar { flex: 1; display: flex; align-items: center; gap: 8px; background: #18181F; border: 1px solid #26263A; border-radius: 10px; padding: 10px 14px; }
        .search-bar input { background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #888; width: 100%; }
        .search-bar input::placeholder { color: #444; }
        .filter-select { background: #18181F; border: 1px solid #26263A; border-radius: 10px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #666; outline: none; cursor: pointer; }

        .table-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; overflow: hidden; }
        .table-head { display: grid; grid-template-columns: 2.5fr 1.2fr 1fr 0.8fr 0.8fr 1fr; padding: 12px 18px; border-bottom: 1px solid #26263A; }
        .table-head span { font-size: 10px; color: #444; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
        .table-row { display: grid; grid-template-columns: 2.5fr 1.2fr 1fr 0.8fr 0.8fr 1fr; padding: 13px 18px; border-bottom: 1px solid #1E1E2A; align-items: center; transition: background 0.15s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #1A1A24; }

        .book-title { font-size: 13px; color: #ccc; }
        .book-author { font-size: 11px; color: #555; margin-top: 2px; }
        .book-isbn { font-size: 11px; color: #555; font-family: monospace; }
        .cell { font-size: 12px; color: #666; }

        .badge { display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 500; }
        .badge.available { background: #3DBE7222; color: #3DBE72; }
        .badge.low { background: #E8C87022; color: #E8C870; }
        .badge.out { background: #FF6B3522; color: #FF6B35; }

        .actions { display: flex; gap: 6px; }
        .action-btn { padding: 5px 10px; border-radius: 7px; border: none; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .edit-btn { background: #9B6DFF18; color: #9B6DFF; }
        .edit-btn:hover { background: #9B6DFF30; }
        .delete-btn { background: #FF6B3518; color: #FF6B35; }
        .delete-btn:hover { background: #FF6B3530; }

        .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-top: 1px solid #26263A; }
        .page-info { font-size: 12px; color: #555; }
        .page-btns { display: flex; gap: 6px; }
        .page-btn { padding: 6px 12px; background: #1E1E2A; border: 1px solid #26263A; border-radius: 7px; color: #666; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
        .page-btn.active { background: #9B6DFF22; border-color: #9B6DFF; color: #9B6DFF; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .empty-state { text-align: center; padding: 48px 18px; color: #444; font-size: 13px; }

        .skeleton { background: #1E1E2A; border-radius: 8px; height: 16px; margin: 8px 0; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 200; }
        .modal { background: #18181F; border-radius: 18px; border: 1px solid #26263A; padding: 28px; width: 500px; max-width: 95vw; }
        .modal h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #fff; font-weight: 400; margin-bottom: 4px; }
        .modal-sub { font-size: 12px; color: #555; margin-bottom: 22px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 11px; color: #666; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 7px; }
        .field input, .field select { width: 100%; padding: 11px 14px; background: #0F0F14; border: 1px solid #26263A; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #ccc; outline: none; transition: border-color 0.15s; }
        .field input:focus, .field select:focus { border-color: #9B6DFF; }
        .field input::placeholder { color: #444; }
        .field select option { background: #18181F; }
        .modal-error { background: #FF6B3515; border: 1px solid #FF6B3544; color: #FF6B35; border-radius: 8px; padding: 9px 12px; font-size: 12px; margin-bottom: 14px; }
        .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }
        .cancel-btn { padding: 10px 18px; background: #1E1E2A; border: 1px solid #26263A; border-radius: 10px; color: #666; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; }
        .save-btn { padding: 10px 18px; background: #9B6DFF; border: none; border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Delete confirm */
        .confirm-modal { background: #18181F; border-radius: 16px; border: 1px solid #FF6B3544; padding: 24px; width: 380px; max-width: 95vw; }
        .confirm-modal h3 { font-size: 16px; color: #fff; margin-bottom: 8px; }
        .confirm-modal p { font-size: 13px; color: #666; margin-bottom: 20px; line-height: 1.5; }
        .confirm-actions { display: flex; gap: 10px; justify-content: flex-end; }
        .confirm-delete-btn { padding: 9px 16px; background: #FF6B35; border: none; border-radius: 9px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; }
      `}</style>

      {/* Page header */}
      <div className="page-top">
        <div>
          <h1>Book Management</h1>
          <p>Manage your library's book collection</p>
        </div>
        <button className="add-btn" onClick={openAdd}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Book
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="mini-stat accent">
          <div className="mini-num purple">{stats.total.toLocaleString()}</div>
          <div className="mini-label">Total books</div>
        </div>
        <div className="mini-stat">
          <div className="mini-num">{stats.available.toLocaleString()}</div>
          <div className="mini-label">Available copies</div>
        </div>
        <div className="mini-stat">
          <div className="mini-num">{stats.issued}</div>
          <div className="mini-label">Currently issued</div>
        </div>
        <div className="mini-stat">
          <div className="mini-num orange">{stats.outOfStock}</div>
          <div className="mini-label">Out of stock</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            placeholder="Search by title, author or ISBN..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="filter-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-head">
          <span>Book</span>
          <span>ISBN</span>
          <span>Category</span>
          <span>Copies</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div style={{ padding: "18px" }}>
            {[1,2,3,4,5].map((i) => <div key={i} className="skeleton" style={{ marginBottom: "16px" }} />)}
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">No books found</div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="table-row">
              <div>
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
              </div>
              <div className="book-isbn">{book.isbn}</div>
              <div className="cell">{book.category}</div>
              <div className="cell">{book.available} / {book.totalCopies}</div>
              <div>{getStatusBadge(book)}</div>
              <div className="actions">
                <button className="action-btn edit-btn" onClick={() => openEdit(book)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => setDeleteConfirm(book)}>Delete</button>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <h2>{editBook ? "Edit book" : "Add new book"}</h2>
            <div className="modal-sub">{editBook ? "Update the book details below" : "Fill in the details to add a book to the library"}</div>

            <div className="form-row">
              <div className="field">
                <label>Title</label>
                <input placeholder="Book title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="field">
                <label>Author</label>
                <input placeholder="Author name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>ISBN</label>
                <input placeholder="978-..." value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
              </div>
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Total Copies</label>
                <input type="number" min="1" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: parseInt(e.target.value) })} />
              </div>
              <div className="field">
                <label>Available</label>
                <input type="number" min="0" value={form.available} onChange={(e) => setForm({ ...form, available: parseInt(e.target.value) })} />
              </div>
            </div>

            {error && <div className="modal-error">{error}</div>}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editBook ? "Save changes" : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="confirm-modal">
            <h3>Delete book?</h3>
            <p>Are you sure you want to delete <strong style={{ color: "#ccc" }}>{deleteConfirm.title}</strong>? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="confirm-delete-btn" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}