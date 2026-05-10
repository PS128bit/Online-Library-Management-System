// src/app/api/auth/forgot-password/route.js
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import crypto from "crypto";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) return Response.json({ error: "Email required." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) return Response.json({ message: "If account exists, email sent." });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Send email via Gmail SMTP
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Libra Library" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your Libra password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #FAF8F5; border-radius: 12px;">
          <h2 style="color: #2C1F0E; font-size: 24px;">Reset your password</h2>
          <p style="color: #9C8060; font-size: 14px; line-height: 1.6;">Click the button below to reset your password. This link expires in 15 minutes.</p>
          <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #2C1F0E; color: #F5EFE6; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500;">Reset password</a>
          <p style="color: #C4B49A; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    return Response.json({ message: "Reset email sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}