// app/api/auth/forgot-password/route.ts

import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import {
  ok,
  fail,
  generateOtp,
  otpExpiry,
  sendOtpEmail,
} from "../../../../lib/utils";

// POST /api/auth/forgot-password
// Body: { email }

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return fail("Email is required");
    }

    const emailAddress = email.trim().toLowerCase();

    const [users]: any = await db.query(
      "SELECT id, email FROM user WHERE email = ? LIMIT 1",
      [emailAddress]
    );

    const user = users[0];

    // Don't reveal if email exists
    if (user) {
      const otp = generateOtp();

      await db.query(
        `
        UPDATE user
        SET
          otp = ?,
          otpExpiresAt = ?
        WHERE id = ?
        `,
        [
          otp,
          otpExpiry(),
          user.id,
        ]
      );

      await sendOtpEmail(
        user.email,
        otp,
        "Reset your Viazo password"
      );
    }

    return ok({
      message:
        "If the email exists, an OTP has been sent.",
    });
  } catch (error: any) {
    return fail(error.message);
  }
}