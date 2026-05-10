import Link from "next/link";

export const metadata = { title: "Contact — Libra" };

export default function ContactPage() {
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
        .sub { font-size: 15px; color: #9C8060; line-height: 1.75; font-weight: 300; max-width: 480px; margin: 0 auto; }
        .content { padding: 0 60px 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; max-width: 900px; margin: 0 auto; }
        .info-card { background: #fff; border-radius: 16px; padding: 28px; border: 1px solid #EDE9E2; }
        .info-card h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #2C1F0E; font-weight: 400; margin-bottom: 20px; }
        .info-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
        .info-icon { width: 36px; height: 36px; border-radius: 9px; background: #FBF6EE; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .info-label { font-size: 11px; color: #9C8060; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
        .info-value { font-size: 13px; color: #2C1F0E; }
        .info-value a { color: #C8A96E; text-decoration: none; }
        .form-card { background: #fff; border-radius: 16px; padding: 28px; border: 1px solid #EDE9E2; }
        .form-card h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #2C1F0E; font-weight: 400; margin-bottom: 20px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 11px; color: #7A6245; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 7px; }
        .field input, .field textarea { width: 100%; padding: 12px 14px; border: 1px solid #EDE9E2; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #2C1F0E; background: #FAF8F5; outline: none; }
        .field input:focus, .field textarea:focus { border-color: #C8A96E; }
        .field textarea { height: 100px; resize: none; }
        .submit-btn { width: 100%; padding: 13px; background: #2C1F0E; color: #F5EFE6; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; }
        .submit-btn:hover { background: #3D2E14; }
        footer { background: #1A0F00; padding: 40px 60px; display: flex; align-items: center; justify-content: space-between; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 16px; color: #C8A96E; }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { font-size: 12px; color: #7A6245; text-decoration: none; }
        .footer-copy { font-size: 12px; color: #4A3520; }
        @media (max-width: 768px) {
          nav { padding: 16px 24px; } .nav-links { display: none; }
          .hero { padding: 48px 24px 40px; } h1 { font-size: 32px; }
          .content { grid-template-columns: 1fr; padding: 0 24px 48px; }
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
        <div className="tag">Contact us</div>
        <h1>Get in <em>touch</em></h1>
        <p className="sub">Have a question or issue? Reach out to us and we'll get back to you as soon as possible.</p>
      </section>

      <div className="content">
        <div className="info-card">
          <h2>Contact information</h2>
          <div className="info-item">
            <div className="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <div className="info-label">Email</div>
              <div className="info-value"><a href="mailto:anaskhattak727@gmail.com">anaskhattak727@gmail.com</a></div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <div className="info-label">University</div>
              <div className="info-value">FAST National University, Islamabad</div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div>
              <div className="info-label">Course</div>
              <div className="info-value">Web Programming — Spring 2026</div>
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2>Send a message</h2>
          <form action={`mailto:anaskhattak727@gmail.com`} method="get" encType="text/plain">
            <div className="field">
              <label>Your name</label>
              <input type="text" name="name" placeholder="Muhammad Anas" required />
            </div>
            <div className="field">
              <label>Your email</label>
              <input type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea name="body" placeholder="Your message here..." required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send message</button>
          </form>
        </div>
      </div>

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