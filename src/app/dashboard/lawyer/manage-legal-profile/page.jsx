import { headers } from "next/headers"; 
import LawyerProfileForm from "./LawyerProfileForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// 💡 ফাংশনটি এখন সরাসরি email দিয়ে ব্যাকএন্ড থেকে প্রোফাইল খুঁজবে
async function getExistingProfile(email) {
  try {
    // ব্যাকএন্ড যদি ইমেইল দিয়ে ডাটা খোঁজার জন্য রেডি থাকে (অথবা আপনার ব্যাকএন্ড রুট অনুযায়ী কুয়েরি নাম দিন)
    const res = await fetch(`http://localhost:8000/api/lawyer/profile?email=${email}`, {
      cache: "no-store", 
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error("Error fetching existing profile:", err);
    return null;
  }
}

export default async function ManageLegalProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers() 
  });

  const user = session?.user;
  const currentUserEmail = user?.email; 
  const currentUserId = user?.id || user?.uid; // 💡 ইউজারের আইডি-টিও সেশন থেকে বের করে নিলাম

  if (!currentUserEmail) {
    redirect("/login"); 
  }
  
  // 💡 ইমেইল পাস করা হলো প্রোফাইল চেক করার জন্য
  const existingProfile = await getExistingProfile(currentUserEmail);

  return (
    <div className="min-h-screen bg-[#0B1524] p-6 text-slate-100 flex items-center justify-center">
      {/* 💡 এখন ৩টি প্রপস-ই পারফেক্টলি পাস করা হয়েছে */}
      <LawyerProfileForm 
        userId={currentUserId} 
        userEmail={currentUserEmail} 
        initialData={existingProfile} 
      />
    </div>
  );
}