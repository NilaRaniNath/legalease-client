"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function LawyerProfileError({ error, unstable_retry }) {
  useEffect(() => {
    console.error("Lawyer profile page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Could not load this profile
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Something went wrong while loading this page, including the booking
          calendar.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={unstable_retry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Try again
          </button>
          <Link
            href="/browse-lawyers"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Browse lawyers
          </Link>
        </div>
      </div>
    </div>
  );
}