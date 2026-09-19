"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCheck, FileText, Send, Flag } from "lucide-react";
import toast from "react-hot-toast";
import { caseApi } from "@/lib/api";

const CASE_STATUS_OPTIONS = ["active", "on_hold", "completed", "closed"];

export default function CaseControls({ caseData, currentUser }) {
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");
  const [pickedStatus, setPickedStatus] = useState(caseData?.status || "active");

  const timeline = Array.isArray(caseData?.timeline) ? caseData.timeline : [];
  const activeIndex = caseData?.currentStageIndex ?? 0;
  const isLastStage = activeIndex >= timeline.length - 1;
  const nextStageTitle = !isLastStage && timeline[activeIndex + 1]
    ? timeline[activeIndex + 1].title
    : null;

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => caseApi.updateStatus(id, payload),
    onSuccess: (result) => {
      if (result.data.success) {
        toast.success("Case updated!");
        queryClient.invalidateQueries({ queryKey: ["cases"] });
      } else {
        toast.error(result.data.error || "Failed to update case");
      }
    },
    onError: () => toast.error("Network error. Could not update case."),
  });

  const handleAdvance = () => {
    updateMutation.mutate({
      id: caseData._id,
      payload: { advance: true, stageDate: new Date().toISOString() },
    });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    const text = noteText.trim();
    if (!text) return;
    updateMutation.mutate({
      id: caseData._id,
      payload: {
        note: {
          text,
          authorEmail: currentUser?.email || "",
          authorName: currentUser?.name || "",
          role: "lawyer",
        },
      },
    });
    setNoteText("");
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setPickedStatus(value);
    updateMutation.mutate({
      id: caseData._id,
      payload: { caseStatus: value },
    });
  };

  return (
    <div className="bg-[#0B1524] border border-slate-800 rounded-xl p-4 space-y-4">
      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
        <Flag className="w-3.5 h-3.5" /> Case Controls (Lawyer)
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleAdvance}
          disabled={updateMutation.isPending}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
        >
          {isLastStage ? (
            <>
              <CheckCheck className="w-3.5 h-3.5" /> Mark Case Complete
            </>
          ) : (
            <>
              <ArrowRight className="w-3.5 h-3.5" /> Advance to {nextStageTitle || "Next Stage"}
            </>
          )}
        </button>

        <label className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-bold">Case Status:</span>
          <select
            value={pickedStatus}
            onChange={handleStatusChange}
            disabled={updateMutation.isPending}
            className="bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs px-2 py-2 outline-none focus:border-sky-500 disabled:opacity-50"
          >
            {CASE_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form onSubmit={handleAddNote} className="space-y-2">
        <label className="block text-[11px] text-slate-500 font-semibold flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" /> Add Progress Note
        </label>
        <div className="flex gap-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="Document progress, filing status, hearing dates..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 px-3 py-2 outline-none focus:border-sky-500 placeholder:text-slate-600 resize-none"
          />
          <button
            type="submit"
            disabled={updateMutation.isPending || !noteText.trim()}
            className="flex items-center gap-1 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 self-end"
          >
            <Send className="w-3.5 h-3.5" /> Post
          </button>
        </div>
      </form>
    </div>
  );
}