// app/api/user/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";
import { ok, fail, requireUser } from "../../../../lib/utils";

// GET /api/user/profile
export async function GET(req: NextRequest) {
  try { 
    const result = await requireUser(req);

    if (result instanceof NextResponse) {
      return result;
    }

    const userId = result;

    const [users]: any = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        isVerified,
        createdAt
      FROM user
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (users.length === 0) {
      return fail("User not found", 404);
    }

    return ok(users[0]);
  } catch (error: any) {
    return fail(error.message);
  }
}

// PUT /api/user/profile
export async function PUT(req: NextRequest) {
  try {
    const result = await requireUser(req);

    if (result instanceof NextResponse) {
      return result;
    }

    const userId = result;

    const body = await req.json();

    const updates: string[] = [];
    const values: any[] = [];

    // Update name
    if (body.name?.trim()) {
      updates.push("name = ?");
      values.push(body.name.trim());
    }

    // Update phone
    if (body.phone?.trim()) {
      const [conflict]: any = await db.query(
        `
        SELECT id
        FROM user
        WHERE phone = ?
        AND id != ?
        LIMIT 1
        `,
        [body.phone.trim(), userId]
      );

      if (conflict.length > 0) {
        return fail("Phone number already in use");
      }

      updates.push("phone = ?");
      values.push(body.phone.trim());
    }

    if (updates.length === 0) {
      return fail("No valid fields to update");
    }

    updates.push("updatedAt = NOW()");

    await db.query(
      `
      UPDATE user
      SET ${updates.join(", ")}
      WHERE id = ?
      `,
      [...values, userId]
    );

    const [users]: any = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone
      FROM user
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    return ok(users[0]);
  } catch (error: any) {
    return fail(error.message);
  }
}