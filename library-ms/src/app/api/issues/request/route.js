import { auth } from "../../../../auth";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookId } = await request.json();
  if (!bookId) {
    return Response.json({ error: "Book ID is required." }, { status: 400 });
  }

  const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
  if (!book) return Response.json({ error: "Book not found." }, { status: 404 });
  if (book.available === 0) return Response.json({ error: "No copies available for this book." }, { status: 400 });

  // Check if already issued
  const existing = await prisma.issuedBook.findFirst({
    where: { userId: parseInt(session.user.id), bookId: parseInt(bookId), status: "ISSUED" },
  });
  if (existing) return Response.json({ error: "You already have this book issued." }, { status: 400 });

  // Set due date 14 days from now
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  await prisma.$transaction([
    prisma.issuedBook.create({
      data: {
        userId: parseInt(session.user.id),
        bookId: parseInt(bookId),
        dueDate,
        status: "ISSUED",
      },
    }),
    prisma.book.update({
      where: { id: parseInt(bookId) },
      data: { available: { decrement: 1 } },
    }),
  ]);

  return Response.json({ message: "Book requested successfully", bookTitle: book.title }, { status: 201 });
}