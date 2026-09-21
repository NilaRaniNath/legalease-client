"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit2, Check, X, MessageSquare } from "lucide-react";
import { commentApi } from "@/lib/api";

export default function CommentSection({ lawyerId, currentUser, initialComments = [] }) {
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["comments", lawyerId],
    queryFn: () => commentApi.getForLawyer(lawyerId).then((d) => d.data),
    initialData: { success: true, data: initialComments },
    placeholderData: { success: true, data: initialComments },
    staleTime: 30 * 1000,
  });

  const comments = data?.data || [];

  const createMutation = useMutation({
    mutationFn: () =>
      commentApi.create({
        lawyerId,
        userEmail: currentUser.email,
        userName: currentUser.name || "Anonymous",
        commentText: newComment,
      }),
    onSuccess: (result) => {
      if (result.res.ok && result.data.success) {
        queryClient.invalidateQueries({ queryKey: ["comments", lawyerId] });
        setNewComment("");
        Swal.fire("Success", "Comment added successfully!", "success");
      } else {
        Swal.fire(
          "Hold on!",
          result.data?.message || result.data?.error || "Failed to add comment.",
          "warning"
        );
      }
    },
    onError: () => Swal.fire("Error", "Server connection failed.", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (id) =>
      commentApi.update(id, {
        commentText: editText,
        userEmail: currentUser.email,
      }),
    onSuccess: (result) => {
      if (result.res.ok && result.data.success) {
        queryClient.invalidateQueries({ queryKey: ["comments", lawyerId] });
        setEditingId(null);
        Swal.fire("Updated", "Your comment has been updated.", "success");
      } else {
        Swal.fire(
          "Update failed!",
          result.data?.message || result.data?.error || "Please try again.",
          "error"
        );
      }
    },
    onError: () => Swal.fire("Error", "Failed to update comment.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => commentApi.remove(id, currentUser.email),
    onSuccess: (result) => {
      if (result.res.ok && result.data.success) {
        queryClient.invalidateQueries({ queryKey: ["comments", lawyerId] });
        Swal.fire("Deleted!", "Your comment has been deleted.", "success");
      } else {
        Swal.fire(
          "Delete failed!",
          result.data?.message || result.data?.error || "Please try again.",
          "error"
        );
      }
    },
    onError: () => Swal.fire("Error", "Failed to delete comment.", "error"),
  });

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createMutation.mutate();
  };

  const handleUpdateComment = (id) => {
    if (!editText.trim()) return;
    updateMutation.mutate(id);
  };

  const handleDeleteComment = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <MessageSquare className="text-amber-500" size={22} /> Reviews & Comments ({comments.length})
      </h3>

      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience with this lawyer..."
            className="w-full p-4 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50"
          >
            {createMutation.isPending ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
          🔒 Only clients who have hired this lawyer can leave a review.
        </p>
      )}

      <div className="space-y-4 pt-4 border-t border-slate-100">
        {isLoading && comments.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Loading reviews...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No reviews yet for this lawyer.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{comment.userName}</h4>
                  <p className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {currentUser && currentUser.email === comment.userEmail && (
                  <div className="flex items-center gap-2">
                    {editingId === comment._id ? (
                      <>
                        <button onClick={() => handleUpdateComment(comment._id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={16} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:bg-slate-50 rounded"><X size={16} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(comment._id); setEditText(comment.commentText); }} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteComment(comment._id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingId === comment._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 border border-blue-400 rounded-lg text-sm text-slate-800 focus:outline-none"
                />
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed">{comment.commentText}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}