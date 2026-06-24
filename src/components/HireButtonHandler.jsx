"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function HireButtonHandler({ lawyer }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  const handleHireRequest = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to hire a lawyer!");
      return;
    }

    setIsSubmitting(true);

  const hiringData = {
  lawyerId: lawyer._id.toString(), 
  lawyerName: lawyer.name,
  lawyerEmail: lawyer.email,
  specialization: lawyer.specialization,
  fee: lawyer.hourlyRate || lawyer.fee,
  clientEmail: user.email,
  clientName: user.name,
  status: "pending", 
  requestDate: new Date(),
};

    try {
      const res = await fetch("http://localhost:8000/api/hiring/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hiringData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Hiring request sent! Waiting for lawyer's approval.");
        setIsRequested(true); 
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to send request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role === "lawyer" || user?.role === "admin") {
    return (
      <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
        ⚠️ Lawyers and Admins cannot send hiring requests.
      </p>
    );
  }

  
  const getButtonText = () => {
    if (isSubmitting) return "Sending Request...";
    if (isRequested) return "✓ Pending Approval";
    if (lawyer.status !== "Available") return "Lawyer Unavailable";
    return "Send Hiring Request";
  };

  return (
    <>
      <motion.button
        whileHover={!isRequested && lawyer.status === "Available" ? { scale: 1.02 } : {}}
        whileTap={!isRequested && lawyer.status === "Available" ? { scale: 0.98 } : {}}
        onClick={handleHireRequest}
        disabled={isSubmitting || isRequested || lawyer.status !== "Available"}
        className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all shadow-md ${
          isRequested 
            ? "bg-amber-100 text-amber-700 border border-amber-300 cursor-not-allowed"
            : lawyer.status !== "Available"
            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
            : "bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-amber-500/20"
        }`}
      >
        {getButtonText()}
      </motion.button>
      <p className="text-center text-xs text-slate-400 mt-3">
        * Clicking will send a request to the lawyer. Once they accept, you can pay from your Hiring History dashboard.
      </p>
    </>
  );
}