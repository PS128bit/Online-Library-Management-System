import Link from "next/link";

export const metadata = {
  title: "Libra — Online Library Management System",
  description: "Browse thousands of books, request issues, track due dates, and manage your reading journey.",
};

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #FAF8F5; color: #2C1F0E; }

        nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 60px; background: #fff; border-bottom: 1px solid #EDE9E2; position: sticky; top: 0; z-index: 100; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon { width: 32px; height: 32px; background: #C8A96E; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
        .nav-logo-text { font-family: 'Playfair Display', serif; font-size: 16px; color: #2C1F0E; font-weight: 500; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-link { font-size: 13px; color: #9C8060; text-decoration: none; font-weight: 400; transition: color 0.15s; }
        .nav-link:hover { color: #2C1F0E; }
        .nav-btns { display: flex; gap: 10px; }
        .btn-outline { padding: 8px 18px; border: 1px solid #EDE9E2; border-radius: 9px; font-size: 13px; color: #7A6245; background: #fff; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; display: inline-flex; align-items: center; transition: border-color 0.15s; }
        .btn-outline:hover { border-color: #C8A96E; }
        .btn-solid { padding: 8px 18px; border: none; border-radius: 9px; font-size: 13px; color: #fff; background: #2C1F0E; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-solid:hover { background: #3D2E14; }

        .hero { display: flex; align-items: center; justify-content: space-between; padding: 80px 60px; gap: 60px; }
        .hero-left { flex: 1; }
        .hero-tag { display: inline-flex; align-items: center; gap: 6px; background: #FBF6EE; border: 1px solid #EDE9E2; border-radius: 20px; padding: 5px 14px; font-size: 11px; color: #C8A96E; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 24px; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: 52px; color: #1A0F00; font-weight: 500; line-height: 1.15; margin-bottom: 20px; }
        .hero-title em { font-style: italic; color: #C8A96E; }
        .hero-sub { font-size: 15px; color: #9C8060; line-height: 1.75; font-weight: 300; max-width: 440px; margin-bottom: 36px; }
        .hero-btns { display: flex; gap: 12px; }
        .hero-btn-primary { padding: 14px 28px; background: #2C1F0E; color: #F5EFE6; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: background 0.15s; }
        .hero-btn-primary:hover { background: #3D2E14; }
        .hero-btn-secondary { padding: 14px 28px; background: #fff; color: #5C4A2A; border: 1px solid #EDE9E2; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: border-color 0.15s; }
        .hero-btn-secondary:hover { border-color: #C8A96E; }

        .hero-right { flex: 0 0 400px; }
        .hero-card { background: #fff; border-radius: 20px; border: 1px solid #EDE9E2; padding: 28px; box-shadow: 0 8px 40px rgba(180,160,120,0.12); }
        .hero-card-title { font-family: 'Playfair Display', serif; font-size: 16px; color: #2C1F0E; margin-bottom: 16px; }
        .book-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #F5F0E8; }
        .book-row:last-child { border-bottom: none; }
        .book-cover { width: 36px; height: 46px; border-radius: 5px; flex-shrink: 0; }
        .book-row-title { font-size: 13px; color: #2C1F0E; font-weight: 500; }
        .book-row-author { font-size: 11px; color: #9C8060; margin-top: 2px; }
        .book-row-badge { margin-left: auto; font-size: 10px; padding: 3px 9px; border-radius: 20px; background: #3DBE7220; color: #3DBE72; font-weight: 500; flex-shrink: 0; }

        .stats { display: flex; background: #2C1F0E; padding: 40px 60px; }
        .stat { flex: 1; text-align: center; border-right: 1px solid #3D2E14; padding: 0 20px; }
        .stat:last-child { border-right: none; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 36px; color: #C8A96E; font-weight: 500; }
        .stat-label { font-size: 12px; color: #7A6245; margin-top: 4px; font-weight: 300; text-transform: uppercase; letter-spacing: 0.06em; }

        .features { padding: 80px 60px; }
        .section-label { font-size: 11px; color: #C8A96E; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 36px; color: #1A0F00; font-weight: 400; margin-bottom: 48px; line-height: 1.2; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .feature-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #EDE9E2; transition: border-color 0.15s; }
        .feature-card:hover { border-color: #C8A96E44; }
        .feature-icon { width: 40px; height: 40px; border-radius: 10px; background: #FBF6EE; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .feature-title { font-size: 15px; color: #2C1F0E; font-weight: 500; margin-bottom: 8px; }
        .feature-desc { font-size: 13px; color: #9C8060; line-height: 1.65; font-weight: 300; }

        .cta { margin: 0 60px 80px; background: linear-gradient(135deg, #F5EFE6, #EDE3D4); border-radius: 24px; padding: 60px; text-align: center; border: 1px solid #EDE9E2; }
        .cta h2 { font-family: 'Playfair Display', serif; font-size: 36px; color: #1A0F00; font-weight: 400; margin-bottom: 14px; }
        .cta h2 em { font-style: italic; color: #C8A96E; }
        .cta p { font-size: 14px; color: #7A6245; font-weight: 300; margin-bottom: 28px; }
        .cta-btn { padding: 14px 36px; background: #2C1F0E; color: #F5EFE6; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: background 0.15s; }
        .cta-btn:hover { background: #3D2E14; }

        footer { background: #1A0F00; padding: 40px 60px; display: flex; align-items: center; justify-content: space-between; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 16px; color: #C8A96E; }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { font-size: 12px; color: #7A6245; text-decoration: none; transition: color 0.15s; }
        .footer-link:hover { color: #C8A96E; }
        .footer-copy { font-size: 12px; color: #4A3520; }

        @media (max-width: 900px) {
          nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .hero { flex-direction: column; padding: 48px 24px; gap: 40px; }
          .hero-right { flex: none; width: 100%; }
          .hero-title { font-size: 36px; }
          .stats { flex-wrap: wrap; padding: 32px 24px; gap: 24px; }
          .stat { border-right: none; flex: 0 0 45%; }
          .features { padding: 48px 24px; }
          .features-grid { grid-template-columns: 1fr; }
          .cta { margin: 0 24px 48px; padding: 40px 24px; }
          footer { flex-direction: column; gap: 20px; padding: 32px 24px; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      {/* Navbar */}
      <nav>
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <span className="nav-logo-text">Libra</span>
        </Link>
        <div className="nav-links">
          <Link className="nav-link" href="/">Home</Link>
          <Link className="nav-link" href="/login">Browse</Link>
          <Link className="nav-link" href="/about">About</Link>
          <Link className="nav-link" href="/contact">Contact</Link>
        </div>
        <div className="nav-btns">
          <Link className="btn-outline" href="/login">Sign in</Link>
          <Link className="btn-solid" href="/register">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="#C8A96E"><circle cx="12" cy="12" r="10"/></svg>
            Online Library Management
          </div>
          <h1 className="hero-title">A smarter way to<br/>manage your <em>library</em></h1>
          <p className="hero-sub">Browse thousands of books, request issues, track due dates, and manage your reading journey — all in one beautiful platform.</p>
          <div className="hero-btns">
            <Link className="hero-btn-primary" href="/register">Get started free</Link>
            <Link className="hero-btn-secondary" href="/login">Browse books →</Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-card">
            <div className="hero-card-title">Recently added books</div>
            <div className="book-row">
              <div className="book-cover" style={{ background: "linear-gradient(135deg,#9B6DFF,#6D4FCC)" }}></div>
              <div><div className="book-row-title">Clean Code</div><div className="book-row-author">Robert C. Martin</div></div>
              <span className="book-row-badge">Available</span>
            </div>
            <div className="book-row">
              <div className="book-cover" style={{ background: "linear-gradient(135deg,#E8763A,#C4581E)" }}></div>
              <div><div className="book-row-title">Atomic Habits</div><div className="book-row-author">James Clear</div></div>
              <span className="book-row-badge">Available</span>
            </div>
            <div className="book-row">
              <div className="book-cover" style={{ background: "linear-gradient(135deg,#3DBE72,#2A8F52)" }}></div>
              <div><div className="book-row-title">Deep Work</div><div className="book-row-author">Cal Newport</div></div>
              <span className="book-row-badge">Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats">
        <div className="stat"><div className="stat-num">4,200+</div><div className="stat-label">Books available</div></div>
        <div className="stat"><div className="stat-num">890+</div><div className="stat-label">Active members</div></div>
        <div className="stat"><div className="stat-num">1,200+</div><div className="stat-label">Books issued</div></div>
        <div className="stat"><div className="stat-num">99%</div><div className="stat-label">Satisfaction rate</div></div>
      </div>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-label">Why Libra</div>
        <div className="section-title">Everything your library<br/>needs in one place</div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div className="feature-title">Smart Book Search</div>
            <div className="feature-desc">Search by title, author, or category. Find exactly what you're looking for in seconds.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div className="feature-title">Due Date Tracking</div>
            <div className="feature-desc">Never miss a return date. Get clear visibility on all your issued books and their due dates.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div className="feature-title">Role Based Access</div>
            <div className="feature-desc">Separate dashboards for students and admins. Everyone gets exactly what they need.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div className="feature-title">Secure Authentication</div>
            <div className="feature-desc">Bcrypt password hashing and JWT sessions keep your account safe and secure.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div className="feature-title">Admin Reports</div>
            <div className="feature-desc">Track issued books, overdue items, and active users all from one admin dashboard.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div className="feature-title">Easy Book Requests</div>
            <div className="feature-desc">Students can request books in one click. Admins approve and manage issues seamlessly.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta" id="contact">
        <h2>Ready to <em>get started?</em></h2>
        <p>Join hundreds of students already using Libra to manage their reading.</p>
        <Link className="cta-btn" href="/register">Create your free account</Link>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-logo">Libra</div>
        <div className="footer-links">
          <Link className="footer-link" href="/">Home</Link>
          <Link className="footer-link" href="/login">Browse</Link>
          <Link className="footer-link" href="/about">About</Link>
          <Link className="footer-link" href="/contact">Contact</Link>
        </div>
        <div className="footer-copy">© 2026 Libra. All rights reserved.</div>
      </footer>
    </>
  );
}