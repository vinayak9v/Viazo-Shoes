// app/api/user/addresses/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../lib/db";
import { ok, fail, requireUser } from "../../../../../lib/utils";

// PUT /api/user/addresses/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireUser(req);

    if (result instanceof NextResponse) {
      return result;
    }

    const userId = result;

    const { id: idParam } = await params;
    const id = Number(idParam);

    const [addresses]: any = await db.query(
      `
      SELECT *
      FROM address
      WHERE id = ? AND userId = ?
      LIMIT 1
      `,
      [id, userId]
    );

    if (addresses.length === 0) {
      return fail("Address not found", 404);
    }

    const address = addresses[0];
    const body = await req.json();

    // Default address update
    if (body.isDefault) {
      await db.query(
        `
        UPDATE address
        SET isDefault = 0
        WHERE userId = ?
        AND id <> ?
        `,
        [userId, id]
      );
    }

    await db.query(
      `
      UPDATE address
      SET
        label = ?,
        line1 = ?,
        line2 = ?,
        city = ?,
        state = ?,
        pincode = ?,
        isDefault = ?
      WHERE id = ?
      `,
      [
        body.label?.trim() ?? address.label,
        body.line1?.trim() ?? address.line1,
        body.line2 !== undefined
          ? body.line2?.trim() ?? null
          : address.line2,
        body.city?.trim() ?? address.city,
        body.state?.trim() ?? address.state,
        body.pincode?.trim() ?? address.pincode,
        body.isDefault ?? address.isDefault,
        id,
      ]
    );

    const [updated]: any = await db.query(
      "SELECT * FROM address WHERE id = ?",
      [id]
    );

    return ok(updated[0]);
  } catch (error: any) {
    return fail(error.message);
  }
}

// DELETE /api/user/addresses/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireUser(req);

    if (result instanceof NextResponse) {
      return result;
    }

    const userId = result;

    const { id: idParam } = await params;
    const id = Number(idParam);

    const [addresses]: any = await db.query(
      `
      SELECT *
      FROM address
      WHERE id = ? AND userId = ?
      LIMIT 1
      `,
      [id, userId]
    );

    if (addresses.length === 0) {
      return fail("Address not found", 404);
    }

    await db.query(
      "DELETE FROM address WHERE id = ?",
      [id]
    );

    return ok({
      message: "Address deleted",
    });
  } catch (error: any) {
    return fail(error.message);
  }
}