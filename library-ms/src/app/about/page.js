import Link from "next/link";

export const metadata = { title: "About — Libra" };

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #FAF8F5; color: #2C1F0E; }
        nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 60px; background: #fff; border-bottom: 1px solid #EDE9E2; position: sticky; top: 0; z-index: 100; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon { width: 32px; height: 32px; background: #C8A96E; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
        .nav-logo-text { font-family: 'Playfair Display', serif; font-size: 16px; color: #2C1F0E; font-weight: 500; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-link { font-size: 13px; color: #9C8060; text-decoration: none; }
        .nav-link:hover { color: #2C1F0E; }
        .nav-btns { display: flex; gap: 10px; }
        .btn-outline { padding: 8px 18px; border: 1px solid #EDE9E2; border-radius: 9px; font-size: 13px; color: #7A6245; background: #fff; text-decoration: none; }
        .btn-solid { padding: 8px 18px; border: none; border-radius: 9px; font-size: 13px; color: #fff; background: #2C1F0E; text-decoration: none; }
        .hero { text-align: center; padding: 80px 60px 60px; }
        .tag { display: inline-flex; background: #FBF6EE; border: 1px solid #EDE9E2; border-radius: 20px; padding: 5px 14px; font-size: 11px; color: #C8A96E; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 20px; }
        h1 { font-family: 'Playfair Display', serif; font-size: 48px; color: #1A0F00; font-weight: 500; line-height: 1.15; margin-bottom: 16px; }
        h1 em { font-style: italic; color: #C8A96E; }
        .sub { font-size: 15px; color: #9C8060; line-height: 1.75; font-weight: 300; max-width: 560px; margin: 0 auto; }
        .team { padding: 60px; }
        .section-label { font-size: 11px; color: #C8A96E; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 32px; color: #1A0F00; font-weight: 400; margin-bottom: 40px; }
        .team-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 700px; }
        .team-card { background: #fff; border-radius: 16px; padding: 28px; border: 1px solid #EDE9E2; display: flex; align-items: center; gap: 16px; }
        .team-avatar { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #C8A96E, #9C7040); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 18px; color: #fff; flex-shrink: 0; }
        .team-name { font-size: 15px; color: #2C1F0E; font-weight: 500; }
        .team-role { font-size: 12px; color: #9C8060; margin-top: 3px; }
        .team-id { font-size: 11px; color: #C4B49A; margin-top: 2px; }
        .mission { background: #2C1F0E; padding: 60px; margin: 0 0 60px; }
        .mission h2 { font-family: 'Playfair Display', serif; font-size: 32px; color: #C8A96E; font-weight: 400; margin-bottom: 16px; }
        .mission p { font-size: 14px; color: #9C8060; line-height: 1.8; font-weight: 300; max-width: 600px; }
        .tech { padding: 0 60px 60px; }
        .tech-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .tech-card { background: #fff; border-radius: 12px; padding: 18px; border: 1px solid #EDE9E2; text-align: center; }
        .tech-name { font-size: 14px; color: #2C1F0E; font-weight: 500; margin-bottom: 4px; }
        .tech-desc { font-size: 11px; color: #9C8060; }
        footer { background: #1A0F00; padding: 40px 60px; display: flex; align-items: center; justify-content: space-between; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 16px; color: #C8A96E; }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { font-size: 12px; color: #7A6245; text-decoration: none; }
        .footer-copy { font-size: 12px; color: #4A3520; }
        @media (max-width: 768px) {
          nav { padding: 16px 24px; } .nav-links { display: none; }
          .hero { padding: 48px 24px 40px; } h1 { font-size: 32px; }
          .team { padding: 40px 24px; } .team-grid { grid-template-columns: 1fr; }
          .mission { padding: 40px 24px; } .tech { padding: 0 24px 40px; }
          .tech-grid { grid-template-columns: repeat(2, 1fr); }
          footer { flex-direction: column; gap: 20px; padding: 32px 24px; text-align: center; }
        }
      `}</style>

      <nav>
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <span className="nav-logo-text">Libra</span>
        </Link>
        <div className="nav-links">
          <Link className="nav-link" href="/">Home</Link>
          <Link className="nav-link" href="/about">About</Link>
          <Link className="nav-link" href="/contact">Contact</Link>
        </div>
        <div className="nav-btns">
          <Link className="btn-outline" href="/login">Sign in</Link>
          <Link className="btn-solid" href="/register">Get started</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="tag">About us</div>
        <h1>Built for <em>readers,</em><br/>by readers</h1>
        <p className="sub">Libra is a web-based library management system built as a final project for the Web Programming course at FAST National University, Spring 2026.</p>
      </section>

      <div className="mission">
        <h2>Our mission</h2>
        <p>To digitize and simplify library management — making it easier for students to access books and for administrators to manage library resources efficiently, securely, and beautifully.</p>
      </div>

      <section className="team">
        <div className="section-label">The team</div>
        <div className="section-title">Who built this</div>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">MA</div>
            <div>
              <div className="team-name">Muhammad Anas</div>
              <div className="team-role">Full Stack Developer</div>
              <div className="team-id">23I-0017 — Section B</div>
            </div>
          </div>
          <div className="team-card">
            <div className="team-avatar">MY</div>
            <div>
              <div className="team-name">Mudassir Yaseen</div>
              <div className="team-role">Full Stack Developer</div>
              <div className="team-id">23I-0017 — Section B</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tech">
        <div className="section-label">Tech stack</div>
        <div className="section-title">Built with</div>
        <div className="tech-grid">
          <div className="tech-card"><div className="tech-name">Next.js 16</div><div className="tech-desc">Frontend & Backend</div></div>
          <div className="tech-card"><div className="tech-name">Prisma 7</div><div className="tech-desc">ORM & Database</div></div>
          <div className="tech-card"><div className="tech-name">MySQL</div><div className="tech-desc">Database</div></div>
          <div className="tech-card"><div className="tech-name">Auth.js v5</div><div className="tech-desc">Authentication</div></div>
          <div className="tech-card"><div className="tech-name">bcryptjs</div><div className="tech-desc">Password Hashing</div></div>
          <div className="tech-card"><div className="tech-name">Railway</div><div className="tech-desc">Cloud Database</div></div>
          <div className="tech-card"><div className="tech-name">Vercel</div><div className="tech-desc">Deployment</div></div>
          <div className="tech-card"><div className="tech-name">Tailwind CSS</div><div className="tech-desc">Styling</div></div>
        </div>
      </section>

      <footer>
        <div className="footer-logo">Libra</div>
        <div className="footer-links">
          <Link className="footer-link" href="/">Home</Link>
          <Link className="footer-link" href="/about">About</Link>
          <Link className="footer-link" href="/contact">Contact</Link>
        </div>
        <div className="footer-copy">© 2026 Libra. All rights reserved.</div>
      </footer>
    </>
  );
}