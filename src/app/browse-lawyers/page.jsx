import { Card, Chip, Button } from "@heroui/react";
import { Briefcase, DollarSign, Search, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getAllLawyers() {
  try {
    const res = await fetch("http://localhost:8000/api/lawyer/all", {
      cache: "no-store", 
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    return [];
  }
}

export default async function BrowseLawyersPage() {
  const lawyers = await getAllLawyers();

  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="border-b border-slate-800 pb-4 text-left">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-sky-400" /> Public Lawyer Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Find elite legal service providers live on the network.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {lawyers.map((lawyer) => (
            <Card key={lawyer.userId} className="bg-[#152238] border border-slate-700/60 p-6 md:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6 text-left items-center md:items-start transition-all hover:border-sky-500/40">
              
              
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-[#0B1524] border border-slate-700 shrink-0 overflow-hidden relative">
                <Image 
                  src={lawyer.image && lawyer.image !== "null" ? lawyer.image : "/default-avatar.png"} 
                  alt={lawyer.name || "Lawyer"} 
                  fill
                  priority 
                  sizes="(max-width: 768px) 96px, 128px"
                  className="object-cover" 
                />
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white">{lawyer.name}</h2>
                    <p className="text-sky-400 font-medium text-xs md:text-sm flex items-center gap-1 mt-1">
                      <Briefcase className="w-3.5 h-3.5" /> {lawyer.specialization}
                    </p>
                  </div>
                  <Chip color="success" variant="flat" size="sm" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {lawyer.status}
                  </Chip>
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="bg-[#0B1524] border border-slate-800 px-3 py-1.5 rounded-xl text-emerald-400 font-bold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> ${lawyer.fee}/hr
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed bg-[#0B1524] p-3 rounded-xl border border-slate-800 line-clamp-2">{lawyer.bio}</p>

                
                <div className="flex justify-end pt-2">
                  <Link href={`/lawyers/${lawyer.userId}`}>
                    <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold" radius="xl" endContent={<ArrowUpRight className="w-4 h-4" />}>
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}