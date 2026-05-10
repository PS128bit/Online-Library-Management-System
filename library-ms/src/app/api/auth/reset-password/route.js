import { PrismaClient } from "../../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export async function POST(request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) return Response.json({ error: "Token and password required." }, { status: 400 });
    if (password.length < 8) return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken) return Response.json({ error: "Invalid or expired reset link." }, { status: 400 });
    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return Response.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return Response.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}