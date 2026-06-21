// app/api/admin/orders/route.ts

import { NextRequest } from "next/server";
import db from "../../.././../lib/db";
import { ok, fail, parsePagination, paginated } from "../../.././../lib/utils";

// GET /api/admin/orders?page=1&limit=10&status=PENDING
export async function GET(req: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(req.url);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let whereClause = "";
    const params: any[] = [];

    if (status) {
      whereClause = "WHERE o.status = ?";
      params.push(status);
    }

    const [orders]: any = await db.query(
      `
      SELECT
        o.*,

        u.id AS userId,
        u.name AS userName,
        u.phone AS userPhone,
        u.email AS userEmail,

        a.id AS addressId,
        a.label,
        a.line1,
        a.line2,
        a.city,
        a.state,
        a.pincode

      FROM orders o
      LEFT JOIN user u ON u.id = o.userId
      LEFT JOIN address a ON a.id = o.addressId

      ${whereClause}

      ORDER BY o.createdAt DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, skip]
    );

    // Order items load karo
    for (const order of orders) {
      const [items]: any = await db.query(
        `
        SELECT
          oi.*,
          p.id AS productId,
          p.name AS productName,
          p.sku
        FROM orderitem oi
        LEFT JOIN product p ON p.id = oi.productId
        WHERE oi.orderId = ?
        `,
        [order.id]
      );

      order.items = items;
    }

    const [countRows]: any = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM orders o
      ${whereClause}
      `,
      params
    );

    const total = countRows[0].total;

    return ok(
      paginated(
        orders,
        total,
        page,
        limit
      )
    );
  } catch (error: any) {
    return fail(error.message || "Something went wrong");
  }
}