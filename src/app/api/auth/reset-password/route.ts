// app/api/auth/reset-password/route.ts

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../../lib/db";
import { ok, fail } from "../../../../lib/utils";

// POST /api/auth/reset-password
// Body: { email, otp, newPassword }

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email?.trim()) {
      return fail("Email is required");
    }

    if (!otp) {
      return fail("OTP is required");
    }

    if (!newPassword || newPassword.length < 6) {
      return fail("Password must be at least 6 characters");
    }

    const emailAddress = email.trim().toLowerCase();

    const [users]: any = await db.query(
      `
      SELECT *
      FROM user
      WHERE email = ?
      LIMIT 1
      `,
      [emailAddress]
    );

    if (users.length === 0) {
      return fail("Invalid OTP");
    }

    const user = users[0];

    if (!user.otp || user.otp !== otp) {
      return fail("Invalid OTP");
    }

    if (
      !user.otpExpiresAt ||
      new Date(user.otpExpiresAt) < new Date()
    ) {
      return fail(
        "OTP has expired. Please request a new one."
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password and clear OTP
    await db.query(
      `
      UPDATE user
      SET
        password = ?,
        otp = NULL,
        otpExpiresAt = NULL,
        updatedAt = NOW()
      WHERE id = ?
      `,
      [hashedPassword, user.id]
    );

    // Revoke all active tokens
    await db.query(
      `
      DELETE FROM usertoken
      WHERE userId = ?
      `,
      [user.id]
    );

    return ok({
      message:
        "Password reset successful. Please login again.",
    });
  } catch (error: any) {
    return fail(error.message || "Password reset failed");
  }
}