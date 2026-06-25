"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { loadStripe } from "@stripe/stripe"; 
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function HireButtonHandler({ lawyer }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hiringStatus, setHiringStatus] = useState("none"); 
  const [existingHiringId, setExistingHiringId] = useState(null);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  
  useEffect(() => {
    if (isAuthenticated && user?.email && lawyer?._id) {
      
      fetch(`http://localhost:8000/api/hiring/client/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            
            const specificHiring = data.data.find(
              (item) => item.lawyerId === lawyer._id.toString()
            );
            
            if (specificHiring) {
              setHiringStatus(specificHiring.status); 
              setExistingHiringId(specificHiring._id); // 
            }
          }
        })
        .catch((err) => console.error("Error checking hiring status:", err));
    }
  }, [isAuthenticated, user, lawyer]);


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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hiringData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Hiring request sent! Waiting for lawyer's approval.");
        setHiringStatus("pending");
       
        if (data.data?._id || data.hiringId) {
          setExistingHiringId(data.data?._id || data.hiringId);
        }
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to send request");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleStripePayment = async () => {
    if (!existingHiringId) {
      toast.error("Hiring record not found. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);
    try {
     
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          hiringId: existingHiringId,
          lawyerId: lawyer._id.toString(),
          clientEmail: user.email,
          amount: lawyer.hourlyRate || lawyer.fee, 
          lawyerName: lawyer.name,
        }),
      });

      const sessionData = await response.json();

      if (!response.ok || sessionData.error) {
        throw new Error(sessionData.error || "Failed to create Stripe session");
      }

      
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load.");

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionData.id,
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Stripe Error:", error);
      toast.error(error.message || "Stripe Checkout redirection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role === "lawyer" || user?.role === "admin") {
    return (
      <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
        ⚠️ Lawyers and Admins cannot send hiring requests.
      </p>
    );
  }

  
  const getButtonConfig = () => {
    if (isSubmitting) return { text: "Processing...", disabled: true, className: "bg-slate-400 text-slate-700 cursor-not-allowed", action: null };
    if (hiringStatus === "pending") return { text: "✓ Pending Approval", disabled: true, className: "bg-amber-100 text-amber-700 border border-amber-300 cursor-not-allowed", action: null };
    if (hiringStatus === "paid") return { text: "✓ Hired & Paid", disabled: true, className: "bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-not-allowed", action: null };
    if (hiringStatus === "accepted") return { text: "Pay to Confirm Hiring", disabled: false, className: "bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-emerald-500/20", action: handleStripePayment };
    if (lawyer.status !== "Available") return { text: "Lawyer Unavailable", disabled: true, className: "bg-slate-300 text-slate-500 cursor-not-allowed", action: null };
    
    return { text: "Send Hiring Request", disabled: false, className: "bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-amber-500/20", action: handleHireRequest };
  };

  const btnConfig = getButtonConfig();

  return (
    <>
      <motion.button
        whileHover={!btnConfig.disabled ? { scale: 1.02 } : {}}
        whileTap={!btnConfig.disabled ? { scale: 0.98 } : {}}
        onClick={btnConfig.action}
        disabled={btnConfig.disabled}
        className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all shadow-md ${btnConfig.className}`}
      >
        {btnConfig.text}
      </motion.button>
      
      <p className="text-center text-xs text-slate-400 mt-3">
        {hiringStatus === "accepted" 
          ? "* Lawyer has approved your request! Click above to pay via Stripe." 
          : hiringStatus === "paid"
          ? "* You have hired this lawyer. Check details in your dashboard."
          : "* Clicking will send a request to the lawyer. Once they accept, you can process the secure payment."}
      </p>
    </>
  );
}