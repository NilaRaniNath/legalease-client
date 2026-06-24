import HireButtonHandler from "@/components/HireButtonHandler";
import { Calendar, DollarSign, CheckCircle2, XCircle, FileText } from "lucide-react";
import Image from "next/image";

// ডাটা ফেচিং ফাংশন (আইডির বদলে ইমেইল দিয়ে সার্ভারে রিকোয়েস্ট পাঠানো)
async function getLawyerDetails(email) {
  try {
    // লক্ষ্য করো এন্ডপয়েন্টটি: /api/lawyers/email/${email}
    const res = await fetch(`http://localhost:8000/api/lawyers/email/${email}`, {
      cache: "no-store", // প্রতিবার একদম লেটেস্ট ডাটা নিশ্চিত করার জন্য
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching lawyer details by email:", err);
    return null;
  }
}

export default async function LawyerDetailsPage({ params }) {
  
  // 🌟 ফিক্স: Next.js 15-এর নিয়ম অনুযায়ী params প্রমিজটি আনর‍্যাপ করা হলো
  const resolvedParams = await params;
  
  // এখন সেফলি অবজেক্ট থেকে id বা email ডিস্ট্রাকচার করো
  const { id, email } = resolvedParams;
  const searchKey = email || id; // দুটোর যেকোনো একটি থেকে ভ্যালু নেওয়ার ব্যাকআপ

  const lawyer = await getLawyerDetails(searchKey);

  if (!lawyer) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold bg-red-50 p-4 max-w-md mx-auto rounded-xl border border-red-200">
        Lawyer not found! Please check if the email route is implemented on backend.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-3">
          
          {/* বাঁদিকের সেকশন: ছবি ও স্ট্যাটাস */}
          <div className="bg-slate-900 p-8 flex flex-col items-center justify-center text-white relative">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-amber-500 mb-6 shadow-lg">
              <Image 
                src={lawyer.image || "https://placehold.co/400"} 
                alt={lawyer.name} 
                fill
                priority
                sizes="192px"
                className="object-cover"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">{lawyer.name}</h1>
            <p className="text-amber-400 font-medium text-sm px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 mb-6">
              {lawyer.specialization}
            </p>

            {/* Availability Badge */}
            <div className="flex items-center gap-2 mt-2">
              {lawyer.status === "Available" ? (
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-semibold border border-emerald-500/30">
                  <CheckCircle2 size={14} /> Available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-full font-semibold border border-rose-500/30">
                  <XCircle size={14} /> Busy / Booked
                </span>
              )}
            </div>
          </div>

          {/* ডানদিকের সেকশন: ইনফরমেশন ও বাটন */}
          <div className="col-span-2 p-8 sm:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <FileText size={18} className="text-amber-500" /> Biography / Summary
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {lawyer.bio || "No professional summary provided yet."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Consultation Fee</p>
                    <p className="text-lg font-bold text-slate-800">${lawyer.hourlyRate || lawyer.fee} / hour</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Joined Platform</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {lawyer.dateJoined ? new Date(lawyer.dateJoined).toLocaleDateString() : "Recently"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* হায়ার বাটন হ্যান্ডলার */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <HireButtonHandler lawyer={lawyer} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}