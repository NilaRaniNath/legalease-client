import React from "react";
import { Card, Button } from "@heroui/react";
import { LogIn, Shield, Star, User, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { headers } from "next/headers"; 

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getFeaturedLawyers() {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/lawyer/featured`, {
      cache: "no-store", 
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error("Failed to load featured lawyers:", err);
    return [];
  }
}

export default async function FeaturedLawyersSection() {
  const reqHeaders = await headers(); 
  const session = await auth.api.getSession({
    headers: reqHeaders, 
  });
  
  const isAuthenticated = !!session?.user;
  const lawyers = await getFeaturedLawyers();
  const defaultAvatar = "https://i.ibb.co/0V6Pv4LK/default-avatar.png";

  return (
    <section className="bg-[#0B1524] py-16 px-4 md:px-12 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* সেকশন হেডার */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Our <span className="text-sky-400">Featured Lawyers</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            Meet our highly qualified and verified legal experts ready to assist you with top-tier legal consultants.
          </p>
        </div>

        {/* লয়ার্স গ্রিড */}
        {lawyers.length === 0 ? (
          <p className="text-center text-slate-500 text-sm">No featured lawyers found at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map((lawyer) => {
              const displayImage = lawyer.image && !lawyer.image.includes("googleusercontent") 
                ? lawyer.image 
                : defaultAvatar;

              const lawyerId = lawyer._id || lawyer.id;

              return (
                <Card 
                  key={lawyerId} 
                  className="bg-[#152238] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-sky-500/50 transition-all duration-300 shadow-xl group"
                >
                  {/* কার্ডের কন্টেন্ট পার্ট */}
                  <div className="space-y-4">
                    {/* লয়ার ইমেজ ও প্রোফাইল */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#0B1524] border border-slate-700 overflow-hidden flex items-center justify-center shadow-md">
                        <Image
                          src={displayImage}
                          alt={lawyer.name || "Lawyer"}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized 
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-1">
                          {lawyer.name}
                          {lawyer.isVerified && <Shield size={16} className="text-sky-400 fill-sky-400/10" />}
                        </h3>
                        <p className="text-xs text-sky-400 font-medium capitalize">
                          {lawyer.specialization || "Legal Consultant"}
                        </p>
                      </div>
                    </div>

                    {/* ডেসক্রিপশন / বায়ো */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {lawyer.bio || "Professional legal practitioner dedicated to providing expert guidance and strategic solutions."}
                    </p>

                    {/* রেটিং ও ফি ইনফো */}
                    <div className="flex justify-between items-center bg-[#0B1524]/60 px-3 py-2.5 rounded-xl border border-slate-800/50 text-xs">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star size={14} className="fill-amber-400" /> {lawyer.rating || "4.9"} (12+ Reviews)
                      </span>
                      <span className="text-slate-300">
                        Fees: <strong className="text-emerald-400">${lawyer.fee || "150"}</strong>/hr
                      </span>
                    </div>
                  </div>

                  {/* ⚡ অ্যাকশন বাটন সেকশন (Nested Link মুক্ত) */}
                  <div className="space-y-3 mt-5">
                    
                    {/* 🔗 ডাইনামিক ভিউ প্রোফাইল বাটন - যা সরাসরি ব্রাউজ লয়ার ডিটেইলস পেজে নিয়ে যাবে */}
                    <div className="flex justify-end pt-2">
                      <Link href={`/browse-lawyers/${lawyer.email}`} className="w-full">
                        <Button 
                          size="sm" 
                          className="bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold w-full" 
                          radius="xl" 
                          endContent={<ArrowUpRight className="w-4 h-4" />}
                        >
                          View Full Profile
                        </Button>
                      </Link>
                    </div>

                   

                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}