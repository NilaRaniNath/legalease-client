"use client";
import React, { useState } from "react";
import { Chip, Button } from "@heroui/react";
import { User, Calendar, MessageCircle, Gavel, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LawyerActions from "@/components/LawyerActions";
import ChatWindow from "@/components/ChatWindow";
import CaseTimeline from "@/components/CaseTimeline";
import CaseControls from "@/components/CaseControls";
import { hiringApi, caseApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function HiringHistoryClient({ initialRequests = [] }) {
  const [actionLoading, setActionLoading] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const queryClient = useQueryClient();
  const [requests, setRequests] = useState(initialRequests);

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const casesQuery = useQuery({
    queryKey: ["cases", currentUser?.id],
    queryFn: () =>
      caseApi
        .listForUser(currentUser.id, currentUser.email)
        .then((r) => r.data?.data || []),
    enabled: Boolean(currentUser?.id),
    staleTime: 30 * 1000,
  });
  const casesList = casesQuery.data || [];
  const activeRequests = requests.filter((req) =>
    ["accepted", "paid"].includes(req.status)
  );

  const createCaseMutation = useMutation({
    mutationFn: (req) =>
      caseApi.create({
        hiringId: req._id,
        clientEmail: req.clientEmail,
        clientName: req.clientName,
        lawyerUserId: currentUser.id,
        lawyerEmail: currentUser.email,
        lawyerName: currentUser.name,
        title: `Case with ${req.clientName} - ${req.specialization || "Legal Matter"}`,
      }),
    onSuccess: (result) => {
      if (result.data.success) {
        toast.success("Case tracking started for this client!");
        queryClient.invalidateQueries({ queryKey: ["cases"] });
      } else {
        toast.error(result.data.error || "Failed to start case tracking");
      }
    },
    onError: () => toast.error("Could not start case tracking"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }) => hiringApi.updateStatus(id, newStatus),
    onSuccess: (result, variables) => {
      if (result.data.success) {
        toast.success(`Hiring request ${variables.newStatus}!`);
        setRequests((prev) =>
          prev.map((req) =>
            req._id === variables.id ? { ...req, status: variables.newStatus } : req
          )
        );
        queryClient.invalidateQueries({ queryKey: ["lawyerRequests"] });
      } else {
        toast.error(result.data.error || "Failed to update status");
      }
    },
    onError: () => toast.error("Network error."),
    onSettled: () => setActionLoading(null),
  });

  const handleActionUpdate = async (id, newStatus) => {
    setActionLoading(id);
    statusMutation.mutate({ id, newStatus });
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-[#152238] rounded-2xl border border-slate-800">
        <p className="text-slate-400 font-medium">No hiring requests received yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#152238] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-[#0B1524] border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Client Email</th>
              <th className="px-6 py-4">Request Date</th>
              <th className="px-6 py-4">Offered Fee</th>
              <th className="px-6 py-4 text-center">Current Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {requests.map((req) => (
              <tr key={req._id.toString()} className="hover:bg-[#1a2942] transition-colors">
                <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                  <User size={16} className="text-slate-400" /> {req.clientName}
                </td>
                <td className="px-6 py-4 text-slate-400">{req.clientEmail}</td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {req.requestDate ? new Date(req.requestDate).toLocaleDateString('en-US') : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-400">${req.fee}/hr</td>
                <td className="px-6 py-4 text-center">
                  <Chip
                    color={req.status === "accepted" ? "success" : req.status === "rejected" ? "danger" : "warning"}
                    variant="flat"
                    size="sm"
                    className="capitalize font-bold"
                  >
                    {req.status}
                  </Chip>
                </td>
                <td className="px-6 py-4 text-right">
                  {req.status === "pending" ? (
                    <LawyerActions
                      requestId={req._id.toString()}
                      onActionSuccess={handleActionUpdate}
                      actionLoading={actionLoading}
                    />
                  ) : req.status === "accepted" ? (
                    <Button
                      size="sm"
                      onClick={() => setActiveChat(req)}
                      className="bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold text-xs"
                      startContent={<MessageCircle size={14} />}
                    >
                      Chat
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Action Taken ({req.status})</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {currentUser && activeRequests.length > 0 && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Case Tracking Timeline</h2>
          </div>
          <p className="text-xs text-slate-400">
            Review milestones for accepted/paid clients and update progress from your dashboard.
          </p>

          {activeRequests.map((req) => {
            const caseDoc = casesList.find((c) => c.hiringId === req._id);
            return (
              <div key={req._id.toString()} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">
                    Case with {req.clientName || req.clientEmail}
                  </h4>
                  {caseDoc && <span className="text-[11px] text-slate-500 capitalize">{caseDoc.status}</span>}
                </div>
                {caseDoc ? (
                  <>
                    <CaseTimeline caseData={caseDoc} />
                    <CaseControls caseData={caseDoc} currentUser={currentUser} />
                  </>
                ) : (
                  <div className="bg-[#152238] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                      No case tracking record yet for this hire.
                    </p>
                    <button
                      onClick={() => createCaseMutation.mutate(req)}
                      disabled={createCaseMutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-slate-900 rounded-xl text-xs font-bold transition-colors shrink-0 disabled:opacity-50"
                    >
                      <PlusCircle className="w-4 h-4" />
                      {createCaseMutation.isPending ? "Starting..." : "Start Case Tracking"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeChat && currentUser && (
        <ChatWindow
          hiring={activeChat}
          currentUserEmail={currentUser.email}
          currentUserName={currentUser.name}
          onClose={() => setActiveChat(null)}
        />
      )}
    </>
  );
}