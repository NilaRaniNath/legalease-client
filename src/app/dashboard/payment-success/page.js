"use client";

import { useState, Suspense } from "react"; // 
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";


function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyHiringPayment = async () => {
    if (!sessionId) {
      Swal.fire("Error", "Stripe Session ID is missing!", "error");
      return;
    }

    setIsVerifying(true);

    try {
    
      const res = await fetch("http://localhost:8000/api/payment/confirm-hiring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data = await res.json();
      setIsVerifying(false);

      if (data.success) {
        Swal.fire({
          title: "Hiring Confirmed!",
          text: "Your booking and payment have been verified successfully.",
          icon: "success",
          confirmButtonColor: "#0ea5e9"
        }).then(() => {
         
          window.location.href = "/dashboard/user/hiring-history";
        });
      } else {
        Swal.fire("Error", data.error || "Verification failed", "error");
      }
    } catch (err) {
      setIsVerifying(false);
      Swal.fire("Error", "Server connection failed.", "error");
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-[#132238] rounded-xl text-center space-y-5 border border-slate-800">
      <h2 className="text-2xl font-bold text-emerald-400">Hiring Payment Successful!</h2>
      <p className="text-sm text-slate-400">
        Click the button below to secure your booking and notify your lawyer.
      </p>
      
      <button
        onClick={handleVerifyHiringPayment}
        disabled={isVerifying}
        className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold rounded-lg transition-all disabled:opacity-50"
      >
        {isVerifying ? "Confirming Booking..." : "Verify & Confirm Booking"}
      </button>
    </div>
  );
}


export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1524] text-slate-100">
      <Suspense fallback={
        <div className="text-center text-sky-400 animate-pulse font-medium">
          Loading payment details...
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}