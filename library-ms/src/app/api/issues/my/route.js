import { auth } from "../../../../auth";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export async function GET(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "ISSUED";

  const where = {
    userId: parseInt(session.user.id),
    ...(status !== "all" ? { status } : {}),
  };

  const issuedBooks = await prisma.issuedBook.findMany({
    where,
    include: { book: true },
    orderBy: { issuedAt: "desc" },
  });

  const returned = await prisma.issuedBook.count({
    where: { userId: parseInt(session.user.id), status: "RETURNED" },
  });

  const pending = await prisma.issuedBook.count({
    where: { userId: parseInt(session.user.id), status: "ISSUED" },
  });

  const nearest = issuedBooks.find((i) => i.status === "ISSUED");
  const daysLeft = nearest
    ? Math.ceil((new Date(nearest.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return Response.json({
    issuedBooks,
    stats: {
      issued: pending,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      returned,
      pending,
    },
  });
}