// app/lawyers/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@heroui/react";
import { Search, AlertCircle } from "lucide-react";
import LawyerCard from "@/components/LawyerCard";
import LawyerSkeleton from "@/components/LawyerSkeleton";

export default function BrowseLawyersPage() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ব্যাকএন্ড থেকে পাবলিকলি লয়ারদের ডেটা নিয়ে আসা
  useEffect(() => {
    async function fetchLawyers() {
      try {
        const res = await fetch("http://localhost:8000/api/lawyers");
        const data = await res.json();
        
        if (data.success) {
          setLawyers(data.data);
        }
      } catch (err) {
        console.error("Failed to load lawyers from server:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLawyers();
  }, []);

  // সার্চ এবং ফিল্টারিং লজিক
  const filteredLawyers = lawyers.filter(
    (lawyer) =>
      lawyer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 space-y-8">
      
      {/* হেডার এরিয়া ও সার্চ বার */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Explore All Available Lawyers
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Find top legal experts tailored to your corporate or personal requirements.
          </p>
        </div>
        
        {/* সার্চ ইনপুট */}
        <div className="relative max-w-xs w-full">
  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <Search className="w-4 h-4 text-slate-400" />
  </span>
  <input
    type="text"
    placeholder="Search by name or field..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 hover:border-white/20 focus:outline-none focus:border-blue-500 transition-colors"
  />
</div>
      </div>

      {/* মেইন গ্রিড সেকশন */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          /* লোডিং অবস্থায় Skeleton দেখাবে */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <LawyerSkeleton key={n} />
            ))}
          </div>
        ) : filteredLawyers.length === 0 ? (
          /* কোনো লয়ার ম্যাচ না করলে ফ্রেন্ডলি নোটিফিকেশন */
          <div className="text-center py-16 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl max-w-xl mx-auto space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-200">No Lawyers Found</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Try adjusting your keyword or clear the search to view all legal consultants.
            </p>
          </div>
        ) : (
          /* রেসপন্সিভ গ্রিড: মোবাইল=২, ট্যাবলেট=৩, ডেক্সটপ=৪ */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredLawyers.map((lawyer, index) => (
              <LawyerCard key={lawyer._id || index} lawyer={lawyer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}