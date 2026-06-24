import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { getPhonePeOrderStatus } from "../../../../lib/phonepe";
import { ok, fail } from "../../../../lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const merchantOrderId = searchParams.get("merchantOrderId");

    if (!merchantOrderId) {
      return fail("merchantOrderId required");
    }

    // PhonePe Order Status
    const statusResponse = await getPhonePeOrderStatus(merchantOrderId);

    console.log("PhonePe Response:", statusResponse);

    // Payment Success Check
    const success = statusResponse?.state === "COMPLETED";

    if (success) {
      // Update Payment
      const [paymentResult]: any = await db.query(
        `
        UPDATE payment
        SET status='SUCCESS'
        WHERE razorpayOrderId=?
        `,
        [merchantOrderId]
      );

      console.log("Payment Update:", paymentResult);

      // Update Order
      const [orderResult]: any = await db.query(
        `
        UPDATE orders
        SET status='CONFIRMED'
        WHERE merchantOrderId=?
        `,
        [merchantOrderId]
      );

      console.log("Order Update:", orderResult);

      // Check Order
      const [orders]: any = await db.query(
        `
        SELECT *
        FROM orders
        WHERE merchantOrderId=?
        LIMIT 1
        `,
        [merchantOrderId]
      );

      console.log("Updated Order:", orders);
    }

    return ok({
      success,
      phonepe: statusResponse,
    });

  } catch (error: any) {
    console.error(error);
    return fail(error.message);
  }
}