// app/api/user/orders/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../lib/db";
import { ok, fail, requireUser } from "../../../../../lib/utils";

// GET /api/user/orders/:id
export async function GET(
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
    const orderId = Number(idParam);

    const [orders]: any = await db.query(
      `
      SELECT
        o.*,

        a.id as addressId,
        a.label,
        a.line1,
        a.line2,
        a.city,
        a.state,
        a.pincode,
        a.isDefault

      FROM orders o
      LEFT JOIN address a
        ON a.id = o.addressId

      WHERE o.id = ?
      AND o.userId = ?
      LIMIT 1
      `,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return fail("Order not found", 404);
    }

    const order = orders[0];

    const [items]: any = await db.query(
      `
      SELECT
        oi.*,

        p.id as productId,
        p.name,
        p.sku,

        (
          SELECT imageUrl
          FROM productimage pi
          WHERE pi.productId = p.id
          LIMIT 1
        ) as imageUrl

      FROM orderitem oi

      LEFT JOIN product p
        ON p.id = oi.productId

      WHERE oi.orderId = ?
      `,
      [orderId]
    );

    order.address = {
      id: order.addressId,
      label: order.label,
      line1: order.line1,
      line2: order.line2,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      isDefault: order.isDefault,
    };

    order.items = items.map((item: any) => ({
      ...item,
      product: {
        id: item.productId,
        name: item.name,
        sku: item.sku,
        images: item.imageUrl
          ? [{ imageUrl: item.imageUrl }]
          : [],
      },
    }));

    return ok(order);
  } catch (error: any) {
    return fail(error.message);
  }
}