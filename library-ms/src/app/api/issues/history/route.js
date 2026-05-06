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
  const search = searchParams.get("search") || "";

  const history = await prisma.issuedBook.findMany({
    where: {
      userId: parseInt(session.user.id),
      ...(search ? { book: { title: { contains: search } } } : {}),
    },
    include: { book: true },
    orderBy: { issuedAt: "desc" },
  });

  return Response.json({ history });
}