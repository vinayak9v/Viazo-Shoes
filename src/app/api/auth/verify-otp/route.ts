// app/api/auth/verify-otp/route.ts

import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { ok, fail, signToken } from "../../../../lib/utils";

// POST /api/auth/verify-otp
// Body: { userId, otp }

export async function POST(req: NextRequest) {
  try {
    const { userId, otp } = await req.json();

    if (!userId || !otp) {
      return fail("userId and otp are required");
    }

    const [users]: any = await db.query(
      `
      SELECT *
      FROM user
      WHERE id = ?
      LIMIT 1
      `,
      [Number(userId)]
    );

    if (users.length === 0) {
      return fail("User not found", 404);
    }

    const user = users[0];

    if (user.isVerified) {
      return fail("Account already verified");
    }

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

    // Verify account and clear OTP
    await db.query(
      `
      UPDATE user
      SET
        isVerified = 1,
        otp = NULL,
        otpExpiresAt = NULL,
        updatedAt = NOW()
      WHERE id = ?
      `,
      [user.id]
    );

    // Generate JWT token
    const token = signToken({
      userId: user.id,
    });

    // Save token
    await db.query(
      `
      INSERT INTO usertoken
      (userId, token, createdAt)
      VALUES (?, ?, NOW())
      `,
      [user.id, token]
    );

    return ok({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    return fail(error.message || "OTP verification failed");
  }
}