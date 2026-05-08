"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = session?.user?.role === "ADMIN";
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const studentNav = [
    { label: "Overview", href: "/dashboard", icon: "grid" },
    { label: "My Books", href: "/dashboard/my-books", icon: "book" },
    { label: "Browse", href: "/dashboard/browse", icon: "search" },
    { label: "Requests", href: "/dashboard/requests", icon: "edit" },
    { label: "History", href: "/dashboard/history", icon: "clock" },
  ];

  const adminNav = [
    { label: "Overview", href: "/admin/dashboard", icon: "grid" },
    { label: "Books", href: "/admin/books", icon: "book" },
    { label: "Users", href: "/admin/users", icon: "users" },
    { label: "Issue / Return", href: "/admin/issues", icon: "edit" },
    { label: "Reports", href: "/admin/reports", icon: "bar-chart" },
  ];

  const navItems = isAdmin ? adminNav : studentNav;
  const accent = isAdmin ? "#9B6DFF" : "#E8763A";
  const accentBg = isAdmin ? "#9B6DFF18" : "#E8763A18";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Search books as user types
  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); setShowResults(false); return; }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/books?search=${searchQuery}&page=1&category=all`);
        const data = await res.json();
        setSearchResults((data.books || []).slice(0, 6));
        setShowResults(true);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSearchSelect = (book) => {
    setSearchQuery("");
    setShowResults(false);
    router.push(isAdmin ? "/admin/books" : "/dashboard/browse");
  };

  const getIcon = (icon) => {
    const icons = {
      grid: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
      book: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
      search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
      edit: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
      clock: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      users: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
      "bar-chart": <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    };
    return icons[icon] || null;
  };

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const notifications = isAdmin ? [
    { text: "New user registered", sub: "Just now", dot: accent },
    { text: "3 books are overdue", sub: "Check reports", dot: "#FF6B35" },
    { text: "Book inventory low", sub: "Atomic Habits — 1 left", dot: "#E8C870" },
  ] : [
    { text: "Your book is due soon", sub: "Check my books", dot: "#E8C870" },
    { text: "New books added", sub: "Browse the collection", dot: accent },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes dropDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } }

        .layout-wrap { font-family: 'DM Sans', sans-serif; background: #0F0F14; min-height: 100vh; display: flex; }

        .sidebar {
          width: 220px; background: #18181F; border-right: 1px solid #26263A;
          display: flex; flex-direction: column; padding: 24px 16px; gap: 4px;
          flex-shrink: 0; min-height: 100vh; position: fixed; top: 0; left: 0;
          z-index: 100; animation: slideIn 0.3s ease;
        }

        .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; padding: 0 8px; text-decoration: none; transition: opacity 0.2s; }
        .logo:hover { opacity: 0.8; }
        .logo-icon { width: 32px; height: 32px; background: ${accent}; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s, box-shadow 0.2s; }
        .logo:hover .logo-icon { transform: scale(1.05); box-shadow: 0 4px 12px ${accent}44; }
        .logo-name { font-family: 'Playfair Display', serif; font-size: 16px; color: #fff; font-weight: 500; line-height: 1.2; }
        .logo-name span { display: block; font-family: 'DM Sans', sans-serif; font-size: 9px; color: #555; font-weight: 300; letter-spacing: 0.08em; text-transform: uppercase; }

        .nav-section-label { font-size: 9px; color: #444; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 0 12px; margin: 16px 0 6px; }

        .nav-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: 10px; font-size: 13px; color: #555; font-weight: 400;
          cursor: pointer; transition: all 0.2s ease; text-decoration: none;
          position: relative; overflow: hidden;
        }
        .nav-item::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 3px; background: ${accent}; border-radius: 0 2px 2px 0; transform: scaleY(0); transition: transform 0.2s ease; }
        .nav-item:hover { background: #1E1E2A; color: #888; transform: translateX(2px); }
        .nav-item.active { background: ${accentBg}; color: ${accent}; font-weight: 500; }
        .nav-item.active::before { transform: scaleY(1); }
        .nav-item svg { flex-shrink: 0; transition: transform 0.2s; }
        .nav-item:hover svg { transform: scale(1.1); }

        .sidebar-bottom { margin-top: auto; border-top: 1px solid #26263A; padding-top: 16px; }
        .user-card { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: background 0.2s; }
        .user-card:hover { background: #1E1E2A; }
        .avatar { width: 32px; height: 32px; border-radius: 50%; background: ${accent}; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #fff; font-weight: 500; flex-shrink: 0; transition: transform 0.2s, box-shadow 0.2s; }
        .user-card:hover .avatar { transform: scale(1.05); box-shadow: 0 4px 10px ${accent}44; }
        .user-info { flex: 1; min-width: 0; }
        .user-name { font-size: 12px; color: #ccc; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 10px; color: ${accent}; font-weight: 400; }
        .logout-btn { width: 100%; margin-top: 8px; padding: 9px 12px; background: none; border: 1px solid #26263A; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #555; cursor: pointer; transition: all 0.2s; text-align: left; display: flex; align-items: center; gap: 8px; }
        .logout-btn:hover { background: #FF6B3515; border-color: #FF6B3544; color: #FF6B35; transform: translateX(2px); }

        .main { flex: 1; margin-left: 220px; display: flex; flex-direction: column; min-width: 0; min-height: 100vh; }

        .topbar { height: 60px; background: #18181F; border-bottom: 1px solid #26263A; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; flex-shrink: 0; position: sticky; top: 0; z-index: 50; animation: fadeIn 0.3s ease; }
        .topbar-left h2 { font-family: 'Playfair Display', serif; font-size: 17px; color: #fff; font-weight: 400; }
        .topbar-left p { font-size: 11px; color: #555; font-weight: 300; margin-top: 1px; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }

        /* Search */
        .search-wrap { position: relative; }
        .search-bar { display: flex; align-items: center; gap: 8px; background: #1E1E2A; border: 1px solid #26263A; border-radius: 9px; padding: 7px 12px; transition: border-color 0.2s, box-shadow 0.2s; }
        .search-bar:focus-within { border-color: ${accent}; box-shadow: 0 0 0 3px ${accent}18; }
        .search-bar input { background: none; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #888; width: 160px; }
        .search-bar input::placeholder { color: #444; }
        .search-dropdown { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: #18181F; border: 1px solid #26263A; border-radius: 12px; overflow: hidden; z-index: 200; animation: dropDown 0.2s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.4); min-width: 280px; }
        .search-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #1E1E2A; }
        .search-item:last-child { border-bottom: none; }
        .search-item:hover { background: #1E1E2A; }
        .search-item-icon { width: 28px; height: 36px; border-radius: 4px; background: ${accentBg}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .search-item-title { font-size: 12px; color: #ccc; }
        .search-item-sub { font-size: 10px; color: #555; margin-top: 1px; }
        .search-avail { margin-left: auto; font-size: 10px; padding: 2px 8px; border-radius: 20px; background: ${accentBg}; color: ${accent}; flex-shrink: 0; }

        /* Notifications */
        .notif-wrap { position: relative; }
        .notif-btn { width: 34px; height: 34px; border-radius: 9px; background: #1E1E2A; border: 1px solid #26263A; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; transition: all 0.2s; }
        .notif-btn:hover { background: #26263A; border-color: ${accent}; transform: scale(1.05); }
        .notif-dot { position: absolute; top: 7px; right: 7px; width: 6px; height: 6px; border-radius: 50%; background: ${accent}; border: 1px solid #18181F; animation: pulse-dot 2s infinite; }
        .notif-dropdown { position: absolute; top: calc(100% + 8px); right: 0; width: 280px; background: #18181F; border: 1px solid #26263A; border-radius: 12px; overflow: hidden; z-index: 200; animation: dropDown 0.2s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .notif-header { padding: 12px 16px; border-bottom: 1px solid #26263A; font-size: 12px; color: #888; font-weight: 500; display: flex; justify-content: space-between; align-items: center; }
        .notif-clear { font-size: 11px; color: ${accent}; cursor: pointer; }
        .notif-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-bottom: 1px solid #1E1E2A; transition: background 0.15s; cursor: pointer; }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: #1E1E2A; }
        .notif-color-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
        .notif-text { font-size: 12px; color: #ccc; }
        .notif-sub { font-size: 11px; color: #555; margin-top: 2px; }

        .topbar-avatar { width: 32px; height: 32px; border-radius: 50%; background: ${accent}; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #fff; font-weight: 500; flex-shrink: 0; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .topbar-avatar:hover { transform: scale(1.08); box-shadow: 0 4px 12px ${accent}44; }

        .page-content { flex: 1; padding: 24px 28px; overflow-y: auto; animation: fadeIn 0.35s ease; }

        /* Footer */
        .dashboard-footer { background: #18181F; border-top: 1px solid #26263A; padding: 16px 28px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .footer-left { display: flex; align-items: center; gap: 8px; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 14px; color: ${accent}; font-weight: 500; }
        .footer-copy { font-size: 11px; color: #444; }
        .footer-links { display: flex; gap: 20px; }
        .footer-link { font-size: 11px; color: #555; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: ${accent}; }
        .footer-right { font-size: 11px; color: #444; }

        @media (max-width: 768px) {
          .sidebar { width: 100%; min-height: auto; position: relative; }
          .main { margin-left: 0; }
          .layout-wrap { flex-direction: column; }
          .dashboard-footer { flex-direction: column; gap: 10px; text-align: center; }
        }
      `}</style>

      <div className="layout-wrap">
        {/* Sidebar */}
        <div className="sidebar">
          <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="logo">
            <div className="logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
            </div>
            <div className="logo-name">
              Libra
              <span>{isAdmin ? "Admin Panel" : "Management System"}</span>
            </div>
          </Link>

          <div className="nav-section-label">{isAdmin ? "Management" : "Menu"}</div>

          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`nav-item ${pathname === item.href ? "active" : ""}`}>
              {getIcon(item.icon)}
              {item.label}
            </Link>
          ))}

          <div className="sidebar-bottom">
            <div className="user-card">
              <div className="avatar">{initials}</div>
              <div className="user-info">
                <div className="user-name">{session?.user?.name || "User"}</div>
                <div className="user-role">{isAdmin ? "Administrator" : "Student"}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={() => signOut({ callbackUrl: "/login" })}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <h2>{isAdmin ? "Admin Panel ✦" : `Good day, ${session?.user?.name?.split(" ")[0] || "there"} ✦`}</h2>
              <p>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div className="topbar-right">

              {/* Search */}
              <div className="search-wrap" ref={searchRef}>
                <div className="search-bar">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  />
                </div>
                {showResults && searchResults.length > 0 && (
                  <div className="search-dropdown">
                    {searchResults.map((book) => (
                      <div key={book.id} className="search-item" onClick={() => handleSearchSelect(book)}>
                        <div className="search-item-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">
                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="search-item-title">{book.title}</div>
                          <div className="search-item-sub">{book.author} · {book.category}</div>
                        </div>
                        <span className="search-avail">{book.available > 0 ? "Available" : "Unavailable"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="notif-wrap" ref={notifRef}>
                <div className="notif-btn" onClick={() => setShowNotif(!showNotif)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                  <div className="notif-dot"></div>
                </div>
                {showNotif && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      Notifications
                      <span className="notif-clear" onClick={() => setShowNotif(false)}>Clear all</span>
                    </div>
                    {notifications.map((n, i) => (
                      <div key={i} className="notif-item" onClick={() => setShowNotif(false)}>
                        <div className="notif-color-dot" style={{ background: n.dot }}></div>
                        <div>
                          <div className="notif-text">{n.text}</div>
                          <div className="notif-sub">{n.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="topbar-avatar">{initials}</div>
            </div>
          </div>

          <div className="page-content">{children}</div>

          {/* Footer */}
          <footer className="dashboard-footer">
            <div className="footer-left">
              <span className="footer-logo">Libra</span>
              <span className="footer-copy">— Online Library Management System</span>
            </div>
            <div className="footer-links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="footer-link">Dashboard</Link>
              <a href="mailto:anaskhattak727@gmail.com" className="footer-link">Contact</a>
            </div>
            <div className="footer-right">© 2026 Libra. All rights reserved.</div>
          </footer>
        </div>
      </div>
    </>
  );
}