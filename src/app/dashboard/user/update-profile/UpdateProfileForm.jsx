"use client";
import React, { useState } from "react";
import { Card, Button } from "@heroui/react";
import { Upload, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; 
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function UpdateProfileForm({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  
  const defaultAvatar = "https://i.ibb.co/0V6v4LK/default-avatar.png";

 
  const displayImage = image && !image.includes("googleusercontent") ? image : defaultAvatar;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const imgData = await res.json();
      if (imgData.success) {
        setImage(imgData.data.display_url); // আপলোড সফল হলে ImgBB লিংক স্টেটে সেট হবে
        toast.success("Avatar uploaded!");
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/user/update-profile/${encodeURIComponent(user.email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      const data = await res.json();
      
      if (data.acknowledged || data.modifiedCount > 0 || data.upsertedCount > 0) {
        toast.success("Profile updated successfully!");
        router.refresh();
        setTimeout(() => {
          router.push("/dashboard/user");
        }, 400);
      } else {
        toast.error("No changes made");
        router.push("/dashboard/user");
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-[#152238] border border-slate-800 p-5 md:p-6 space-y-6 shadow-2xl rounded-2xl text-left">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-sky-400">Edit Profile</h2>
          <p className="text-xs text-slate-400">Change your public profile details.</p>
        </div>
        <Link href="/dashboard/user">
          <Button size="sm" variant="flat" className="text-slate-300 border border-slate-700" startContent={<ArrowLeft size={12} />}>
            Back
          </Button>
        </Link>
      </div>

      {/* 🌟 ইমেজ সেকশন */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-[#0B1524] border border-slate-700 group-hover:border-sky-500 transition-all overflow-hidden flex items-center justify-center shadow-inner">
            {/* 💡 এখানে profile.image বা image-এর বদলে কন্ডিশনাল displayImage ব্যবহার করা হয়েছে */}
            {displayImage ? (
              <Image 
                src={displayImage} 
                alt="User Profile" 
                width={96} 
                height={96} 
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <User size={32} className="text-slate-500" />
            )}
          </div>
             
          <label className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-opacity z-10">
            <Upload size={18} className="text-sky-400" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        {uploading && <span className="text-[11px] text-sky-400 animate-pulse">Uploading...</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Full Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500" />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email (Fixed)</label>
          <input type="email" disabled value={user?.email || ""} className="w-full px-4 py-2.5 bg-[#0B1524]/50 border border-slate-800 rounded-xl text-sm text-slate-500 cursor-not-allowed" />
        </div>

        <Button type="submit" disabled={uploading || saving} className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 text-slate-900 font-bold mt-2" radius="xl">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Card>
  );
}