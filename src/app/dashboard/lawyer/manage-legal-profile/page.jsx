import { headers } from "next/headers"; 
import LawyerProfileForm from "./LawyerProfileForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getExistingProfile(email) {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/lawyer/profile?email=${email}`, {
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
  const currentUserId = user?.id || user?.uid; 

  if (!currentUserEmail) {
    redirect("/auth/signin"); // 💡 তোমার রাউট স্ট্রাকচার অনুযায়ী পাথটি চেক করে নিও (/auth/signin নাকি /signin)
  }
  
  const existingProfile = await getExistingProfile(currentUserEmail);

  return (
    // 📱 প্যাডিং রেসপন্সিভ করা হলো: মোবাইলে p-4 এবং বড় স্ক্রিনে md:p-8
    // কন্টেন্ট যেন মোবাইল স্ক্রিনে একদম উপরে লেগে না থাকে সেজন্য min-h-[calc(100vh-4rem)] ব্যবহার করা বেস্ট
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B1524] p-4 md:p-8 text-slate-100 flex items-center justify-center">
      <LawyerProfileForm 
        userId={currentUserId} 
        userEmail={currentUserEmail} 
        initialData={existingProfile} 
      />
    </div>
  );
}