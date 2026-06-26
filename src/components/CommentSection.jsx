"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Trash2, Edit2, Check, X, MessageSquare } from "lucide-react";

export default function CommentSection({ lawyerId, currentUser, initialComments = [] }) {
 
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId,
          userEmail: currentUser.email,
          userName: currentUser.name || "Anonymous",
          commentText: newComment,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setComments([resData.data, ...comments]); 
        setNewComment("");
        Swal.fire("Success", "Comment added successfully!", "success");
      } else {
        Swal.fire("Hold on!", resData.message || "Failed to add comment.", "warning");
      }
    } catch (err) {
      Swal.fire("Error", "Server connection failed.", "error");
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateComment = async (id) => {
    if (!editText.trim()) return;

    try {
      const res = await fetch(`http://localhost:8000/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentText: editText, userEmail: currentUser.email }),
      });

      if (res.ok) {
        setComments(comments.map(c => c._id === id ? { ...c, commentText: editText } : c));
        setEditingId(null);
        Swal.fire("Updated", "Your comment has been updated.", "success");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update comment.", "error");
    }
  };

  
  const handleDeleteComment = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:8000/api/comments/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail: currentUser.email }),
          });

          if (res.ok) {
            setComments(comments.filter(c => c._id !== id));
            Swal.fire("Deleted!", "Your comment has been deleted.", "success");
          }
        } catch (err) {
          Swal.fire("Error", "Failed to delete comment.", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <MessageSquare className="text-amber-500" size={22} /> Reviews & Comments ({comments.length})
      </h3>

      {/* কমেন্ট সাবমিট করার ফর্ম */}
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
            disabled={loading}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
          🔒 Only clients who have hired this lawyer can leave a review.
        </p>
      )}

      {/* কমেন্ট দেখানোর এরিয়া */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        {comments.length === 0 ? (
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
    day: "numeric"
  })}
</p>
                </div>

                {/* এডিট-ডিলিট অ্যাকশন কন্ট্রোল */}
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

              {/* কমেন্ট কন্টেন্ট বডি */}
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