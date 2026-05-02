import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1>Online Library Management System</h1>
      <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </div>
  );
}