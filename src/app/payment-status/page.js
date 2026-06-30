"use client";

<<<<<<< HEAD
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentStatusInner() {
=======
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 1. Separate the logic that uses useSearchParams into its own component
function PaymentStatusContent() {
>>>>>>> origin/main
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const merchantOrderId = params.get("merchantOrderId");

    if (!merchantOrderId) return;

    fetch(`/api/phonepe/verify?merchantOrderId=${merchantOrderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.success || data?.data?.state === "COMPLETED") {
          router.push("/order-success");
        } else {
          router.push("/payment-failed");
        }
      })
      .catch((err) => {
        console.error("Verification failed:", err);
        router.push("/payment-failed"); // Fallback in case of network issues
      });
  }, [params, router]);

  return <div className="p-10 text-center">Verifying Payment...</div>;
}

export default function PaymentStatus() {
  return (
<<<<<<< HEAD
    <Suspense fallback={<div className="p-10 text-center">Verifying Payment...</div>}>
      <PaymentStatusInner />
    </Suspense>
=======
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full mx-4 text-center">
      {/* Modern CSS Loading Spinner */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-2">
        Verifying Payment
      </h2>
      <p className="text-sm font-medium text-gray-500 leading-relaxed">
        Please hold on a moment while we securely confirm your transaction with PhonePe. <br/>
        <span className="text-black font-semibold">Do not close or refresh this window.</span>
      </p>
    </div>
  );
}

// 2. Export the main page wrapped in a Suspense boundary
export default function PaymentStatus() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans flex items-center justify-center">
      <Suspense 
        fallback={
          // A skeleton loading state that mimics the design while Suspense resolves
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full mx-4 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-6"></div>
            <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-56 bg-gray-200 rounded"></div>
          </div>
        }
      >
        <PaymentStatusContent />
      </Suspense>
    </div>
>>>>>>> origin/main
  );
}
