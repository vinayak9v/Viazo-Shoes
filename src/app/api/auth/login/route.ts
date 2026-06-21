// app/api/auth/login/route.ts

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../../lib/db";
import { ok, fail, signToken } from "../../../../lib/utils";

// POST /api/auth/login
// Body: { identifier, password }

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier?.trim()) {
      return fail("Phone or email is required");
    }

    if (!password) {
      return fail("Password is required");
    }

    const loginId = identifier.trim();

    // Find user by phone or email
    const [users]: any = await db.query(
      `
      SELECT *
      FROM user
      WHERE phone = ?
         OR email = ?
      LIMIT 1
      `,
      [loginId, loginId.toLowerCase()]
    );

    if (users.length === 0) {
      return fail("Invalid credentials", 401);
    }

    const user = users[0];

    if (!user.isVerified) {
      return fail(
        "Account not verified. Please verify your email first.",
        403
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return fail("Invalid credentials", 401);
    }

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
    return fail(error.message);
  }
}