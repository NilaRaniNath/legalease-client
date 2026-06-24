"use client";
import React from "react";
import { Button } from "@heroui/react";
import { Check, X } from "lucide-react";

export default function LawyerActions({ requestId, onActionSuccess, actionLoading }) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        color="success"
        variant="flat"
        className="font-bold text-xs"
        onClick={() => onActionSuccess(requestId, "accepted")}
        disabled={actionLoading === requestId}
        startContent={<Check size={14} />}
      >
        Accept
      </Button>
      <Button
        size="sm"
        color="danger"
        variant="flat"
        className="font-bold text-xs"
        onClick={() => onActionSuccess(requestId, "rejected")}
        disabled={actionLoading === requestId}
        startContent={<X size={14} />}
      >
        Reject
      </Button>
    </div>
  );
}