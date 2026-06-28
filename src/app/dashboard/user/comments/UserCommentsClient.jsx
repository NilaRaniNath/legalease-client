"use client";
import React, { useState } from "react";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Textarea, TextArea } from "@heroui/react";
import { Edit2, Trash2, MessageSquare, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function UserCommentsClient({ initialComments = [], currentUser }) {
  const [comments, setComments] = useState(initialComments);
  const [isOpen, setIsOpen] = useState(false); 
  const [selectedComment, setSelectedComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [submitting, setSubmitting] = useState(false);

 
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      
      const res = await fetch(`http://localhost:8000/api/comments/${id}?email=${currentUser?.email}`, { 
        method: "DELETE" 
      });
      const json = await res.json();
      
      if (json.success) {
        toast.success("Comment deleted successfully!");
        setComments(comments.filter(c => c._id !== id));
      } else {
        toast.error(json.message || "Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  
  const openEditModal = (comment) => {
    setSelectedComment(comment);
    setEditText(comment.commentText);
    setIsOpen(true);
  };


  const handleUpdate = async () => {
    if (!editText.trim()) return toast.error("Comment cannot be empty!");
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/comments/${selectedComment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
       
        body: JSON.stringify({ 
          commentText: editText,
          userEmail: currentUser?.email 
        }),
      });
      const json = await res.json();
      
      if (json.success) {
        toast.success("Comment updated successfully!");
       
        setComments(comments.map(c => c._id === selectedComment._id ? { ...c, commentText: editText } : c));
        setIsOpen(false);
      } else {
        toast.error(json.message || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-white text-left">
      <div className="flex items-center gap-2">
        <MessageSquare className="text-amber-500 w-6 h-6" />
        <h2 className="text-2xl font-bold">My Comments & Reviews</h2>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12 bg-[#152238] rounded-2xl border border-slate-800 text-slate-400">
          You have not posted any comments yet.
        </div>
      ) : (
        <div className="bg-[#152238] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-[#0B1524] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Comments</th>
                  <th className="px-6 py-4 font-semibold">Posted Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comments.map((comment) => (
                  <tr key={comment._id.toString()} className="hover:bg-[#1a2942] transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm font-medium text-slate-100 line-clamp-2">
                        {comment.commentText}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-400 inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-500" />
                        {new Date(comment.createdAt).toLocaleDateString("en-US", { 
                          year: "numeric", 
                          month: "short", 
                          day: "numeric" 
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <Button 
                          isIconOnly size="sm" variant="flat" color="warning"
                          onClick={() => openEditModal(comment)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button 
                          isIconOnly size="sm" variant="flat" color="danger"
                          onClick={() => handleDelete(comment._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📝 পপ-আপ মোডাল */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        placement="center" 
        backdrop="blur" 
        className="dark text-white bg-[#0B1524] border border-slate-800 rounded-2xl p-2"
      >
        <div className="w-full">
          <ModalHeader className="flex flex-col gap-1 text-xl font-bold">Update Comment</ModalHeader>
          <ModalBody>
           
            <TextArea
              label="Your Review"
              variant="bordered"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-blue-950"
              rows={4}
            />
          </ModalBody>
          <ModalFooter className="flex gap-2 justify-end mt-4">
            <Button variant="flat" color="danger" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="warning" isLoading={submitting} onClick={handleUpdate} className="font-bold text-slate-900">
              Save Changes
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}