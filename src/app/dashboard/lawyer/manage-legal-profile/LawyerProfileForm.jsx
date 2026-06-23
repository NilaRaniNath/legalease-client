"use client";

import { useState } from "react";
import { Card, Avatar, Button, Chip } from "@heroui/react";
import { Upload, DollarSign, Briefcase, User, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LawyerProfileForm({ userId, initialData }) {
  const router = useRouter();

  // 💡 FIX 1: initialData?.image jodi null ba empty hoy, direct default image URL set korbo
  const [profile, setProfile] = useState({
    userId: userId || "",
    name: initialData?.name || "",
    specialization: initialData?.specialization || "",
    fee: initialData?.fee || "",
    bio: initialData?.bio || "",
    image: initialData?.image || "/default-avatar.png", 
    status: initialData?.status || "Available"
  });

  const [uploading, setUploading] = useState(false);

  // ImgBB-তে নতুন ছবি আপলোড হ্যান্ডলার
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
        // 💡 FIX 2: Dynamic fallback tracking logic
        const uploadedImageUrl = imgData.data.url || imgData.data.display_url;
        setProfile((prev) => ({ ...prev, image: uploadedImageUrl }));
        
        Swal.fire({ 
          icon: "success", 
          title: "New Photo Uploaded!", 
          toast: true, 
          position: "top-end", 
          showConfirmButton: false, 
          timer: 1500 
        });
      } else {
        Swal.fire({ icon: "error", title: "Failed to parse image cloud URL" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Image upload failed" });
    } finally {
      setUploading(false);
    }
  };

  // প্রোফাইল ক্রিয়েট বা এডিট করে সেভ করার ফাংশন
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // 💡 FIX 3: MongoDB strict context map schema wrapper
    const payload = {
      userId: profile.userId || userId,
      name: profile.name,
      specialization: profile.specialization,
      fee: Number(profile.fee),
      bio: profile.bio,
      image: profile.image || "/default-avatar.png", // জেনুইন স্ট্রিং ব্যাকআপ
      status: profile.status
    };

    try {
      const res = await fetch("http://localhost:8000/api/lawyer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success || res.ok) {
        Swal.fire({ 
          title: initialData ? "Profile Updated!" : "Profile Created!", 
          text: "Your changes are now live on the dashboard.", 
          icon: "success",
          confirmButtonColor: "#0ea5e9"
        }).then(() => {
          router.push("/dashboard/lawyer");
          router.refresh(); 
        });
      } else {
        Swal.fire({ icon: "error", title: data.message || "Failed to save profile" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed to connect to server" });
    }
  };

  return (
    <Card className="bg-[#152238] border border-slate-700 p-6 max-w-xl w-full space-y-5 shadow-2xl">
      <div className="border-b border-slate-700 pb-3 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-sky-400">Manage Legal Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {initialData ? "Review and edit your existing services." : "Fill up details to launch your live card."}
          </p>
        </div>
        {initialData && (
          <Chip 
            avatar={<CheckCircle className="w-3.5 h-3.5 text-emerald-500" />} 
            color="success" 
            variant="flat" 
            size="sm"
          >
            Profile Active
          </Chip>
        )}
      </div>
      
      {/* ছবি ডিসপ্লে এবং আপলোড এরিয়া */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          {/* 💡 FIX 4: Static source logic path integration */}
          <Image 
            src={profile.image} 
            width={120}
            height={120}
            alt={profile.name || "UserImage"} 
            priority 
            className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-[#0B1524] border border-slate-700 shrink-0 object-cover" 
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-opacity">
            <Upload className="w-5 h-5 text-sky-400" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        {uploading && <span className="text-xs text-sky-400 animate-pulse">Uploading photo to ImgBB...</span>}
      </div>

      {/* প্রোফাইল এডিট ফর্ম */}
      <form onSubmit={handleProfileSubmit} className="space-y-4 text-left">
        <div>
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Full Name</label>
          <input 
            type="text" 
            required 
            placeholder="Official legal name"
            value={profile.name} 
            onChange={(e) => setProfile({...profile, name: e.target.value})} 
            className="w-full mt-1 px-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500" 
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Specialization Field</label>
          <div className="relative mt-1">
            <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input 
              type="text" 
              required 
              placeholder="e.g., Corporate Law, Criminal, Family Law" 
              value={profile.specialization} 
              onChange={(e) => setProfile({...profile, specialization: e.target.value})} 
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500" 
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Consultation Fee ($/hr)</label>
          <div className="relative mt-1">
            <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input 
              type="number" 
              required 
              placeholder="Hourly rate"
              value={profile.fee} 
              onChange={(e) => setProfile({...profile, fee: e.target.value})} 
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500" 
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Professional Summary / Bio</label>
          <textarea 
            rows={4} 
            required 
            placeholder="Describe your court achievements and legal history..."
            value={profile.bio} 
            onChange={(e) => setProfile({...profile, bio: e.target.value})} 
            className="w-full mt-1 px-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500 resize-none" 
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold mt-2 py-2.5" 
          radius="xl"
        >
          {initialData ? "Update Legal Profile" : "Save Profile Info"}
        </Button>
      </form>
    </Card>
  );
}