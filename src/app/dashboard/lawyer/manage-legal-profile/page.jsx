// app/dashboard/lawyer/manage-legal-profile/page.jsx
import { getLawyerProfile, getLawyerServices } from "@/lib/api/lawyer";

import LawyerProfileForm from "./LawyerProfileForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export default async function ManageLegalProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  
  const [initialProfile, initialServices] = await Promise.all([
    getLawyerProfile(userId),
    getLawyerServices(userId)
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 space-y-12">
      <div className="max-w-6xl mx-auto space-y-2 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Manage Legal Profile & Services
        </h1>
        <p className="text-sm text-slate-400">
          Control your public visibility, personal information, and consultancy specializations.
        </p>
      </div>

 
      <LawyerProfileForm 
        currentUserId={userId}
        initialProfile={initialProfile || {}}
        initialServices={initialServices}
      />
    </div>
  );
}