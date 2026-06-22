// components/LawyerCard.jsx
"use client";

import { Card, Avatar, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Briefcase, DollarSign, User } from "lucide-react";

export default function LawyerCard({ lawyer }) {
  const router = useRouter();
  const isBusy = lawyer.status?.toLowerCase() === "busy";

  return (
    <Card
      // 💡 পরিবর্তন: heroui প্রোপার্টি বাদ দিয়ে স্ট্যান্ডার্ড onClick এবং ক্লাস যোগ করা হয়েছে
      onClick={() => router.push(`/lawyers/${lawyer._id}`)} 
      className="bg-slate-900/40 border border-white/10 p-4 rounded-2xl hover:border-blue-500/50 hover:bg-slate-900/80 transition-all group duration-300 backdrop-blur-md flex flex-col justify-between items-start text-left w-full h-full shadow-lg cursor-pointer"
    >
      {/* টপ সেকশন: অ্যাভাটার এবং Busy ব্যাজ */}
      <div className="w-full flex justify-between items-start gap-2 mb-4">
        <Avatar
          src={lawyer.image || null}
          fallback={<User className="w-6 h-6 text-slate-400" />}
          className="w-14 h-14 rounded-xl bg-white/5 border border-white/10"
        />
        
        {isBusy && (
          <Chip 
            color="danger" 
            variant="flat" 
            size="sm" 
            className="font-bold border border-rose-500/20 px-2"
          >
            Busy
          </Chip>
        )}
      </div>

      {/* মিডল সেকশন */}
      <div className="space-y-1.5 w-full flex-grow">
        <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors line-clamp-1">
          {lawyer.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Briefcase className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
          <span className="line-clamp-1">{lawyer.specialization}</span>
        </div>
      </div>

      {/* ফুটার সেকশন */}
      <div className="w-full pt-3 mt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-0.5 text-emerald-400 font-semibold text-sm">
          <DollarSign className="w-4 h-4" />
          <span>{lawyer.fee} <span className="text-[10px] text-slate-500 font-normal">/ hr</span></span>
        </div>
        <span className="text-[11px] font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Details →
        </span>
      </div>
    </Card>
  );
}