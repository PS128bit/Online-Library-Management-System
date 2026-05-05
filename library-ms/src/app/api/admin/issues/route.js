import { auth } from "../../../../auth";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

// GET — fetch all issues with search, filter, pagination
export async function GET(request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = {
    AND: [
      search ? {
        OR: [
          { book: { title: { contains: search } } },
          { user: { name: { contains: search } } },
        ],
      } : {},
      status !== "all" ? { status } : {},
    ],
  };

  const [issues, total, active, overdue, returned] = await Promise.all([
    prisma.issuedBook.findMany({
      where,
      skip,
      take: limit,
      orderBy: { issuedAt: "desc" },
      include: { book: true, user: true },
    }),
    prisma.issuedBook.count({ where }),
    prisma.issuedBook.count({ where: { status: "ISSUED" } }),
    prisma.issuedBook.count({ where: { status: "ISSUED", dueDate: { lt: new Date() } } }),
    prisma.issuedBook.count({ where: { status: "RETURNED" } }),
  ]);

  return Response.json({
    issues,
    totalPages: Math.ceil(total / limit),
    stats: { total, active, overdue, returned },
  });
}

// POST — issue a book to a user
export async function POST(request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, bookId, dueDate } = await request.json();

  if (!userId || !bookId || !dueDate) {
    return Response.json({ error: "User, book and due date are required." }, { status: 400 });
  }

  // Check book availability
  const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
  if (!book) return Response.json({ error: "Book not found." }, { status: 404 });
  if (book.available === 0) return Response.json({ error: "No copies available." }, { status: 400 });

  // Check user doesn't already have this book
  const existing = await prisma.issuedBook.findFirst({
    where: { userId: parseInt(userId), bookId: parseInt(bookId), status: "ISSUED" },
  });
  if (existing) return Response.json({ error: "This user already has this book issued." }, { status: 400 });

  // Create issue and decrement available count
  const [issue] = await prisma.$transaction([
    prisma.issuedBook.create({
      data: {
        userId: parseInt(userId),
        bookId: parseInt(bookId),
        dueDate: new Date(dueDate),
        status: "ISSUED",
      },
    }),
    prisma.book.update({
      where: { id: parseInt(bookId) },
      data: { available: { decrement: 1 } },
    }),
  ]);

  return Response.json({ message: "Book issued successfully", issue }, { status: 201 });
}

// PUT — mark a book as returned
export async function PUT(request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return Response.json({ error: "Issue ID is required." }, { status: 400 });

  const issue = await prisma.issuedBook.findUnique({ where: { id: parseInt(id) } });
  if (!issue) return Response.json({ error: "Issue not found." }, { status: 404 });
  if (issue.status === "RETURNED") return Response.json({ error: "Book already returned." }, { status: 400 });

  // Mark returned and increment available count
  await prisma.$transaction([
    prisma.issuedBook.update({
      where: { id: parseInt(id) },
      data: { status: "RETURNED", returnedAt: new Date() },
    }),
    prisma.book.update({
      where: { id: issue.bookId },
      data: { available: { increment: 1 } },
    }),
  ]);

  return Response.json({ message: "Book returned successfully" });
}