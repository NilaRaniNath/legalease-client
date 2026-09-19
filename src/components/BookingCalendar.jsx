"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Loader2,
  CalendarPlus,
  CheckCircle2,
  LogIn,
  User,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { availabilityApi, bookingApi } from "@/lib/api";
import Skeleton from "./Skeleton";

const WEEK_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fmt = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

function hourlyBlocks(slots) {
  const blocks = [];
  for (const slot of slots) {
    let t = toMin(slot.start);
    const end = toMin(slot.end);
    while (t + 60 <= end) {
      blocks.push({ start: fmt(t), end: fmt(t + 60) });
      t += 60;
    }
  }
  return blocks;
}

export default function BookingCalendar({ lawyerEmail, lawyerName, currentUser }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [clientName, setClientName] = useState(currentUser?.name || "");
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["availability", lawyerEmail],
    queryFn: () => availabilityApi.get(lawyerEmail),
    enabled: Boolean(lawyerEmail),
  });

  // Next 14 days with their computed 1-hour booking blocks
  const days = useMemo(() => {
    const availableSlots = data?.data?.data?.slots || [];
    const list = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = WEEK_DAY_NAMES[d.getDay()];
      const daySlots = availableSlots.filter((s) => s.day === dayName);
      const blocks = hourlyBlocks(daySlots);
      const pad = (n) => String(n).padStart(2, "0");
      const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      list.push({
        iso,
        label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        blocks,
      });
    }
    return list;
  }, [data]);

  const selectedDay = useMemo(
    () => days.find((d) => d.iso === selectedDate) || null,
    [days, selectedDate]
  );

  const bookingMutation = useMutation({
    mutationFn: (payload) => bookingApi.create(payload),
    onSuccess: (result) => {
      if (result.data.success) {
        toast.success("Booking request sent! The lawyer will review it.");
        setSelectedBlock(null);
        setSelectedDate(null);
        setNotes("");
      } else {
        toast.error(result.data.error || "Failed to request booking");
      }
    },
    onError: () => toast.error("Network error. Could not request booking."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!selectedDate || !selectedBlock) {
      toast.error("Please pick a date and time slot first.");
      return;
    }
    if (!clientName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    bookingMutation.mutate({
      lawyerEmail,
      lawyerName,
      clientEmail: currentUser.email,
      clientName: clientName.trim(),
      date: selectedDate,
      startTime: selectedBlock.start,
      endTime: selectedBlock.end,
      notes: notes.trim() || undefined,
    });
  };

  const hasAvailability = days.some((d) => d.blocks.length > 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-slate-100 text-left">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <CalendarDays size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Book a Consultation</h3>
          <p className="text-xs text-slate-500">Pick a date and time slot from the lawyer availability schedule.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="flex-1 h-16 rounded-xl" />
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-lg" />
            ))}
          </div>
        </div>
      ) : !hasAvailability ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
          <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">This lawyer has not opened their consultation schedule yet.</p>
          <p className="text-xs text-slate-400 mt-1">Check back later or use the hire request below.</p>
        </div>
      ) : (
        <>
          {/* 1. Pick a day */}
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3 mt-6">1. Choose a date</p>
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
            {days.map((d) => (
              <button
                key={d.iso}
                type="button"
                disabled={d.blocks.length === 0}
                onClick={() => {
                  setSelectedDate(d.iso);
                  setSelectedBlock(null);
                }}
                className={`shrink-0 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  selectedDate === d.iso
                    ? "bg-amber-500 text-white border-amber-500 shadow-md"
                    : d.blocks.length === 0
                    ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                    : "bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-600"
                }`}
              >
                {d.label}
                {d.blocks.length === 0 && <span className="block text-[10px] font-normal">Unavailable</span>}
              </button>
            ))}
          </div>

          {/* 2. Pick a time */}
          {selectedDay && (
            <>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3 mt-6">2. Choose a time</p>
              <div className="flex flex-wrap gap-2">
                {selectedDay.blocks.length === 0 ? (
                  <p className="text-xs text-slate-400">No open slots on this day.</p>
                ) : (
                  selectedDay.blocks.map((b) => (
                    <button
                      key={`${b.start}-${b.end}`}
                      type="button"
                      onClick={() => setSelectedBlock(b)}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedBlock === b
                          ? "bg-amber-500 text-white border-amber-500 shadow-md"
                          : "bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-600"
                      }`}
                    >
                      <Clock size={13} /> {b.start} - {b.end}
                    </button>
                  ))
                )}
              </div>
            </>
          )}

          {/* 3. Confirm */}
          {!currentUser ? (
            <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-100 p-5 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <LogIn className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Sign in to request a consultation slot.</p>
                  <p className="text-xs text-slate-400">You must be logged in to book.</p>
                </div>
              </div>
              <Link href="/auth/signin">
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-sm font-bold rounded-xl">
                  Sign In
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4">
              <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                {selectedDate && selectedBlock ? (
                  <span>
                    <strong className="text-slate-800">{selectedDay?.label}</strong> at{" "}
                    <strong className="text-slate-800">{selectedBlock.start} - {selectedBlock.end}</strong>
                  </span>
                ) : (
                  <span className="text-slate-400">Select a date and time above to confirm.</span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={13} /> Your Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={13} /> Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Briefly describe what you'd like to discuss..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedDate || !selectedBlock || bookingMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {bookingMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CalendarPlus className="w-4 h-4" />
                )}
                Request Booking
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}