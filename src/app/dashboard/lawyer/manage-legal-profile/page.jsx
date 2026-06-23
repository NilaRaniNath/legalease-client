
import { headers } from "next/headers"; 
import LawyerProfileForm from "./LawyerProfileForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getExistingProfile(userId) {
  try {
   
    const res = await fetch(`http://localhost:8000/api/lawyer/profile?userId=${userId}`, {
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
  const currentUserId = user?.id; 

 
  if (!currentUserId) {
    redirect("/login"); 
  }
  
  const existingProfile = await getExistingProfile(currentUserId);

  return (
    <div className="min-h-screen bg-[#0B1524] p-6 text-slate-100 flex items-center justify-center">
      
      <LawyerProfileForm userId={currentUserId} initialData={existingProfile} />
    </div>
  );
}