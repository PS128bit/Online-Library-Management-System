"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [stats, setStats] = useState({ issued: 0, daysLeft: 0, returned: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/issues/my");
        const data = await res.json();
        if (data.issuedBooks) {
          setIssuedBooks(data.issuedBooks);
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const accent = "#E8763A";

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

        .stat-card.accent {
          border-color: #E8763A44;
          background: #E8763A0A;
        }

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

        .stat-icon.orange { background: #E8763A22; }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #fff;
          font-weight: 500;
          line-height: 1;
        }

        .stat-num.orange { color: #E8763A; }
        .stat-label { font-size: 11px; color: #555; margin-top: 4px; font-weight: 300; }
        .stat-trend { font-size: 10px; color: #E8763A; margin-top: 6px; }

        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .section-title { font-size: 13px; color: #ccc; font-weight: 500; }
        .see-all { font-size: 11px; color: #E8763A; cursor: pointer; font-weight: 400; }

        .book-table {
          background: #18181F;
          border-radius: 14px;
          border: 1px solid #26263A;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .table-head {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1fr 0.8fr;
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
          grid-template-columns: 2fr 1.2fr 1fr 0.8fr;
          padding: 13px 18px;
          border-bottom: 1px solid #1E1E2A;
          align-items: center;
        }

        .table-row:last-child { border-bottom: none; }
        .book-title { font-size: 13px; color: #ccc; font-weight: 400; }
        .book-author { font-size: 11px; color: #555; margin-top: 2px; }
        .table-cell { font-size: 12px; color: #666; }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 500;
        }

        .badge.active { background: #E8763A22; color: #E8763A; }
        .badge.due { background: #FF3B3022; color: #FF3B30; }
        .badge.safe { background: #3DBE7222; color: #3DBE72; }

        .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .mini-card {
          background: #18181F;
          border-radius: 14px;
          padding: 18px;
          border: 1px solid #26263A;
        }

        .mini-title {
          font-size: 12px;
          color: #888;
          font-weight: 500;
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .mini-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid #1E1E2A;
        }

        .mini-item:last-child { border-bottom: none; }
        .mini-item-title { font-size: 12px; color: #aaa; }
        .mini-item-sub { font-size: 10px; color: #555; margin-top: 2px; }
        .mini-tag { font-size: 10px; padding: 3px 9px; border-radius: 20px; background: #E8763A15; color: #E8763A; }

        .empty-state {
          text-align: center;
          padding: 32px 18px;
          color: #444;
          font-size: 13px;
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
          <div className="stat-icon orange">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E8763A" strokeWidth="2" strokeLinecap="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <div className="stat-num orange">{loading ? "—" : stats.issued}</div>
          <div className="stat-label">Books issued</div>
          <div className="stat-trend">Currently active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-num">{loading ? "—" : stats.daysLeft}</div>
          <div className="stat-label">Days until due</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="stat-num">{loading ? "—" : stats.returned}</div>
          <div className="stat-label">Books returned</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <div className="stat-num">{loading ? "—" : stats.pending}</div>
          <div className="stat-label">Pending requests</div>
        </div>
      </div>

      {/* Currently Issued Books */}
      <div className="section-header">
        <div className="section-title">Currently issued books</div>
        <div className="see-all">See all →</div>
      </div>
      <div className="book-table">
        <div className="table-head">
          <span>Book</span>
          <span>Category</span>
          <span>Due date</span>
          <span>Status</span>
        </div>
        {loading ? (
          <div style={{ padding: "18px" }}>
            <div className="skeleton" />
            <div className="skeleton" style={{ width: "70%" }} />
            <div className="skeleton" style={{ width: "85%" }} />
          </div>
        ) : issuedBooks.length === 0 ? (
          <div className="empty-state">No books currently issued</div>
        ) : (
          issuedBooks.map((issue) => {
            const due = new Date(issue.dueDate);
            const today = new Date();
            const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
            const statusClass = daysLeft < 0 ? "due" : daysLeft <= 3 ? "due" : "safe";
            const statusLabel = daysLeft < 0 ? "Overdue" : daysLeft <= 3 ? "Due soon" : "On time";

            return (
              <div key={issue.id} className="table-row">
                <div>
                  <div className="book-title">{issue.book.title}</div>
                  <div className="book-author">{issue.book.author}</div>
                </div>
                <div className="table-cell">{issue.book.category}</div>
                <div className="table-cell">{due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                <div><span className={`badge ${statusClass}`}>{statusLabel}</span></div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        <div className="mini-card">
          <div className="mini-title">Recent requests</div>
          <div className="empty-state" style={{ padding: "12px 0", fontSize: "12px" }}>
            No pending requests
          </div>
        </div>
        <div className="mini-card">
          <div className="mini-title">Return history</div>
          <div className="empty-state" style={{ padding: "12px 0", fontSize: "12px" }}>
            No return history yet
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}