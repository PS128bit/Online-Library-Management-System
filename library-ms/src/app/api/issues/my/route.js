import { auth } from "../../../../auth";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const issuedBooks = await prisma.issuedBook.findMany({
    where: {
      userId: parseInt(session.user.id),
      status: "ISSUED",
    },
    include: {
      book: true,
    },
    orderBy: { issuedAt: "desc" },
  });

  const returned = await prisma.issuedBook.count({
    where: { userId: parseInt(session.user.id), status: "RETURNED" },
  });

  const pending = await prisma.issuedBook.count({
    where: { userId: parseInt(session.user.id), status: "ISSUED" },
  });

  const nearest = issuedBooks[0];
  const daysLeft = nearest
    ? Math.ceil((new Date(nearest.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return Response.json({
    issuedBooks,
    stats: {
      issued: issuedBooks.length,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      returned,
      pending,
    },
  });
}