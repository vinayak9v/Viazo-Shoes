import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { getPhonePeOrderStatus } from "../../../../lib/phonepe";
import { ok, fail } from "../../../../lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const merchantOrderId =
      searchParams.get("merchantOrderId");

    if (!merchantOrderId) {
      return fail("merchantOrderId required");
    }

    const statusResponse =
      await getPhonePeOrderStatus(
        merchantOrderId
      );

    const success =
      statusResponse?.success === true &&
      statusResponse?.data?.state === "COMPLETED";

    if (success) {
      const [payments]: any = await db.query(
        `
        SELECT *
        FROM payment
        WHERE razorpayOrderId = ?
        LIMIT 1
        `,
        [merchantOrderId]
      );

      if (payments.length > 0) {
        const payment = payments[0];

        await db.query(
          `
          UPDATE payment
          SET status='SUCCESS'
          WHERE id=?
          `,
          [payment.id]
        );

        await db.query(
          `
          UPDATE orders
          SET status='CONFIRMED'
          WHERE id=?
          `,
          [payment.orderId]
        );
      }
    }

    return ok(statusResponse);
  } catch (error: any) {
    return fail(error.message);
  }
}