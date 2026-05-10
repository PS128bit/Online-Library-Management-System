"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const labels = {
    dashboard: "Dashboard",
    admin: "Admin",
    books: "Books",
    users: "Users",
    issues: "Issue / Return",
    reports: "Reports",
    browse: "Browse",
    "my-books": "My Books",
    requests: "Requests",
    history: "History",
  };

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = labels[seg] || seg;
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  if (crumbs.length <= 1) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "6px",
      padding: "10px 28px", background: "#18181F",
      borderBottom: "1px solid #26263A", fontSize: "12px"
    }}>
      <Link href="/" style={{ color: "#555", textDecoration: "none" }}>Home</Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#333" }}>›</span>
          {crumb.isLast
            ? <span style={{ color: "#888" }}>{crumb.label}</span>
            : <Link href={crumb.href} style={{ color: "#555", textDecoration: "none" }}>{crumb.label}</Link>
          }
        </span>
      ))}
    </div>
  );
}