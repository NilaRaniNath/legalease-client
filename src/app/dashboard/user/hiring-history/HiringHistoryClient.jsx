"use client";
import React from "react";
import { Button, Chip } from "@heroui/react";
import { Briefcase, ShieldAlert, CreditCard, Calendar } from "lucide-react";
import Link from "next/link";

const statusColorMap = {
  pending: "warning",
  accepted: "success",
  rejected: "danger",
};

export default function HiringHistoryClient({ initialHistory = [] }) {
  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-6 md:p-12 text-left">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* হেডার */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-amber-500" /> Your Hiring History
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track your legal consultation requests and clear pending invoices.</p>
        </div>

        {/* মেইন টেবিল কন্টেইনার */}
        {initialHistory.length === 0 ? (
          <div className="text-center py-16 bg-[#152238] rounded-2xl border border-slate-800 space-y-3">
            <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
            <p className="text-slate-400 font-medium">You have not sent any hiring requests yet.</p>
            <Link href="/browse-lawyers" className="text-sky-400 text-sm underline inline-block">Browse Lawyers Now</Link>
          </div>
        ) : (
          <div className="bg-[#152238] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
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
                              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold shadow-lg shadow-emerald-500/10"
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
        )}
      </div>
    </div>
  );
}