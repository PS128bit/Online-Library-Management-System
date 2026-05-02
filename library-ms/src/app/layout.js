import AuthProvider from "../components/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "Online Library Management System",
  description: "Manage library resources digitally",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}