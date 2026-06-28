"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function ManageUsersClient({ initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers);

const NEXT_PUBLIC_BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (err) {
      toast.error("Network error occurred.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("User removed successfully!");
        setUsers(users.filter(u => u._id !== userId));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-white text-left">
      <div className="flex items-center gap-2">
        <Users className="text-amber-500 w-6 h-6" />
        <h2 className="text-2xl font-bold">Manage Users Directory</h2>
      </div>

      <div className="bg-[#152238] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-[#0B1524] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Current Role</th>
                <th className="px-6 py-4 font-semibold">Modify Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((user) => (
                <tr key={user._id.toString()} className="hover:bg-[#1a2942] transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-100">{user.name || "Anonymous"}</td>
                  <td className="px-6 py-4 text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 
                      user.role === 'lawyer' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-[#0B1524] text-sm text-slate-200 border border-slate-700 rounded-lg p-1.5 focus:outline-none focus:border-amber-500"
                    >
                      <option value="user">User</option>
                      <option value="lawyer">Lawyer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button isIconOnly size="sm" variant="flat" color="danger" onClick={() => handleDeleteUser(user._id)}>
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}