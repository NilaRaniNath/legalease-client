"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

export default function SuccessContent() {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const email = searchParams.get("email");

  const [isVerifying, setIsVerifying] = useState(false);

  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleVerifyPayment = async () => {
    if (!sessionId || !email) {
      Swal.fire("Error", "Session ID or Email is missing!", "error");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch(
        `${NEXT_PUBLIC_BASE_URL}/api/payment/confirm?session_id=${sessionId}&email=${email}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      setIsVerifying(false);

      if (data.success) {
        Swal.fire({
          title: "Payment Verified!",
          text: "Your profile is now live.",
          icon: "success",
          confirmButtonColor: "#0ea5e9",
        }).then(() => {
          window.location.href =
            "/dashboard/lawyer/manage-legal-profile";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1524] text-slate-100">
      <div className="max-w-md w-full p-6 bg-[#132238] rounded-xl text-center space-y-5 border border-slate-800">
        <h2 className="text-2xl font-bold text-sky-400">
          Payment Successful!
        </h2>

        <p className="text-sm text-slate-400">
          Click below to activate your professional profile.
        </p>

        <button
          onClick={handleVerifyPayment}
          disabled={isVerifying}
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-all"
        >
          {isVerifying ? "Activating..." : "Verify & Activate Profile"}
        </button>
      </div>
    </div>
  );
}