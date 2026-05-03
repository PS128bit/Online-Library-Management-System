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

  const [totalBooks, totalUsers, activeIssues, overdue, recentIssues, recentUsers] =
    await Promise.all([
      prisma.book.count(),
      prisma.user.count(),
      prisma.issuedBook.count({ where: { status: "ISSUED" } }),
      prisma.issuedBook.count({
        where: { status: "ISSUED", dueDate: { lt: new Date() } },
      }),
      prisma.issuedBook.findMany({
        take: 5,
        orderBy: { issuedAt: "desc" },
        include: { book: true, user: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { role: "STUDENT" },
      }),
    ]);

  return Response.json({
    stats: { totalBooks, totalUsers, activeIssues, overdue },
    recentIssues,
    recentUsers,
  });
}