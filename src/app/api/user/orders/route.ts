// app/api/user/orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";
import {
  ok,
  fail,
  requireUser,
  parsePagination,
  paginated,
} from "../../../../lib/utils";

// GET /api/user/orders?page=1&limit=10
export async function GET(req: NextRequest) {
  try {
    const result = await requireUser(req);

    if (result instanceof NextResponse) {
      return result;
    }

    const userId = result;

    const { page, limit, skip } =
      parsePagination(req.url);

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

      WHERE o.userId = ?

      ORDER BY o.createdAt DESC

      LIMIT ? OFFSET ?
      `,
      [userId, limit, skip]
    );

    for (const order of orders) {
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
        [order.id]
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
    }

    const [countRows]: any = await db.query(
      `
      SELECT COUNT(*) as total
      FROM orders
      WHERE userId = ?
      `,
      [userId]
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
    return fail(error.message);
  }
}

// POST /api/user/orders
export async function POST(req: NextRequest) {
  try {
    const result = await requireUser(req);

    if (result instanceof NextResponse) {
      return result;
    }

    const userId = result;

    const body = await req.json();
    const { addressId, items } = body;

    if (!addressId) {
      return fail("addressId is required");
    }

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return fail("items are required");
    }

    const [addresses]: any = await db.query(
      `
      SELECT *
      FROM address
      WHERE id = ?
      AND userId = ?
      LIMIT 1
      `,
      [Number(addressId), userId]
    );

    if (addresses.length === 0) {
      return fail("Address not found", 404);
    }

    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const [products]: any = await db.query(
        `
        SELECT *
        FROM product
        WHERE id = ?
        LIMIT 1
        `,
        [Number(item.productId)]
      );

      if (products.length === 0) {
        return fail(
          `Product ${item.productId} not found`,
          404
        );
      }

      const product = products[0];

      const price = Number(
        product.discountPrice ??
          product.price
      );

      total +=
        price * Number(item.quantity);

      orderItemsData.push({
        productId: product.id,
        quantity: Number(item.quantity),
        price,
        size: item.size ?? null,
        color: item.color ?? null,
      });
    }

    const [orderResult]: any = await db.query(
      `
      INSERT INTO orders
      (
        userId,
        addressId,
        total,
        status,
        createdAt,
        updatedAt
      )
      VALUES
      (?, ?, ?, 'PENDING', NOW(), NOW())
      `,
      [
        userId,
        Number(addressId),
        total,
      ]
    );

    const orderId =
      orderResult.insertId;

    for (const item of orderItemsData) {
      await db.query(
        `
        INSERT INTO orderitem
        (
          orderId,
          productId,
          quantity,
          price,
          size,
          color
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.productId,
          item.quantity,
          item.price,
          item.size,
          item.color,
        ]
      );
    }

    const [createdOrder]: any =
      await db.query(
        `
        SELECT *
        FROM orders
        WHERE id = ?
        `,
        [orderId]
      );

    return ok(
      createdOrder[0],
      201
    );
  } catch (error: any) {
    return fail(error.message);
  }
}