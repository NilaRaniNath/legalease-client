"use client";

import { useState } from "react";
import { Card, Button, Chip } from "@heroui/react";
import { Upload, DollarSign, Briefcase, CheckCircle, Eye, EyeOff, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function LawyerProfileForm({ userId, initialData, userEmail }) {
  const router = useRouter();

  // প্রোফাইল স্টেট ম্যানেজমেন্ট
  const [profile, setProfile] = useState({
    email: initialData?.email || userEmail || "", // ডাটাবেজের কনভেনশন অনুযায়ী ফিল্ডের নাম email রাখা ভালো
    name: initialData?.name || "",
    specialization: initialData?.specialization || "",
    fee: initialData?.fee || "",
    bio: initialData?.bio || "",
    image: initialData?.image || "/default-avatar.png", 
    status: initialData?.status || "Available", 
    isPublished: initialData?.isPublished !== undefined ? initialData.isPublished : true
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
        Swal.fire({ icon: "error", title: "Failed to upload image to cloud" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Image upload failed" });
    } finally {
      setUploading(false);
    }
  };

  // প্রোফাইল ক্রিয়েট বা আপডেট করার ফাংশন
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // 💡 সিকিউরড ও ডিফেন্সিভ ইমেইল সিলেকশন
    const finalEmail = profile.email || userEmail;

    if (!finalEmail) {
      Swal.fire({ icon: "error", title: "User email not found. Please log in again." });
      return;
    }

    const payload = {
      email: finalEmail,
      userId: userId, 
      name: profile.name,
      specialization: profile.specialization,
      fee: Number(profile.fee),
      bio: profile.bio,
      image: profile.image,
      status: profile.status,
      isPublished: initialData ? profile.isPublished : false, 
      isVerified: initialData ? true : false 
    };

    // ক) ইউজার যদি অলরেডি ভেরিফাইড বা পুরানো হয় (সরাসরি আপডেট)
    if (initialData) {
      try {
        const res = await fetch("http://localhost:8000/api/lawyer/profile", {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire({ title: "Profile Updated!", icon: "success", confirmButtonColor: "#0ea5e9" })
            .then(() => router.refresh());
        }
      } catch (err) {
        Swal.fire({ icon: "error", title: "Connection failed" });
      }
      return;
    }

    // খ) ইউজার যদি একদম নতুন হয় (প্রথমে ডাটাবেজে সেভ, তারপর পেমেন্টে রিডাইরেক্ট)
    try {
      const res = await fetch("http://localhost:8000/api/lawyer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "Profile Saved!",
          text: "Redirecting to secure Stripe payment to activate your professional profile card.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Proceed to Checkout",
          confirmButtonColor: "#0ea5e9",
          cancelButtonColor: "#64748b",
        }).then((result) => {
          if (result.isConfirmed) {
            // 💡 ডাইনামিক ফর্ম তৈরি করে স্ট্রাইপ রুটে ইমেইল পাস করা হচ্ছে
            const checkoutForm = document.createElement("form");
            checkoutForm.method = "POST";
            checkoutForm.action = `/api/checkout_sessions?email=${encodeURIComponent(finalEmail)}`;
            document.body.appendChild(checkoutForm);
            checkoutForm.submit();
          }
        });
      } else {
        Swal.fire({ icon: "error", title: "Failed to initialize profile in database" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Server error during registration" });
    }
  };

  // তাৎক্ষণিক Publish / Unpublish Toggle করার ফাংশন
  const togglePublishStatus = async () => {
    const nextPublishState = !profile.isPublished;
    setProfile(prev => ({ ...prev, isPublished: nextPublishState }));

    try {
      const res = await fetch("http://localhost:8000/api/lawyer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isPublished: nextPublishState }),
      });
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: nextPublishState ? "Profile Published Live!" : "Profile Hidden (Unpublished)",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000
        });
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to toggle publish status", err);
    }
  };

  // সম্পূর্ণ প্রোফাইল/সেবা ডিলিট করার ফাংশন
  const handleDeleteProfile = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete your entire lawyer listing profile!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:8000/api/lawyer/profile/${userId}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire("Deleted!", "Your legal profile has been removed.", "success").then(() => {
              window.location.reload(); 
            });
          }
        } catch (err) {
          Swal.fire("Error!", "Could not delete profile at this time.", "error");
        }
      }
    });
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
          <div className="flex gap-2 items-center">
            <Chip 
              avatar={<CheckCircle className="w-3.5 h-3.5 text-emerald-500" />} 
              color={profile.isPublished ? "success" : "warning"} 
              variant="flat" 
              size="sm"
            >
              {profile.isPublished ? "Live on Directory" : "Hidden / Paused"}
            </Chip>
          </div>
        )}
      </div>
      
      {/* ছবি ডিসপ্লে এবং একশনস */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          <Image 
            src={profile.image} 
            width={120}
            height={120}
            alt={profile.name || "UserImage"} 
            priority 
            className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-[#0B1524] border border-slate-700 shrink-0 object-cover" 
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-xl cursor-pointer transition-opacity">
            <Upload className="w-5 h-5 text-sky-400" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        {uploading && <span className="text-xs text-sky-400 animate-pulse">Uploading photo to ImgBB...</span>}

        {/* Quick Controls */}
        {initialData && (
          <div className="flex gap-4 mt-2">
            <Button size="sm" variant="flat" color={profile.isPublished ? "warning" : "success"} onClick={togglePublishStatus}>
              {profile.isPublished ? <><EyeOff className="w-4 h-4 mr-1" /> Unpublish</> : <><Eye className="w-4 h-4 mr-1" /> Publish Live</>}
            </Button>
            <Button size="sm" variant="flat" color="danger" onClick={handleDeleteProfile}>
              <Trash2 className="w-4 h-4 mr-1" /> Delete Profile
            </Button>
          </div>
        )}
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
            <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <select
              required
              value={profile.specialization}
              onChange={(e) => setProfile({...profile, specialization: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
            >
              <option value="" disabled>Select Specialization</option>
              <option value="Criminal Law">Criminal Law</option>
              <option value="Corporate Law">Corporate & Business Law</option>
              <option value="Family Law">Family & Marriage Law</option>
              <option value="Property Law">Property & Real Estate Law</option>
              <option value="Civil Law">Civil Law</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Availability Status</label>
            <select
              value={profile.status}
              onChange={(e) => setProfile({...profile, status: e.target.value})}
              className="w-full mt-1 px-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy (Fully Booked)</option>
            </select>
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
          {initialData ? "Update Legal Profile" : "Save & Proceed to Pay"}
        </Button>
      </form>
    </Card>
  );
}