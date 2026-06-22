// app/lawyers/[id]/page.jsx (Server Component)
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getLawyerProfile } from "@/lib/api/lawyer";
import { Chip } from "@heroui/react";
import { Calendar, ShieldCheck, Briefcase } from "lucide-react";
import ActionButtons from "./ActionButtons";

export default async function LawyerDetailsPage({ params }) {
  // Next.js 15 এর নিয়ম অনুযায়ী params-কে await করে id বের করা হলো
  const { id } = await params;
  
  const lawyer = await getLawyerProfile(id);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!lawyer || Object.keys(lawyer).length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-danger">Lawyer Profile Not Found</h2>
      </div>
    );
  }

  const isAvailable = lawyer.status !== "Busy";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start bg-slate-950/10 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md">
        
        <div className="w-full md:w-80 flex-shrink-0">
          <img 
            src={lawyer.image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600"} 
            alt={lawyer.name} 
            className="w-full h-96 object-cover rounded-2xl shadow-xl border border-white/5"
          />
        </div>

        <div className="flex-1 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                {lawyer.name}
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </h1>
              <p className="text-primary font-semibold text-lg flex items-center gap-1.5 mt-1">
                <Briefcase className="w-4 h-4" /> {lawyer.specialization}
              </p>
            </div>
            
            <Chip variant="flat" color={isAvailable ? "success" : "danger"} className="font-bold uppercase text-xs px-2.5">
              {lawyer.status || "Available"}
            </Chip>
          </div>

          <hr className="border-white/10" />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Consultation Fee</span>
              <span className="text-xl font-bold text-foreground">৳{lawyer.fee}</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
              <span className="text-xs text-gray-400 block mb-1">Joined LegalEase</span>
              <span className="text-sm font-medium text-gray-300 flex items-center gap-1.5 mt-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                {lawyer.createdAt ? new Date(lawyer.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric"
                }) : "Recent"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Biography</h3>
            <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{lawyer.bio}</p>
          </div>

          <hr className="border-white/10" />

          <ActionButtons 
            lawyerId={lawyer._id} 
            lawyerName={lawyer.name}
            fee={lawyer.fee}
            specialisation={lawyer.specialization}
            user={session?.user} 
          />
        </div>
      </div>
    </div>
  );
}