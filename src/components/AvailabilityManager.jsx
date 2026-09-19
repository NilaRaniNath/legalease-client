"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Save, CalendarClock, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { availabilityApi } from "@/lib/api";
import Skeleton from "./Skeleton";

const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let slotKeyCounter = 0;
const nextKey = () => `slot_${++slotKeyCounter}`;

function defaultSlot(day) {
  return { key: nextKey(), day, start: "09:00", end: "10:00" };
}

export default function AvailabilityManager() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const email = user?.email;

  const [slots, setSlots] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["availability", email],
    queryFn: () => availabilityApi.get(email),
    enabled: Boolean(email),
    onSuccess: (result) => {
      if (!hydrated && result?.data?.success) {
        const existingSlots = result.data.data?.slots || [];
        setSlots(existingSlots.map((s) => ({ key: nextKey(), ...s })));
        setHydrated(true);
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => availabilityApi.save(payload),
    onSuccess: (result) => {
      if (result.data.success) {
        toast.success("Availability schedule saved!");
        queryClient.invalidateQueries({ queryKey: ["availability", email] });
      } else {
        toast.error(result.data.error || "Failed to save availability");
      }
    },
    onError: () => toast.error("Network error. Could not save availability."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => availabilityApi.remove(email),
    onSuccess: (result) => {
      if (result.data.success || result.data.deleted) {
        setSlots([]);
        setHydrated(true);
        toast.success("Availability schedule cleared.");
        queryClient.invalidateQueries({ queryKey: ["availability", email] });
      } else {
        toast.error("Nothing to clear or failed to delete.");
      }
    },
    onError: () => toast.error("Network error. Could not clear availability."),
  });

  if (!user) {
    return null;
  }

  const updateSlot = (key, field, value) => {
    setSlots((prev) => prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)));
  };

  const removeSlot = (key) => {
    setSlots((prev) => prev.filter((s) => s.key !== key));
  };

  const addSlotFor = (day) => {
    setSlots((prev) => [...prev, defaultSlot(day)]);
  };

  const addAllDays = () => {
    setSlots((prev) => [...prev, ...WEEK_DAYS.map((d) => defaultSlot(d))]);
  };

  const handleSave = () => {
    if (slots.length === 0) {
      toast.error("Add at least one time slot before saving.");
      return;
    }
    for (const s of slots) {
      if (!s.start || !s.end) {
        toast.error(`Please fill both times for ${s.day}.`);
        return;
      }
      const [sh, sm] = s.start.split(":").map(Number);
      const [eh, em] = s.end.split(":").map(Number);
      if (sh * 60 + sm >= eh * 60 + em) {
        toast.error(`Invalid slot for ${s.day}: start must be before end.`);
        return;
      }
    }
    saveMutation.mutate({
      lawyerEmail: email,
      slots: slots.map(({ day, start, end }) => ({ day, start, end })),
    });
  };

  const handleClear = () => {
    if (slots.length === 0) return;
    if (window.confirm("Clear your entire availability schedule?")) {
      deleteMutation.mutate();
    }
  };

  const sortedDays = [...WEEK_DAYS];
  const hasSlots = slots.length > 0;

  return (
    <div className="bg-[#152238] border border-slate-800 rounded-2xl p-6 space-y-5 text-left shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-sky-400" /> Consultation Schedule
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Set your weekly availability hours. Clients will book 1-hour consultation slots within these windows.
          </p>
        </div>
        <button
          onClick={addAllDays}
          className="text-[11px] px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
        >
          + All Days
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-[#0B1524] border border-slate-800 rounded-xl p-3">
              <Skeleton className="h-4 w-32 rounded mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-36 rounded-lg" />
                <Skeleton className="h-9 w-36 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Day rows */}
          <div className="space-y-3">
            {sortedDays.map((day) => {
              const daySlots = slots.filter((s) => s.day === day);
              return (
                <div key={day} className="bg-[#0B1524] border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">{day}</p>
                    <button
                      onClick={() => addSlotFor(day)}
                      className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Slot
                    </button>
                  </div>

                  {daySlots.length === 0 ? (
                    <p className="text-[11px] text-slate-600 italic">No hours set.</p>
                  ) : (
                    <div className="space-y-2">
                      {daySlots.map((slot) => (
                        <div key={slot.key} className="flex items-center gap-2 text-xs">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(slot.key, "start", e.target.value)}
                            className="bg-[#152238] border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
                          />
                          <span className="text-slate-500">to</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(slot.key, "end", e.target.value)}
                            className="bg-[#152238] border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
                          />
                          <button
                            onClick={() => removeSlot(slot.key)}
                            className="ml-auto p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800">
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending || deleteMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-colors text-sm"
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Schedule
            </button>
            {hasSlots && !isLoading && (
              <button
                onClick={handleClear}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl transition-colors text-sm font-semibold disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}