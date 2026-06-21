// app/api/admin/orders/[id]/route.ts

import { NextRequest } from "next/server";
import db from "../../../../../lib/db";
import { ok, fail } from "../../../../../lib/utils";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// PATCH /api/admin/orders/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    if (isNaN(id)) return fail("Invalid Order ID");

    const body = await req.json();
    const { status } = body;

    if (!VALID_STATUSES.includes(status)) {
      return fail(
        `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`
      );
    }

    const [orders]: any = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (orders.length === 0) {
      return fail("Order not found", 404);
    }

    await db.query(
      `UPDATE orders
       SET status = ?, updatedAt = NOW()
       WHERE id = ?`,
      [status, id]
    );

    const [updated]: any = await db.query(
      `
      SELECT
        o.*,
        u.id as userId,
        u.name as userName,
        u.email as userEmail
      FROM orders o
      LEFT JOIN user u ON u.id = o.userId
      WHERE o.id = ?
      `,
      [id]
    );

    return ok(updated[0]);
  } catch (error: any) {
    return fail(error.message);
  }
}

// GET /api/admin/orders/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    if (isNaN(id)) return fail("Invalid Order ID");

    const [orders]: any = await db.query(
      `
      SELECT
        o.*,

        u.id as userId,
        u.name as userName,
        u.phone as userPhone,
        u.email as userEmail,

        a.id as addressId,
        a.label,
        a.line1,
        a.line2,
        a.city,
        a.state,
        a.pincode

      FROM orders o
      LEFT JOIN user u ON u.id = o.userId
      LEFT JOIN address a ON a.id = o.addressId
      WHERE o.id = ?
      `,
      [id]
    );

    if (orders.length === 0) {
      return fail("Order not found", 404);
    }

    const [items]: any = await db.query(
      `
      SELECT
        oi.*,
        p.name as productName,
        p.sku,
        (
          SELECT imageUrl
          FROM productimage pi
          WHERE pi.productId = p.id
          LIMIT 1
        ) as imageUrl

      FROM orderitem oi
      LEFT JOIN product p ON p.id = oi.productId
      WHERE oi.orderId = ?
      `,
      [id]
    );

    const order = {
      ...orders[0],
      items,
    };

    return ok(order);
  } catch (error: any) {
    return fail(error.message);
  }
}