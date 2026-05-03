import { auth } from "../../../../auth";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

// GET — fetch all books with search, filter, pagination
export async function GET(request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const status = searchParams.get("status") || "all";
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = {
    AND: [
      search ? {
        OR: [
          { title: { contains: search } },
          { author: { contains: search } },
          { isbn: { contains: search } },
        ],
      } : {},
      category !== "all" ? { category } : {},
      status === "available" ? { available: { gt: 2 } } : {},
      status === "low" ? { available: { gt: 0, lte: 2 } } : {},
      status === "out" ? { available: 0 } : {},
    ],
  };

  const [books, total, totalAvailable, outOfStock, activeIssues] = await Promise.all([
    prisma.book.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.book.count({ where }),
    prisma.book.aggregate({ _sum: { available: true } }),
    prisma.book.count({ where: { available: 0 } }),
    prisma.issuedBook.count({ where: { status: "ISSUED" } }),
  ]);

  return Response.json({
    books,
    totalPages: Math.ceil(total / limit),
    stats: {
      total,
      available: totalAvailable._sum.available || 0,
      issued: activeIssues,
      outOfStock,
    },
  });
}

// POST — add a new book
export async function POST(request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, author, isbn, category, totalCopies, available } = await request.json();

  if (!title || !author || !isbn || !category) {
    return Response.json({ error: "Title, author, ISBN and category are required." }, { status: 400 });
  }

  if (available > totalCopies) {
    return Response.json({ error: "Available copies cannot exceed total copies." }, { status: 400 });
  }

  const existing = await prisma.book.findUnique({ where: { isbn } });
  if (existing) {
    return Response.json({ error: "A book with this ISBN already exists." }, { status: 400 });
  }

  const book = await prisma.book.create({
    data: { title, author, isbn, category, totalCopies: parseInt(totalCopies), available: parseInt(available) },
  });

  return Response.json({ message: "Book added successfully", book }, { status: 201 });
}

// PUT — update an existing book
export async function PUT(request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, author, isbn, category, totalCopies, available } = await request.json();

  if (!id || !title || !author || !isbn || !category) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }

  if (available > totalCopies) {
    return Response.json({ error: "Available copies cannot exceed total copies." }, { status: 400 });
  }

  const book = await prisma.book.update({
    where: { id: parseInt(id) },
    data: { title, author, isbn, category, totalCopies: parseInt(totalCopies), available: parseInt(available) },
  });

  return Response.json({ message: "Book updated successfully", book });
}

// DELETE — remove a book
export async function DELETE(request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return Response.json({ error: "Book ID is required." }, { status: 400 });
  }

  const activeIssues = await prisma.issuedBook.count({
    where: { bookId: parseInt(id), status: "ISSUED" },
  });

  if (activeIssues > 0) {
    return Response.json({ error: "Cannot delete a book that is currently issued." }, { status: 400 });
  }

  await prisma.book.delete({ where: { id: parseInt(id) } });

  return Response.json({ message: "Book deleted successfully" });
}