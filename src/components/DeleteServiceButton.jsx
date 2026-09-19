"use client";

import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lawyerApi } from "@/lib/api";

export default function DeleteServiceButton({ userId }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => lawyerApi.deleteProfile(userId),
    onSuccess: (data) => {
      if (data.data?.success) {
        queryClient.invalidateQueries({ queryKey: ["lawyerProfile"] });
        router.refresh();
      } else {
        alert(data.data?.error || "Something went wrong!");
      }
    },
    onError: () => alert("Failed to connect to the server."),
  });

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your legal service profile? This will remove you from the public directory."
    );

    if (!confirmDelete) return;
    deleteMutation.mutate();
  };

  return (
    <Button
      size="sm"
      variant="light"
      className="text-red-400 hover:bg-red-500/10"
      isIconOnly
      isLoading={deleteMutation.isPending}
      onClick={handleDelete}
    >
      {!deleteMutation.isPending && <Trash2 className="w-4 h-4" />}
    </Button>
  );
}