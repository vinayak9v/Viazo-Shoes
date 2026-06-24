// src/lib/utils.ts
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// ─── Response helpers ─────────────────────────────
export const ok = (data: unknown, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

export const fail = (message: string, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

// ─── Pagination helper ────────────────────────────
export function parsePagination(url: string) {
  const { searchParams } = new URL(url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginated<T>(data: T[], total: number, page: number, limit: number) {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── JWT helpers ──────────────────────────────────
const SECRET = process.env.JWT_SECRET!;

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, SECRET) as { userId: number };
  } catch {
    return null;
  }
}

// ─── OTP helper ───────────────────────────────────
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function otpExpiry(): Date {
  const mins = Number(process.env.OTP_EXPIRY_MINUTES ?? 10);
  return new Date(Date.now() + mins * 60 * 1000);
}

// ─── Mailer ──────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string, subject: string) {
  await transporter.sendMail({
    from: `"Shoe Store" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2>Your OTP Code</h2>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px">${otp}</p>
        <p>This code expires in ${process.env.OTP_EXPIRY_MINUTES ?? 10} minutes.</p>
        <p>If you did not request this, please ignore.</p>
      </div>
    `,
  });
}

// ─── Auth middleware for user routes ─────────────



import { NextRequest } from "next/server";

export async function requireUser(
  req: NextRequest
): Promise<number | NextResponse> {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return fail("Token required", 401);
  }

  const payload = verifyToken(token);

  if (!payload) {
    return fail("Invalid or expired token", 401);
  }

  return payload.userId;
}