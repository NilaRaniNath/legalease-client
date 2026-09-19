"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AIRecommendError({ error, unstable_retry }) {
  useEffect(() => {
    console.error("AI Recommend page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-[#152238] border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Something went wrong</h2>
        <p className="text-sm text-slate-400 mt-2">
          The AI Legal Issue Analyzer hit an unexpected error. This is usually
          temporary.
        </p>
        <button
          onClick={unstable_retry}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Try again
        </button>
      </div>
    </div>
  );
}