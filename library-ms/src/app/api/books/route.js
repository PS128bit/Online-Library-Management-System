import { auth } from "../../../auth";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export async function GET(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = {
    AND: [
      search ? {
        OR: [
          { title: { contains: search } },
          { author: { contains: search } },
        ],
      } : {},
      category !== "all" ? { category } : {},
    ],
  };

  const [books, total] = await Promise.all([
    prisma.book.findMany({ where, skip, take: limit, orderBy: { title: "asc" } }),
    prisma.book.count({ where }),
  ]);

  return Response.json({ books, totalPages: Math.ceil(total / limit) });
}