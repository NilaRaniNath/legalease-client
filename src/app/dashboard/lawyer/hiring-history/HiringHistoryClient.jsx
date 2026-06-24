"use client";
import React, { useState } from "react";
import { Chip } from "@heroui/react";
import { User, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import LawyerActions from "@/components/LawyerActions";


export default function HiringHistoryClient({ initialRequests = [] }) {
  const [actionLoading, setActionLoading] = useState(null);
  
  
  const [requests, setRequests] = useState(initialRequests);

  const handleActionUpdate = async (id, newStatus) => {
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:8000/api/hiring/update-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Hiring request ${newStatus}!`);
        setRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
        );
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-[#152238] rounded-2xl border border-slate-800">
        <p className="text-slate-400 font-medium">No hiring requests received yet.</p>
      </div>
    );
  }

  return (
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
                    {req.requestDate ? new Date(req.requestDate).toLocaleDateString() : "N/A"}
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
  );
}