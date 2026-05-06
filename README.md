# Online-Library-Management-System
A web-based application that digitizes and automates library operations. Features include user registration &amp; authentication, role-based access for admins and students, book search &amp; management, and an issue/return tracking system with due date monitoring.

# 📚 Libra — Online Library Management System

A full-stack web application for managing library operations digitally. Built with Next.js, Prisma, and MySQL.

---

## 🚀 Features

### Student
- Register and login securely
- Browse and search books by title, author, or category
- Request book issuance in one click
- View currently issued books with due date tracking
- View complete borrowing history

### Admin
- Manage books — add, edit, delete with search and filters
- Manage users — activate/deactivate accounts, change roles
- Issue books to students and mark returns
- View overdue books, category stats, and most issued books
- Full reports dashboard

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Next.js 15 (App Router) |
| Backend | Next.js API Routes |
| Database | MySQL (via XAMPP) |
| ORM | Prisma 7 |
| Auth | Auth.js v5 (NextAuth) |
| Styling | Tailwind CSS + Custom CSS |
| Password Hashing | bcryptjs |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- XAMPP (for MySQL)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/PS128bit/Online-Library-Management-System.git
cd Online-Library-Management-System/library-ms
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Start MySQL
- Open XAMPP Control Panel
- Start **Apache** and **MySQL**
- Open **phpMyAdmin** at `http://localhost/phpmyadmin`
- Create a database named `library-ms`

### 4. Configure environment variables
Create a `.env` file in the root of the project:
```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/library-ms"
NEXTAUTH_SECRET="your-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Run database migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 👤 Default Admin Setup

1. Register a new account at `/register`
2. Open phpMyAdmin → `library-ms` → `User` table
3. Find your user → click **Edit**
4. Change `role` from `STUDENT` to `ADMIN`
5. Click **Go**
6. Login at `/login` with the **Admin** pill selected

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                  # Backend API routes
│   │   ├── auth/             # Auth.js handler
│   │   ├── books/            # Public books API
│   │   ├── issues/           # Issue/return/history APIs
│   │   └── admin/            # Admin-only APIs
│   ├── admin/                # Admin pages
│   │   ├── dashboard/
│   │   ├── books/
│   │   ├── users/
│   │   ├── issues/
│   │   └── reports/
│   ├── dashboard/            # Student pages
│   │   ├── browse/
│   │   ├── my-books/
│   │   ├── requests/
│   │   └── history/
│   ├── login/
│   ├── register/
│   └── page.js               # Home/landing page
├── components/
│   ├── DashboardLayout.js    # Shared sidebar + topbar
│   └── AuthProvider.js       # Session provider
├── auth.js                   # Auth.js configuration
├── generated/prisma/         # Prisma generated client
prisma/
├── schema.prisma             # Database schema
└── migrations/               # Migration history
```

---

## 🔐 Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT sessions with 30-minute expiry
- Role-based middleware protecting `/dashboard` and `/admin` routes
- Server-side validation on all API routes
- Admin cannot deactivate their own account

---

## 🗄 Database Schema

```
User
  id, name, email, password, role (STUDENT/ADMIN), isActive, createdAt

Book
  id, title, author, isbn, category, totalCopies, available, createdAt

IssuedBook
  id, userId, bookId, issuedAt, dueDate, returnedAt, status (ISSUED/RETURNED/OVERDUE)
```

---

## 👨‍💻 Authors

- **Muhammad Anas** — 23I-0017
- **Mudassir Yaseen** — 23I-0017

FAST National University — Web Programming Project, Spring 2026

---

## 📄 License

This project was built for academic purposes.