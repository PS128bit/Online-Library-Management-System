"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search, role: roleFilter, status: statusFilter });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setStats(data.stats || { total: 0, active: 0, inactive: 0, admins: 0 });
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter, statusFilter]);

  const handleToggleActive = async (user) => {
    setActionLoading(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (user, role) => {
    setActionLoading(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Failed to update role", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <DashboardLayout>
      <style>{`
        .page-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .page-top h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 400; }
        .page-top p { font-size: 12px; color: #555; margin-top: 2px; }

        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
        .mini-stat { background: #18181F; border-radius: 12px; padding: 14px 16px; border: 1px solid #26263A; }
        .mini-stat.accent { border-color: #9B6DFF44; background: #9B6DFF0A; }
        .mini-num { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 500; }
        .mini-num.purple { color: #9B6DFF; }
        .mini-num.green { color: #3DBE72; }
        .mini-num.orange { color: #FF6B35; }
        .mini-label { font-size: 11px; color: #555; margin-top: 3px; }

        .filters { display: flex; gap: 10px; margin-bottom: 20px; }
        .search-bar { flex: 1; display: flex; align-items: center; gap: 8px; background: #18181F; border: 1px solid #26263A; border-radius: 10px; padding: 10px 14px; }
        .search-bar input { background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #888; width: 100%; }
        .search-bar input::placeholder { color: #444; }
        .filter-select { background: #18181F; border: 1px solid #26263A; border-radius: 10px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #666; outline: none; cursor: pointer; }
        .filter-select option { background: #18181F; }

        .table-card { background: #18181F; border-radius: 14px; border: 1px solid #26263A; overflow: hidden; }
        .table-head { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1.2fr; padding: 12px 18px; border-bottom: 1px solid #26263A; }
        .table-head span { font-size: 10px; color: #444; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
        .table-row { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1.2fr; padding: 13px 18px; border-bottom: 1px solid #1E1E2A; align-items: center; transition: background 0.15s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #1A1A24; }

        .user-cell { display: flex; align-items: center; gap: 10px; }
        .user-ava { width: 32px; height: 32px; border-radius: 50%; background: #9B6DFF33; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #9B6DFF; font-weight: 500; flex-shrink: 0; }
        .user-name { font-size: 13px; color: #ccc; }
        .user-id { font-size: 10px; color: #444; margin-top: 1px; }
        .cell { font-size: 12px; color: #666; }

        .badge { display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 500; }
        .badge.active { background: #3DBE7222; color: #3DBE72; }
        .badge.inactive { background: #55555522; color: #888; }
        .badge.admin { background: #9B6DFF22; color: #9B6DFF; }
        .badge.student { background: #26263A; color: #666; }

        .role-select { background: #1E1E2A; border: 1px solid #26263A; border-radius: 7px; padding: 5px 10px; font-family: 'DM Sans', sans-serif; font-size: 11px; color: #888; outline: none; cursor: pointer; }
        .role-select option { background: #18181F; }

        .toggle-btn { padding: 5px 12px; border-radius: 7px; border: none; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .toggle-btn.deactivate { background: #FF6B3518; color: #FF6B35; }
        .toggle-btn.deactivate:hover { background: #FF6B3530; }
        .toggle-btn.activate { background: #3DBE7218; color: #3DBE72; }
        .toggle-btn.activate:hover { background: #3DBE7230; }
        .toggle-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-top: 1px solid #26263A; }
        .page-info { font-size: 12px; color: #555; }
        .page-btns { display: flex; gap: 6px; }
        .page-btn { padding: 6px 12px; background: #1E1E2A; border: 1px solid #26263A; border-radius: 7px; color: #666; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
        .page-btn.active { background: #9B6DFF22; border-color: #9B6DFF; color: #9B6DFF; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .empty-state { text-align: center; padding: 48px 18px; color: #444; font-size: 13px; }
        .skeleton { background: #1E1E2A; border-radius: 8px; height: 16px; margin: 8px 0; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      {/* Header */}
      <div className="page-top">
        <div>
          <h1>User Management</h1>
          <p>View and manage all registered users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="mini-stat accent">
          <div className="mini-num purple">{stats.total}</div>
          <div className="mini-label">Total users</div>
        </div>
        <div className="mini-stat">
          <div className="mini-num green">{stats.active}</div>
          <div className="mini-label">Active users</div>
        </div>
        <div className="mini-stat">
          <div className="mini-num orange">{stats.inactive}</div>
          <div className="mini-label">Inactive users</div>
        </div>
        <div className="mini-stat">
          <div className="mini-num purple">{stats.admins}</div>
          <div className="mini-label">Admins</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="filter-select" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="all">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="ADMIN">Admins</option>
        </select>
        <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-head">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div style={{ padding: "18px" }}>
            {[1,2,3,4,5].map((i) => <div key={i} className="skeleton" style={{ marginBottom: "16px" }} />)}
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">No users found</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="table-row">
              <div className="user-cell">
                <div className="user-ava">{getInitials(user.name)}</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-id">ID #{user.id}</div>
                </div>
              </div>
              <div className="cell">{user.email}</div>
              <div>
                <select
                  className="role-select"
                  value={user.role}
                  onChange={(e) => handleChangeRole(user, e.target.value)}
                  disabled={actionLoading === user.id}
                >
                  <option value="STUDENT">Student</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <span className={`badge ${user.isActive ? "active" : "inactive"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="cell">
                {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <div>
                <button
                  className={`toggle-btn ${user.isActive ? "deactivate" : "activate"}`}
                  onClick={() => handleToggleActive(user)}
                  disabled={actionLoading === user.id}
                >
                  {actionLoading === user.id ? "..." : user.isActive ? "Deactivate" : "Activate"}
                </button>
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
    </DashboardLayout>
  );
}