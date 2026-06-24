import React from "react";
import { ClipboardList, ShieldAlert } from "lucide-react";
import HiringHistoryClient from "./HiringHistoryClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


async function getLawyerRequests(lawyerEmail) {
  if (!lawyerEmail) return [];
  try {
    const res = await fetch(`http://localhost:8000/api/hiring/lawyer/${encodeURIComponent(lawyerEmail)}`, {
      cache: "no-store", 
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error("Error fetching lawyer requests:", err);
    return [];
  }
}

export default async function LawyerHiringHistoryPage() {
  
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const currentUserEmail = session?.user?.email;

  const requests = currentUserEmail ? await getLawyerRequests(currentUserEmail) : [];

  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-6 md:p-12 text-left">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* হেডার */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="text-amber-500" /> Client Hiring Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, accept, or decline pending consultation offers from users.
          </p>
        </div>

        {/* সেফটি চেক: যদি সেশন না থাকে */}
        {!currentUserEmail ? (
          <div className="text-center py-16 bg-[#152238] rounded-2xl border border-slate-800 space-y-3">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <p className="text-slate-300 font-medium">Please login to access the Lawyer Dashboard.</p>
          </div>
        ) : (
         
          <HiringHistoryClient initialRequests={requests} />
        )}

      </div>
    </div>
  );
}