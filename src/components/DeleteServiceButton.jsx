
"use client";

import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteServiceButton({ userId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your legal service profile? This will remove you from the public directory."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/lawyer/profile/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Service deleted successfully!");
        
        router.refresh(); 
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      size="sm" 
      variant="light" 
      className="text-red-400 hover:bg-red-500/10" 
      isIconOnly
      isLoading={loading}
      onClick={handleDelete}
    >
      {!loading && <Trash2 className="w-4 h-4" />}
    </Button>
  );
}