// app/api/user/addresses/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";
import { ok, fail, requireUser } from "../../../../lib/utils";

// GET /api/user/addresses
export async function GET(req: NextRequest) {
  try {
    const result = await requireUser(req);

    if (result instanceof NextResponse) {
      return result;
    }

    const userId = result;

    const [addresses]: any = await db.query(
      `
      SELECT *
      FROM address
      WHERE userId = ?
      ORDER BY isDefault DESC, id DESC
      `,
      [userId]
    );

    return ok(addresses);
  } catch (error: any) {
    return fail(error.message);
  }
}

// POST /api/user/addresses
export async function POST(req: NextRequest) {
  try {
    const result = await requireUser(req);

    if (result instanceof NextResponse) {
      return result;
    }

    const userId = result;

    const body = await req.json();

    const {
      label,
      line1,
      line2,
      city,
      state,
      pincode,
      isDefault = false,
    } = body;

    if (!label?.trim()) {
      return fail("Label is required");
    }

    if (!line1?.trim()) {
      return fail("Address line 1 is required");
    }

    if (!city?.trim()) {
      return fail("City is required");
    }

    if (!state?.trim()) {
      return fail("State is required");
    }

    if (!pincode?.trim()) {
      return fail("Pincode is required");
    }

    // If default address selected
    if (isDefault) {
      await db.query(
        `
        UPDATE address
        SET isDefault = 0
        WHERE userId = ?
        `,
        [userId]
      );
    }

    const [resultInsert]: any = await db.query(
      `
      INSERT INTO address
      (
        userId,
        label,
        line1,
        line2,
        city,
        state,
        pincode,
        isDefault
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        label.trim(),
        line1.trim(),
        line2?.trim() || null,
        city.trim(),
        state.trim(),
        pincode.trim(),
        isDefault ? 1 : 0,
      ]
    );

    const [addresses]: any = await db.query(
      `
      SELECT *
      FROM address
      WHERE id = ?
      `,
      [resultInsert.insertId]
    );

    return ok(addresses[0], 201);
  } catch (error: any) {
    return fail(error.message);
  }
}