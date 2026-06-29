import HireButtonHandler from "@/components/HireButtonHandler";
import CommentSection from "@/components/CommentSection"; 
import { Calendar, DollarSign, CheckCircle2, XCircle, FileText, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";


 const NEXT_PUBLIC_BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;

async function getLawyerDetails(email) {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/lawyers/email/${email}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching lawyer details by email:", err);
    return null;
  }
}


async function getLawyerComments(lawyerId) {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/comments/${lawyerId}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error("Error fetching comments on server:", err);
    return [];
  }
}

export default async function LawyerDetailsPage({ params }) {

  const resolvedParams = await params;
  const { id, email } = resolvedParams;
  const searchKey = email || id;

  const lawyer = await getLawyerDetails(searchKey);

  const reqHeaders = await headers(); 
  
  let isAuthenticated = false;
  let currentUser = null;

  try {
    const session = await auth.api.getSession({
      headers: reqHeaders, 
    });
    isAuthenticated = !!session?.user;
    if (session?.user) {
      currentUser = session.user;
    }
  } catch (err) {
    console.error("Error fetching session on server side:", err);
    isAuthenticated = false; 
  }

  if (!lawyer) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold bg-red-50 p-4 max-w-md mx-auto rounded-xl border border-red-200">
        Lawyer not found! Please check if the email route is implemented on backend.
      </div>
    );
  }

 
  const initialComments = await getLawyerComments(lawyer._id);

 
  let canComment = false;
  if (currentUser && lawyer) {
    try {
      const checkRes = await fetch(
        `${NEXT_PUBLIC_BASE_URL}/api/hirings/check?clientEmail=${currentUser.email}&lawyerId=${lawyer._id}`, 
        { cache: "no-store" }
      );
      const checkData = await checkRes.json();
      canComment = checkData.hasPaid;
    } catch (err) {
      console.error("Error checking hiring status:", err);
      canComment = false;
    }
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

            {/* অ্যাকশন বাটন সেকশন: লগইন কন্ডিশনাল চেকিং */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              {isAuthenticated ? (
                <HireButtonHandler lawyer={lawyer} />
              ) : (
                <Link href="/api/signin" className="w-full block">
                  <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl tracking-wide transition-all shadow-lg flex items-center justify-center gap-2">
                    <LogIn size={18} />
                    Sign in to Hire a Lawyer
                  </button>
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* 💡 নিচে কমেন্ট সেকশন কার্ড যোগ করা হলো */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-12 shadow-md border border-slate-100">
          <CommentSection 
            lawyerId={lawyer._id} 
            currentUser={canComment ? currentUser : null} 
            initialComments={initialComments} 
          />
        </div>

      </div>
    </div>
  );
}