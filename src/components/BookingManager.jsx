"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Check,
  X,
  CheckCheck,
  User,
  Clock,
  FileText,
  Inbox,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { bookingApi } from "@/lib/api";
import Skeleton from "./Skeleton";

const STATUS_STYLES = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  rejected: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  completed: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const [y, m, d] = dateStr.split("-").map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return dateStr;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function BookingManager() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const email = user?.email;

  const [rejectingId, setRejectingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", email],
    queryFn: () => bookingApi.listForLawyer(email),
    enabled: Boolean(email),
  });

  const bookings = data?.data?.data || [];

  const statusMutation = useMutation({
    mutationFn: ({ id, payload }) => bookingApi.updateStatus(id, payload),
    onSuccess: (result, variables) => {
      if (result.data.success) {
        toast.success(`Booking ${variables.payload.status}!`);
        queryClient.invalidateQueries({ queryKey: ["bookings", email] });
      } else {
        toast.error(result.data.error || "Failed to update booking");
      }
    },
    onError: () => toast.error("Network error. Could not update booking."),
  });

  if (!user) {
    return null;
  }

  const handleAccept = (booking) => {
    statusMutation.mutate({ id: booking._id, payload: { status: "accepted" } });
  };

  const handleReject = (booking) => {
    const reason = window.prompt("Reason for rejecting this booking (optional):")?.trim();
    setRejectingId(booking._id);
    statusMutation.mutate(
      { id: booking._id, payload: { status: "rejected", replyNote: reason || undefined } },
      { onSettled: () => setRejectingId(null) }
    );
  };

  const handleComplete = (booking) => {
    statusMutation.mutate({ id: booking._id, payload: { status: "completed" } });
  };

  return (
    <div className="bg-[#152238] border border-slate-800 rounded-2xl p-6 space-y-5 text-left shadow-xl">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Consultation Bookings</h3>
          <p className="text-xs text-slate-400">Review and respond to client calendar requests.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 bg-[#0B1524] rounded-xl p-4 border border-slate-800">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-[#0B1524] rounded-xl border border-slate-800">
          <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No consultation bookings yet.</p>
          <p className="text-[11px] text-slate-600 mt-1">Clients will appear here once they book a slot.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-[#0B1524] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Notes</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-[#1a2942] transition-colors align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-500" /> {booking.clientName || booking.clientEmail}
                    </p>
                    <p className="text-[11px] text-slate-500">{booking.clientEmail}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-200">
                      {formatDate(booking.date)}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {booking.startTime} - {booking.endTime}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-bold border uppercase ${STATUS_STYLES[booking.status] || STATUS_STYLES.pending}`}>
                      {booking.status}
                    </span>
                    {booking.replyNote && (
                      <p className="text-[10px] text-slate-500 italic mt-1">Reply: {booking.replyNote}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    {booking.notes ? (
                      <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed flex items-start gap-1">
                        <FileText className="w-3 h-3 shrink-0 mt-0.5" /> {booking.notes}
                      </p>
                    ) : (
                      <span className="text-xs text-slate-600 italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {booking.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAccept(booking)}
                          disabled={statusMutation.isPending}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleReject(booking)}
                          disabled={statusMutation.isPending || rejectingId === booking._id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : booking.status === "accepted" ? (
                      <button
                        onClick={() => handleComplete(booking)}
                        disabled={statusMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ml-auto"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark Completed
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600 italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}