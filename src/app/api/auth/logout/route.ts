// app/api/auth/logout/route.ts

import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { ok, fail } from "../../../../lib/utils";

// POST /api/auth/logout
export async function POST(req: NextRequest) {
  try {
    const authHeader =
      req.headers.get("authorization") || "";

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return fail("Token required", 401);
    }

    await db.query(
      "DELETE FROM usertoken WHERE token = ?",
      [token]
    );

    return ok({
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return fail(error.message);
  }
}