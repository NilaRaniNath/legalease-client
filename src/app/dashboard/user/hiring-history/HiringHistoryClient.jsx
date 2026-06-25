"use client";
import React, { useState } from "react";
import { Button, Chip } from "@heroui/react";
import { ShieldAlert, CreditCard, Calendar, User } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const statusColorMap = {
  pending: "warning",
  accepted: "success",
  paid: "success",
  rejected: "danger",
};

export default function HiringHistoryClient({ initialHistory = [] }) {
  const [loadingId, setLoadingId] = useState(null);


const handleStripePayment = async (item) => {
  setLoadingId(item._id);
  try {
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hiringId: item._id,
        lawyerId: item.lawyerId,
        clientEmail: item.clientEmail,
        amount: item.fee,
        lawyerName: item.lawyerName,
      }),
    });

    const sessionData = await response.json();

    if (!response.ok || sessionData.error) {
      throw new Error(sessionData.error || "Failed to create Stripe session");
    }

   
    if (sessionData.url) {
      window.location.href = sessionData.url;
    } else {
      throw new Error("Stripe checkout URL not found.");
    }

  } catch (error) {
    console.error("Stripe Error:", error);
    toast.error(error.message || "Stripe Checkout redirection failed.");
  } finally {
    setLoadingId(null);
  }
};

  if (initialHistory.length === 0) {
    return (
      <div className="text-center py-16 bg-[#152238] rounded-2xl border border-slate-800 space-y-3">
        <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
        <p className="text-slate-400 font-medium">You have not sent any hiring requests yet.</p>
        <Link href="/browse-lawyers" className="text-sky-400 text-sm underline inline-block">Browse Lawyers Now</Link>
      </div>
    );
  }

 
  const renderAction = (item) => {
    if (item.status === "accepted") {
      return (
        <Button
          size="sm"
          isLoading={loadingId === item._id}
          onClick={() => handleStripePayment(item)} 
          className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold shadow-lg shadow-emerald-500/10 text-xs py-2.5"
          startContent={loadingId !== item._id && <CreditCard size={14} />}
        >
          Proceed to Pay
        </Button>
      );
    }
    if (item.status === "paid") {
      return (
        <div className="text-center md:text-right text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 md:inline-block">
          ✓ Hired & Confirmed
        </div>
      );
    }
    if (item.status === "pending") {
      return (
        <div className="text-center text-xs italic text-slate-500 bg-[#0B1524] py-2 px-3 rounded-lg border border-slate-800 md:inline-block">
          Awaiting Approval
        </div>
      );
    }
    return (
      <div className="text-center text-xs font-semibold text-rose-400 bg-rose-500/5 py-2 px-3 rounded-lg border border-rose-500/10 md:inline-block">
        Rejected
      </div>
    );
  };

  return (
    <div className="w-full text-left">
      {/* 📱 ১. মোবাইল ভিউ */}
      <div className="block md:hidden space-y-4">
        {initialHistory.map((item) => (
          <div key={item._id.toString()} className="bg-[#152238] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <User size={16} className="text-sky-400" /> {item.lawyerName}
                </h3>
                <span className="text-[11px] inline-block bg-slate-800 text-amber-400 border border-slate-700 px-2 py-0.5 rounded mt-1 font-medium">
                  {item.specialization}
                </span>
              </div>
              <p className="text-sm font-extrabold text-emerald-400 whitespace-nowrap">${item.fee}/hr</p>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-slate-800/60 pt-3">
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar size={14} />
                {item.requestDate ? new Date(item.requestDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
              </span>
              <Chip color={statusColorMap[item.status] || "default"} variant="flat" size="sm" className="capitalize font-bold px-2">
                {item.status}
              </Chip>
            </div>

            <div className="pt-1">{renderAction(item)}</div>
          </div>
        ))}
      </div>

      {/* 💻 ২. ডেক্সটপ ভিউ */}
      <div className="hidden md:block bg-[#152238] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-sm text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-[#0B1524] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Lawyer Name</th>
              <th className="px-6 py-4">Specialization</th>
              <th className="px-6 py-4">Hiring Fee</th>
              <th className="px-6 py-4">Request Date</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {initialHistory.map((item) => (
              <tr key={item._id.toString()} className="hover:bg-[#1a2942] transition-colors">
                <td className="px-6 py-4 font-semibold text-white">{item.lawyerName}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-slate-800 text-amber-400 border border-slate-700 px-2.5 py-1 rounded-md font-medium">
                    {item.specialization}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-400">${item.fee}/hr</td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {item.requestDate ? new Date(item.requestDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <Chip color={statusColorMap[item.status] || "default"} variant="flat" size="sm" className="capitalize font-bold px-2">
                    {item.status}
                  </Chip>
                </td>
                <td className="px-6 py-4 text-right">{renderAction(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}