// app/api/phonepe/create-order/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";
import { createPhonePeOrder } from "../../../../lib/phonepe";
import { ok, fail, requireUser } from "../../../../lib/utils";

// POST /api/phonepe/create-order
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

    if (!items || !Array.isArray(items) || items.length === 0) {
      return fail("items are required");
    }

    // Check address
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
    const orderItemsData: any[] = [];

    // Validate products
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
        product.discountPrice ?? product.price
      );

      total += price * Number(item.quantity);

      orderItemsData.push({
        productId: product.id,
        quantity: Number(item.quantity),
        price,
        size: item.size ?? null,
        color: item.color ?? null,
      });
    }

    // Create order
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

    const orderId = orderResult.insertId;

    // Insert order items
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

    const merchantOrderId =
      `ORD${orderId}-${Date.now()}`;

    let phonePeResponse;

    try {
      phonePeResponse =
        await createPhonePeOrder({
          merchantOrderId,
          amountInPaise: Math.round(
            total * 100
          ),
          redirectUrl:
            `${process.env.APP_BASE_URL}` +
            `/payment-status?orderId=${orderId}` +
            `&merchantOrderId=${merchantOrderId}`,
        });
    } catch (err: any) {
      await db.query(
        `
        UPDATE orders
        SET status = 'CANCELLED'
        WHERE id = ?
        `,
        [orderId]
      );

      return fail(
        "Failed to create PhonePe order: " +
          (err?.response?.data?.message ??
            err.message),
        500
      );
    }

    const redirectUrl =
      phonePeResponse.redirectUrl;

    // Save payment
    await db.query(
      `
      INSERT INTO payment
      (
        orderId,
        razorpayOrderId,
        amount,
        currency,
        status,
        createdAt,
        updatedAt
      )
      VALUES
      (?, ?, ?, 'INR', 'PENDING', NOW(), NOW())
      `,
      [
        orderId,
        merchantOrderId,
        total,
      ]
    );

    return ok(
      {
        orderId,
        merchantOrderId,
        redirectUrl,
      },
      201
    );
  } catch (error: any) {
    return fail(
      error.message ||
      "Failed to create order"
    );
  }
}