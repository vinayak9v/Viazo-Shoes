"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentStatus() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const merchantOrderId =
      params.get("merchantOrderId");

    if (!merchantOrderId) return;

    fetch(
      `/api/phonepe/verify?merchantOrderId=${merchantOrderId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (
          data?.data?.success ||
          data?.data?.state === "COMPLETED"
        ) {
          router.push("/order-success");
        } else {
          router.push("/payment-failed");
        }
      });
  }, []);

  return (
    <div className="p-10 text-center">
      Verifying Payment...
    </div>
  );
}