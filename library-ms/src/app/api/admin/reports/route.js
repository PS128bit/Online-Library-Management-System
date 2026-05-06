import { auth } from "../../../../auth";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalBooks, totalUsers, totalIssued, overdueCount, overdueBooks, categoryStats, mostIssued] =
    await Promise.all([
      prisma.book.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.issuedBook.count(),
      prisma.issuedBook.count({ where: { status: "ISSUED", dueDate: { lt: new Date() } } }),
      prisma.issuedBook.findMany({
        where: { status: "ISSUED", dueDate: { lt: new Date() } },
        include: { book: true, user: true },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      prisma.book.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
      }),
      prisma.book.findMany({
        take: 5,
        orderBy: { issuedBooks: { _count: "desc" } },
        include: { _count: { select: { issuedBooks: true } } },
      }),
    ]);

  return Response.json({
    stats: { totalBooks, totalUsers, totalIssued, overdueCount },
    overdueBooks,
    categoryStats,
    mostIssued,
  });
}