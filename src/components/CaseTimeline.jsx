"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Circle, Clock, Gavel, Scale, ShieldCheck } from "lucide-react";

const STATUS_STYLES = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  on_hold: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  completed: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  closed: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

const STAGE_ICONS = [
  Scale,
  ShieldCheck,
  Circle,
  Gavel,
  Scale,
];

function formatDate(value) {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CaseTimeline({ caseData, className = "" }) {
  const timeline = useMemo(
    () =>
      Array.isArray(caseData?.timeline) && caseData.timeline.length > 0
        ? caseData.timeline
        : [],
    [caseData]
  );

  const totalStages = timeline.length;
  const completedCount = timeline.filter((m) => m.status === "completed").length;
  const activeIndex = timeline.findIndex((m) => m.status === "active");
  const activeMilestone =
    activeIndex >= 0
      ? timeline[activeIndex]
      : timeline[caseData?.currentStageIndex] || null;

  const progressPercent =
    totalStages > 1 ? Math.round((completedCount / (totalStages - 1)) * 100) : 0;
  const progressNotes = Array.isArray(caseData?.progressNotes)
    ? caseData.progressNotes.slice(-5).reverse()
    : [];

  if (totalStages === 0) {
    return (
      <div className={`bg-[#152238] border border-slate-800 rounded-2xl p-6 text-center text-sm text-slate-400 ${className}`}>
        No milestones have been defined for this case yet.
      </div>
    );
  }

  return (
    <div className={`bg-[#152238] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5 shadow-xl text-left ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-sky-400" />
            {caseData?.title || "Case Timeline"}
          </h3>
          {caseData?.lawyerName && (
            <p className="text-xs text-slate-400">
              Lawyer: <span className="text-slate-300 font-medium">{caseData.lawyerName}</span>
            </p>
          )}
          <p className="text-[11px] text-slate-500">
            {completedCount} of {totalStages} milestones completed
          </p>
        </div>

        {caseData?.status && (
          <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[caseData.status] || STATUS_STYLES.active}`}>
            {String(caseData.status).replace("_", " ")}
          </span>
        )}
      </div>

      {/* Progress line */}
      <div className="relative">
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {timeline.map((milestone, index) => {
          const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
          const isCompleted = milestone.status === "completed";
          const isActive = milestone.status === "active";
          const date = formatDate(milestone.date);

          return (
            <motion.div
              key={milestone.key || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`relative rounded-xl border p-3 ${
                isActive
                  ? "bg-sky-500/10 border-sky-500/40"
                  : isCompleted
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-[#0B1524] border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-sky-400/40"
                      animate={{ scale: [1, 1.35, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                  )}
                  <span
                    className={`relative w-7 h-7 rounded-full flex items-center justify-center border ${
                      isCompleted
                        ? "bg-emerald-500 text-slate-900 border-emerald-500"
                        : isActive
                        ? "bg-sky-500 text-slate-900 border-sky-400"
                        : "bg-slate-800 text-slate-500 border-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold truncate ${
                      isCompleted
                        ? "text-emerald-400"
                        : isActive
                        ? "text-sky-300"
                        : "text-slate-400"
                    }`}
                  >
                    {milestone.title}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {isActive ? "In progress" : date ? date : "Upcoming"}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active milestone */}
      {activeMilestone && (
        <div className="rounded-xl bg-[#0B1524] border border-slate-800 p-4 space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Current Milestone</p>
          <p className="text-sm font-bold text-sky-300">{activeMilestone.title}</p>
          {activeMilestone.notes && activeMilestone.notes.length > 0 && (
            <ul className="text-xs text-slate-400 space-y-1 pt-2">
              {activeMilestone.notes.slice(-3).map((note, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-sky-500 mt-0.5">•</span>
                  {note.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Progress notes */}
      {progressNotes.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Recent Progress Notes</p>
          <div className="space-y-2">
            {progressNotes.map((note, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-lg bg-[#0B1524] border border-slate-800 p-3 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-300">
                    {note.authorName || note.authorEmail || note.role || "Team"}
                    {note.role && <span className="ml-1 capitalize text-slate-500">({note.role})</span>}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(note.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{note.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}