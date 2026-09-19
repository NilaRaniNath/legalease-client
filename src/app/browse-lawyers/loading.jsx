import { Search } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-4 text-left">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-sky-400" /> Public Lawyer Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Search, filter, and hire expert legal counsel in real-time.
          </p>
        </div>

        <div className="bg-[#152238] p-5 rounded-2xl border border-slate-800 space-y-4 animate-pulse">
          <div className="h-4 bg-slate-700/60 rounded w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-[38px] bg-slate-700/40 rounded-xl" />
            <div className="h-[38px] bg-slate-700/40 rounded-xl" />
            <div className="h-[38px] bg-slate-700/40 rounded-xl" />
            <div className="h-[38px] bg-slate-700/40 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#152238] border border-slate-700/60 p-5 rounded-2xl space-y-3 animate-pulse"
            >
              <div className="w-full h-48 rounded-xl bg-slate-700/40" />
              <div className="h-5 bg-slate-700/40 rounded w-3/4" />
              <div className="h-3 bg-slate-700/40 rounded w-1/2" />
              <div className="h-3 bg-slate-700/40 rounded w-full" />
              <div className="h-9 bg-slate-700/40 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}