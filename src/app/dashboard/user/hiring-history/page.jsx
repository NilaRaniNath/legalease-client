import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; 
import { ShieldAlert } from "lucide-react";
import HiringHistoryClient from "./HiringHistoryClient";

  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
async function getHiringHistory(clientEmail) {
  if (!clientEmail) return [];
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/hiring/client/${encodeURIComponent(clientEmail)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error("Error fetching hiring history:", err);
    return [];
  }
}

export default async function HiringHistoryPage() {
   
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  
  const history = user?.email ? await getHiringHistory(user.email) : [];

 
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B1524] flex items-center justify-center p-6">
        <div className="text-center p-8 bg-[#152238] rounded-2xl border border-slate-800">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Please login to view your hiring history.</p>
        </div>
      </div>
    );
  }

  
  return <HiringHistoryClient initialHistory={history} />;
}