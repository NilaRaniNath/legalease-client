"use client";
import React from "react";
import { Button, Chip } from "@heroui/react";
import { Briefcase, ShieldAlert, CreditCard, Calendar, User } from "lucide-react";
import Link from "next/link";

const statusColorMap = {
  pending: "warning",
  accepted: "success",
  rejected: "danger",
};

export default function HiringHistoryClient({ initialHistory = [] }) {
  if (initialHistory.length === 0) {
    return (
      <div className="text-center py-16 bg-[#152238] rounded-2xl border border-slate-800 space-y-3">
        <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
        <p className="text-slate-400 font-medium">You have not sent any hiring requests yet.</p>
        <Link href="/browse-lawyers" className="text-sky-400 text-sm underline inline-block">Browse Lawyers Now</Link>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      {/* 📱 ১. মোবাইল ভিউ (শুধুমাত্র ছোট স্ক্রিনের জন্য - Hidden on Desktop) */}
      <div className="block md:hidden space-y-4">
        {initialHistory.map((item) => (
          <div 
            key={item._id.toString()} 
            className="bg-[#152238] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md"
          >
            {/* লইয়ারের নাম ও ফী */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <User size={16} className="text-sky-400" /> {item.lawyerName}
                </h3>
                <span className="text-[11px] inline-block bg-slate-800 text-amber-400 border border-slate-700 px-2 py-0.5 rounded mt-1 font-medium">
                  {item.specialization}
                </span>
              </div>
              <p className="text-sm font-extrabold text-emerald-400 whitespace-nowrap">
                ${item.fee}/hr
              </p>
            </div>

            {/* ডেট এবং স্ট্যাটাস */}
            <div className="flex justify-between items-center text-xs border-t border-slate-800/60 pt-3">
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar size={14} />
                {item.requestDate ? new Date(item.requestDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }) : "N/A"}
              </span>
              
              <Chip
                color={statusColorMap[item.status] || "default"}
                variant="flat"
                size="sm"
                className="capitalize font-bold px-2"
              >
                {item.status}
              </Chip>
            </div>

            {/* অ্যাকশন বাটন */}
            <div className="pt-1">
              {item.status === "accepted" ? (
                <Link href={`/payment?hiringId=${item._id}&amount=${item.fee}`} className="w-full block">
                  <Button
                    size="sm"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold shadow-lg shadow-emerald-500/10 text-xs py-2.5"
                    startContent={<CreditCard size={14} />}
                  >
                    Proceed to Pay
                  </Button>
                </Link>
              ) : item.status === "pending" ? (
                <div className="text-center text-xs italic text-slate-500 bg-[#0B1524] py-2 rounded-lg border border-slate-800">
                  Awaiting Approval
                </div>
              ) : (
                <div className="text-center text-xs font-semibold text-rose-400 bg-rose-500/5 py-2 rounded-lg border border-rose-500/10">
                  Rejected
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 💻 ২. ডেক্সটপ ভিউ (বড় স্ক্রিনের জন্য - Hidden on Mobile) */}
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
                <td className="px-6 py-4 font-semibold text-white">
                  {item.lawyerName}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-slate-800 text-amber-400 border border-slate-700 px-2.5 py-1 rounded-md font-medium">
                    {item.specialization}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-400">
                  ${item.fee}/hr
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {item.requestDate ? new Date(item.requestDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <Chip
                    color={statusColorMap[item.status] || "default"}
                    variant="flat"
                    size="sm"
                    className="capitalize font-bold px-2"
                  >
                    {item.status}
                  </Chip>
                </td>
                <td className="px-6 py-4 text-right">
                  {item.status === "accepted" ? (
                    <Link href={`/payment?hiringId=${item._id}&amount=${item.fee}`}>
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold shadow-lg"
                        startContent={<CreditCard size={14} />}
                      >
                        Proceed to Pay
                      </Button>
                    </Link>
                  ) : item.status === "pending" ? (
                    <span className="text-xs italic text-slate-500">Awaiting Approval</span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded">Rejected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}