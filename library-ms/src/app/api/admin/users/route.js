import { auth } from "../../../../auth";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

// GET — fetch all users with search, filter, pagination
export async function GET(request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "all";
  const status = searchParams.get("status") || "all";
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = {
    AND: [
      search ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      } : {},
      role !== "all" ? { role } : {},
      status === "active" ? { isActive: true } : {},
      status === "inactive" ? { isActive: false } : {},
    ],
  };

  const [users, total, active, inactive, admins] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, email: true,
        role: true, isActive: true, createdAt: true,
        _count: { select: { issuedBooks: true } },
      },
    }),
    prisma.user.count({ where }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  return Response.json({
    users,
    totalPages: Math.ceil(total / limit),
    stats: { total, active, inactive, admins },
  });
}

// PUT — update user role or active status
export async function PUT(request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, isActive, role } = await request.json();

  if (!id) {
    return Response.json({ error: "User ID is required." }, { status: 400 });
  }

  // Prevent admin from deactivating themselves
  if (parseInt(id) === parseInt(session.user.id) && isActive === false) {
    return Response.json({ error: "You cannot deactivate your own account." }, { status: 400 });
  }

  const data = {};
  if (isActive !== undefined) data.isActive = isActive;
  if (role !== undefined) data.role = role;

  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data,
  });

  return Response.json({ message: "User updated successfully", user });
}