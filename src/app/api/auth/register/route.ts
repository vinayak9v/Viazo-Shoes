// app/api/auth/register/route.ts

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../../lib/db";
import {
  ok,
  fail,
  generateOtp,
  otpExpiry,
  sendOtpEmail,
} from "../../../../lib/utils";

// POST /api/auth/register
// Body: { name, phone, email, password }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, phone, email, password } = body;

    if (!name?.trim()) {
      return fail("Name is required");
    }

    if (!phone?.trim()) {
      return fail("Phone is required");
    }

    if (!email?.trim()) {
      return fail("Email is required");
    }

    if (!password || password.length < 6) {
      return fail("Password must be at least 6 characters");
    }

    const emailAddress = email.trim().toLowerCase();
    const phoneNumber = phone.trim();

    // Check phone exists
    const [phoneRows]: any = await db.query(
      "SELECT id FROM user WHERE phone = ? LIMIT 1",
      [phoneNumber]
    );

    if (phoneRows.length > 0) {
      return fail("Phone number already registered");
    }

    // Check email exists
    const [emailRows]: any = await db.query(
      "SELECT id FROM user WHERE email = ? LIMIT 1",
      [emailAddress]
    );

    if (emailRows.length > 0) {
      return fail("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpExpiresAt = otpExpiry();

    const [result]: any = await db.query(
      `
      INSERT INTO user (
        name,
        phone,
        email,
        password,
        otp,
        otpExpiresAt,
        isVerified,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
      `,
      [
        name.trim(),
        phoneNumber,
        emailAddress,
        hashedPassword,
        otp,
        otpExpiresAt,
      ]
    );

    await sendOtpEmail(
      emailAddress,
      otp,
      "Verify your Viazo account"
    );

    return ok(
      {
        message:
          "OTP sent to your email. Please verify.",
        userId: result.insertId,
      },
      201
    );
  } catch (error: any) {
    return fail(error.message || "Registration failed");
  }
}