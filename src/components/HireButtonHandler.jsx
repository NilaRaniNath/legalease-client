"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { loadStripe } from "@stripe/stripe-js";
import { AlertCircle, X } from "lucide-react";
import { hiringApi } from "@/lib/api";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function HireButtonHandler({ lawyer }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  const { data: hiringHistory } = useQuery({
    queryKey: ["hiringHistory", user?.email],
    queryFn: () => hiringApi.getClientHistory(user.email).then((d) => d.data),
    enabled: isAuthenticated && !!user?.email,
    staleTime: 30 * 1000,
  });

  const { hiringStatus, existingHiringId } = useMemo(() => {
    if (!hiringHistory?.data) return { hiringStatus: "none", existingHiringId: null };
    const specificHiring = hiringHistory.data.find(
      (item) => item.lawyerId === lawyer._id.toString()
    );
    return {
      hiringStatus: specificHiring ? specificHiring.status : "none",
      existingHiringId: specificHiring ? specificHiring._id : null,
    };
  }, [hiringHistory, lawyer._id]);

  const confirmHireMutation = useMutation({
    mutationFn: () =>
      hiringApi.createRequest({
        lawyerId: lawyer._id.toString(),
        lawyerName: lawyer.name,
        lawyerEmail: lawyer.email,
        specialization: lawyer.specialization,
        fee: lawyer.hourlyRate || lawyer.fee,
        clientEmail: user.email,
        clientName: user.name,
        status: "pending",
        requestDate: new Date(),
      }),
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success("Hiring request sent! Waiting for lawyer's approval.");
        queryClient.invalidateQueries({ queryKey: ["hiringHistory"] });
      } else {
        toast.error(data.data?.error || "Something went wrong");
      }
    },
    onError: () => toast.error("Failed to send request"),
    onSettled: () => setIsSubmitting(false),
  });

  const confirmHireRequest = () => {
    setIsModalOpen(false);
    setIsSubmitting(true);
    confirmHireMutation.mutate();
  };

  const handleHireClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to hire a lawyer!");
      return;
    }
    setIsModalOpen(true);
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
          "Content-Type": "application/json",
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

    return { text: "Send Hiring Request", disabled: false, className: "bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-amber-500/20", action: handleHireClick };
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md overflow-hidden bg-[#152238] border border-slate-800 rounded-2xl p-6 text-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full">
                  <AlertCircle size={32} />
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  Confirm Hiring Request
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed">
                  Are you sure you want to send a formal hiring request to <strong className="text-sky-400">{lawyer.name}</strong>?
                  Once approved, you will be required to pay the consulting fee of <strong className="text-emerald-400">${lawyer.hourlyRate || lawyer.fee}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors border border-slate-700/60"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmHireRequest}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/10"
                >
                  Yes, Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}