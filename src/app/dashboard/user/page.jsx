import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Card, Button } from "@heroui/react";
import { Edit, Mail, Shield, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; 

async function getUserProfile(email) {
  if (!email) return null;
  try {
    const res = await fetch(`http://localhost:8000/user/${encodeURIComponent(email)}`, {
      cache: "no-store", 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Profile fetch error:", err);
    return null;
  }
}

export default async function UserDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const dbUser = await getUserProfile(session?.user?.email);

  const profile = dbUser || session?.user;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0B1524] flex items-center justify-center text-slate-300">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-4 md:p-12 flex items-center justify-center">
      <Card className="w-full max-w-md bg-[#152238] border border-slate-800 p-6 rounded-2xl shadow-2xl text-center space-y-6">
        
        {/* 🌟 রেসপন্সিভ ও সেফ ইমেজ কন্টেইনার */}
        <div className="flex justify-center">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[#0B1524] border border-slate-800 flex items-center justify-center overflow-hidden shadow-lg">
            {profile?.image ? (
              <Image
                src={profile.image}
                alt="User Profile"
                width={112}  
                height={112} 
                className="w-full h-full object-cover"
                loading="eager"
                
              />
            ) : (
              <User size={40} className="text-slate-500" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{profile?.name}</h2>
          <p className="text-sm text-slate-400 flex items-center justify-center gap-1.5">
            <Mail size={14} className="text-slate-500" /> {profile?.email}
          </p>
          <div className="inline-flex items-center gap-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold px-2.5 py-1 rounded-md capitalize">
            <Shield size={12} /> Role: {profile?.role || "user"}
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4">
          <Link href="/dashboard/user/update-profile" className="w-full block">
            <Button
              className="w-full bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold transition-all"
              radius="xl"
              startContent={<Edit size={16} />}
            >
              Update Profile
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}