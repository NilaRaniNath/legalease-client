"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Sparkles,
  Scale,
  ShieldAlert,
  Loader2,
  Send,
  AlertTriangle,
  CheckCircle2,
  MessageSquareText,
  Briefcase,
  ArrowUpRight,
  Search,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { aiApi } from "@/lib/api";

const SAMPLE_ISSUES = [
  "My landlord wants to evict me without notice and is keeping my security deposit.",
  "My employer terminated me without paying my last month's salary.",
  "I signed a business contract and the other party breached the payment terms.",
  "I am going through a divorce and we are fighting over child custody.",
];

const URGENCY_STYLES = {
  low: {
    label: "Low Urgency",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  medium: {
    label: "Medium Urgency",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  high: {
    label: "High Urgency",
    className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
};

export default function AILegalAnalyzer() {
  const [issue, setIssue] = useState("");

  const analyzeMutation = useMutation({
    mutationFn: () => aiApi.analyzeIssue(issue),
    onError: () => toast.error("AI analysis failed. Please try again."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issue.trim()) {
      toast.error("Please describe your legal issue first.");
      return;
    }
    if (issue.trim().length < 10) {
      toast.error("Please provide a bit more detail (at least 10 characters).");
      return;
    }
    analyzeMutation.mutate();
  };

  const handleSampleClick = (sample) => {
    setIssue(sample);
    analyzeMutation.reset();
  };

  const result = analyzeMutation.data?.data;
  const analysis = result?.analysis;
  const recommendedLawyers = result?.recommendedLawyers || [];

  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* হেডার */}
        <div className="border-b border-slate-800 pb-5 text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                AI Legal Issue Analyzer
                <Cpu className="w-5 h-5 text-sky-400" />
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Describe your situation in plain language — our AI classifies it and finds verified lawyers who can help.
              </p>
            </div>
          </div>
        </div>

        {/* ইনপুট ফর্ম */}
        <form onSubmit={handleSubmit} className="bg-[#152238] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Describe your legal issue
            </label>
            <textarea
              rows={5}
              value={issue}
              onChange={(e) => {
                setIssue(e.target.value);
                if (analyzeMutation.isSuccess) analyzeMutation.reset();
              }}
              placeholder="e.g. My landlord is threatening to evict me without any written notice and refused to return my security deposit for three months..."
              className="w-full p-4 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500 resize-none placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={analyzeMutation.isPending}
            className="w-full md:w-auto px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Analyze My Issue
              </>
            )}
          </button>

          {/* স্যাম্পল প্রশ্ন */}
          <div>
            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
              <MessageSquareText className="w-3.5 h-3.5" /> Try an example:
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_ISSUES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSampleClick(sample)}
                  className="text-xs px-3 py-1.5 bg-[#0B1524] border border-slate-700 hover:border-sky-500/50 text-slate-400 hover:text-sky-300 rounded-full transition-colors"
                >
                  {sample.length > 60 ? sample.slice(0, 60) + "..." : sample}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* ডিসক্লেইমার */}
        <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-amber-300 font-semibold">Important:</strong> AI-generated guidance is for information
            only and does <span className="text-slate-200 font-medium">not</span> constitute legal advice. Always consult a
            qualified lawyer before taking any legal action.
          </p>
        </div>

        {/* রেজাল্ট */}
        {analyzeMutation.isError && (
          <div className="bg-rose-500/5 border border-rose-500/30 rounded-2xl p-6 text-center">
            <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto mb-2" />
            <p className="text-slate-300 font-medium">Analysis failed. Please try again.</p>
          </div>
        )}

        {analyzeMutation.isSuccess && analysis && (
          <div className="space-y-6">
            {/* অ্যানালাইসিস কার্ড */}
            <div className="bg-[#152238] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-wrap gap-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-sky-400" /> AI Analysis Results
                </h2>
                <span className="text-[10px] text-slate-500 bg-[#0B1524] px-2 py-1 rounded-full border border-slate-700">
                  {result.source === "gemini" ? "Powered by Google Gemini" : "Smart classification"}
                </span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Legal Category</p>
                      <p className="text-base font-bold text-white">{analysis.category}</p>
                    </div>
                  </div>

                  <div>
                    {(() => {
                      const style = URGENCY_STYLES[analysis.urgency] || URGENCY_STYLES.medium;
                      return (
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold border ${style.className}`}>
                          <ShieldAlert className="w-3.5 h-3.5" /> {style.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Summary</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-3">
                  Recommended First Steps
                </p>
                <ol className="space-y-2.5">
                  {(analysis.nextSteps || []).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                {analysis.disclaimer && (
                  <p className="text-[11px] italic text-slate-500 mt-4 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {analysis.disclaimer}
                  </p>
                )}
              </div>
            </div>

            {/* ম্যাচিং লইয়ার */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-sky-400" /> Matching Lawyers for{" "}{`"${analysis.matchedSpecialization || analysis.category}"`}
              </h3>

              {recommendedLawyers.length === 0 ? (
                <div className="bg-[#152238] rounded-2xl border border-slate-800 p-8 text-center">
                  <p className="text-slate-400 text-sm">
                    No verified lawyers currently listed for this specialization.
                  </p>
                  <Link href="/browse-lawyers" className="inline-block mt-3 text-sky-400 text-sm underline">
                    Browse all lawyers instead
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendedLawyers.map((lawyer) => (
                    <div
                      key={lawyer._id}
                      className="bg-[#152238] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-sky-500/40 transition-all duration-300 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-[#0B1524] border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                          {lawyer.image && lawyer.image !== "null" ? (
                            <Image
                              src={lawyer.image}
                              alt={lawyer.name || "Lawyer"}
                              width={56}
                              height={56}
                              unoptimized
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Scale className="w-6 h-6 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{lawyer.name}</h4>
                          <p className="text-xs text-sky-400 font-medium">{lawyer.specialization}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {lawyer.bio || "Professional legal practitioner."}
                      </p>

                      <div className="flex justify-between items-center text-xs mt-auto pt-2 border-t border-slate-800/60">
                        <span className="text-slate-300">
                          Fee: <strong className="text-emerald-400">${lawyer.fee || lawyer.hourlyRate || "—"}/hr</strong>
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          lawyer.status === "Available"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {lawyer.status || "Available"}
                        </span>
                      </div>

                      <Link href={`/browse-lawyers/${lawyer.email}`} className="w-full">
                        <button className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5">
                          View Profile <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ফলাফল-পরবর্তী অ্যাকশন সাজেশন */}
        {analyzeMutation.isSuccess && (
          <div className="flex items-center gap-2 justify-center pt-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-slate-500">
              Not the right match?{" "}
              <Link href="/browse-lawyers" className="text-sky-400 underline">Browse the full directory</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}