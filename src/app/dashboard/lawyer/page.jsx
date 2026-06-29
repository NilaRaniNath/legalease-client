import { Card, Chip, Button } from "@heroui/react";
import { Briefcase, DollarSign, Edit, PlusCircle } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Image from "next/image";
import DeleteServiceButton from "@/components/DeleteServiceButton";

  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


async function getDashboardProfile(userEmail) {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/lawyer/profile?email=${encodeURIComponent(userEmail)}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return null;
  }
}

export default async function DashboardPage() {

  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  
  const currentUserEmail = session?.user?.email;
  
  
  const profile = currentUserEmail ? await getDashboardProfile(currentUserEmail) : null;

  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* হেডার */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Lawyer Control Panel</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage your public directory listing and legal services.</p>
          </div>
          {profile && (
            <Link href="/dashboard/lawyer/manage-legal-profile">
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold" radius="lg" startContent={<Edit className="w-4 h-4" />}>
                Edit Profile
              </Button>
            </Link>
          )}
        </div>

        {/* যদি প্রোফাইল না থাকে */}
        {!profile ? (
          <Card className="bg-[#152238] border border-slate-700/60 p-8 text-center space-y-4">
            <h3 className="text-base font-bold text-white">Your Legal Profile is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Complete your profile setup to list your services.</p>
            <Link href="/dashboard/lawyer/manage-legal-profile">
              <Button size="sm" className="bg-sky-500 text-slate-900 font-bold" radius="xl" startContent={<PlusCircle className="w-4 h-4" />}>
                Create Profile Now
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* ১. লাইভ কার্ড ভিউ */}
            <div className="space-y-2 text-left">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Your Live Public Card Preview</h3>
              <Card className="bg-[#152238] border border-slate-700/60 p-6 md:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-[#0B1524] border border-slate-700 shrink-0 overflow-hidden relative">
                  <Image 
                    src={profile?.image && profile.image.trim() !== "" ? profile.image : "/default-avatar.png"} 
                    alt={profile?.name || "Lawyer Profile"}
                    width={120}
                    height={120}
                    priority={profile?.image && profile.image.trim() !== "" ? true : false}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-[#0B1524] border border-slate-700 shrink-0 object-cover" 
                  />
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                      <p className="text-sky-400 font-medium text-xs md:text-sm flex items-center gap-1 mt-1">
                        <Briefcase className="w-3.5 h-3.5" /> {profile.specialization}
                      </p>
                    </div>
                    <Chip color="success" variant="flat" size="sm" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {profile.status}
                    </Chip>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-[#0B1524] border border-slate-800 px-3 py-1.5 rounded-xl text-emerald-400 font-bold flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> ${profile.fee}/hr
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed bg-[#0B1524] p-3 rounded-xl border border-slate-800">{profile.bio}</p>
                </div>
              </Card>
            </div>

            {/* ২. প্রোফাইল ম্যানেজমেন্ট -> টেবিল */}
            <div className="space-y-3 text-left">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Manage Services</h3>
              <div className="bg-[#152238] border border-slate-700/60 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#0B1524] text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="p-4">Service / Specialization</th>
                      <th className="p-4">Hourly Rate</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    <tr>
                      <td className="p-4 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-sky-500/10 flex items-center justify-center text-sky-400">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        {profile.specialization}
                      </td>
                      <td className="p-4 text-emerald-400 font-semibold">${profile.fee}/hr</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {profile.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link href="/dashboard/lawyer/manage-legal-profile">
                          <Button size="sm" variant="light" className="text-sky-400 hover:bg-sky-500/10" isIconOnly>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        <DeleteServiceButton userId={profile.userId} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}