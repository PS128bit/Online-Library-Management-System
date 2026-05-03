"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, activeIssues: 0, overdue: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/overview");
        const data = await res.json();
        if (data) {
          setStats(data.stats);
          setRecentIssues(data.recentIssues || []);
          setRecentUsers(data.recentUsers || []);
        }
      } catch (err) {
        console.error("Failed to fetch admin overview", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const getStatusClass = (issue) => {
    if (issue.status === "RETURNED") return "returned";
    const due = new Date(issue.dueDate);
    return due < new Date() ? "overdue" : "active";
  };

  const getStatusLabel = (issue) => {
    if (issue.status === "RETURNED") return "Returned";
    const due = new Date(issue.dueDate);
    return due < new Date() ? "Overdue" : "Active";
  };

  return (
    <DashboardLayout>
      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }

        .stat-card {
          background: #18181F;
          border-radius: 14px;
          padding: 18px;
          border: 1px solid #26263A;
        }

        .stat-card.accent { border-color: #9B6DFF44; background: #9B6DFF0A; }
        .stat-card.warn { border-color: #FF6B3544; background: #FF6B350A; }

        .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: #1E1E2A;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .stat-icon.purple { background: #9B6DFF22; }
        .stat-icon.orange { background: #FF6B3522; }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #fff;
          font-weight: 500;
          line-height: 1;
        }

        .stat-num.purple { color: #9B6DFF; }
        .stat-num.orange { color: #FF6B35; }
        .stat-label { font-size: 11px; color: #555; margin-top: 4px; font-weight: 300; }
        .stat-trend { font-size: 10px; color: #3DBE72; margin-top: 6px; }
        .stat-trend.warn { color: #FF6B35; }

        .two-col { display: grid; grid-template-columns: 1.4fr 1fr; gap: 14px; }

        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .section-title { font-size: 13px; color: #ccc; font-weight: 500; }
        .see-all { font-size: 11px; color: #9B6DFF; cursor: pointer; }

        .table-card {
          background: #18181F;
          border-radius: 14px;
          border: 1px solid #26263A;
          overflow: hidden;
        }

        .table-head {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 0.8fr;
          padding: 12px 18px;
          border-bottom: 1px solid #26263A;
        }

        .table-head span {
          font-size: 10px;
          color: #444;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 0.8fr;
          padding: 12px 18px;
          border-bottom: 1px solid #1E1E2A;
          align-items: center;
        }

        .table-row:last-child { border-bottom: none; }
        .book-title { font-size: 13px; color: #ccc; }
        .book-sub { font-size: 11px; color: #555; margin-top: 2px; }
        .table-cell { font-size: 12px; color: #666; }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 500;
        }

        .badge.active { background: #9B6DFF22; color: #9B6DFF; }
        .badge.overdue { background: #FF6B3522; color: #FF6B35; }
        .badge.returned { background: #3DBE7222; color: #3DBE72; }

        .users-card {
          background: #18181F;
          border-radius: 14px;
          border: 1px solid #26263A;
          overflow: hidden;
        }

        .user-head {
          display: grid;
          grid-template-columns: 1.5fr 1fr 0.8fr;
          padding: 12px 18px;
          border-bottom: 1px solid #26263A;
        }

        .user-head span {
          font-size: 10px;
          color: #444;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .user-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 0.8fr;
          padding: 11px 18px;
          border-bottom: 1px solid #1E1E2A;
          align-items: center;
        }

        .user-row:last-child { border-bottom: none; }

        .user-ava {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #9B6DFF33;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #9B6DFF;
          font-weight: 500;
          margin-right: 8px;
          vertical-align: middle;
        }

        .user-nm { font-size: 12px; color: #ccc; vertical-align: middle; }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
        }

        .status-dot.on { background: #3DBE72; }
        .status-dot.off { background: #444; }

        .action-btn {
          font-size: 10px;
          color: #9B6DFF;
          cursor: pointer;
          background: #9B6DFF15;
          padding: 3px 9px;
          border-radius: 6px;
          border: none;
          font-family: 'DM Sans', sans-serif;
        }

        .action-btn:hover { background: #9B6DFF25; }

        .empty-state {
          text-align: center;
          padding: 24px 18px;
          color: #444;
          font-size: 12px;
        }

        .skeleton {
          background: #1E1E2A;
          border-radius: 8px;
          height: 16px;
          margin: 8px 0;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card accent">
          <div className="stat-icon purple">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B6DFF" strokeWidth="2" strokeLinecap="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <div className="stat-num purple">{loading ? "—" : stats.totalBooks.toLocaleString()}</div>
          <div className="stat-label">Total books</div>
          <div className="stat-trend">In the system</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div className="stat-num">{loading ? "—" : stats.totalUsers}</div>
          <div className="stat-label">Registered users</div>
          <div className="stat-trend">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <div className="stat-num">{loading ? "—" : stats.activeIssues}</div>
          <div className="stat-label">Active issues</div>
        </div>
        <div className="stat-card warn">
          <div className="stat-icon orange">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="stat-num orange">{loading ? "—" : stats.overdue}</div>
          <div className="stat-label">Overdue books</div>
          <div className="stat-trend warn">Needs attention</div>
        </div>
      </div>

      {/* Two column grid */}
      <div className="two-col">
        {/* Recent Issues */}
        <div>
          <div className="section-header">
            <div className="section-title">Recent issued books</div>
            <div className="see-all">See all →</div>
          </div>
          <div className="table-card">
            <div className="table-head">
              <span>Book / User</span>
              <span>Issued</span>
              <span>Due</span>
              <span>Status</span>
            </div>
            {loading ? (
              <div style={{ padding: "18px" }}>
                <div className="skeleton" />
                <div className="skeleton" style={{ width: "70%" }} />
                <div className="skeleton" style={{ width: "85%" }} />
              </div>
            ) : recentIssues.length === 0 ? (
              <div className="empty-state">No issued books yet</div>
            ) : (
              recentIssues.map((issue) => (
                <div key={issue.id} className="table-row">
                  <div>
                    <div className="book-title">{issue.book.title}</div>
                    <div className="book-sub">{issue.user.name}</div>
                  </div>
                  <div className="table-cell">
                    {new Date(issue.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="table-cell">
                    {new Date(issue.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <span className={`badge ${getStatusClass(issue)}`}>{getStatusLabel(issue)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <div className="section-header">
            <div className="section-title">Recent users</div>
            <div className="see-all">Manage →</div>
          </div>
          <div className="users-card">
            <div className="user-head">
              <span>User</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {loading ? (
              <div style={{ padding: "18px" }}>
                <div className="skeleton" />
                <div className="skeleton" style={{ width: "60%" }} />
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="empty-state">No users yet</div>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="user-row">
                  <div>
                    <span className="user-ava">{getInitials(user.name)}</span>
                    <span className="user-nm">{user.name}</span>
                  </div>
                  <div>
                    <span className={`status-dot ${user.isActive ? "on" : "off"}`}></span>
                    <span style={{ fontSize: "11px", color: user.isActive ? "#3DBE72" : "#555" }}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <button className="action-btn">Manage</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}