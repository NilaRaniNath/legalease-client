import { Card, Chip, Button } from "@heroui/react";
import { Briefcase, DollarSign, Search, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


 const NEXT_PUBLIC_BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;

async function getLawyers(resolvedParams) {
  try {
    const queryParams = new URLSearchParams({
      search: resolvedParams.search || "",
      specialization: resolvedParams.specialization || "",
      status: resolvedParams.status || "",
      maxFee: resolvedParams.maxFee || "",
      page: resolvedParams.page || "1",
      limit: "6",
    });

    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/lawyer/all?${queryParams.toString()}`, {
      cache: "no-store", 
    });
    
    if (!res.ok) return { data: [], pagination: { totalPages: 1, currentPage: 1 } };
    const json = await res.json();
    return {
      data: json.success ? json.data : [],
      pagination: json.pagination || { totalPages: 1, currentPage: 1 },
    };
  } catch (err) {
    console.error("Error fetching lawyers:", err);
    return { data: [], pagination: { totalPages: 1, currentPage: 1 } };
  }
}


export default async function BrowseLawyersPage({ searchParams }) {
  
  
  const resolvedParams = await searchParams; 
  
  const currentSearch = resolvedParams.search || "";
  const currentSpecialization = resolvedParams.specialization || "";
  const currentStatus = resolvedParams.status || "";
  const currentMaxFee = resolvedParams.maxFee || "";
  const currentPage = parseInt(resolvedParams.page) || 1;

 
  const { data: lawyers, pagination } = await getLawyers(resolvedParams);
  const totalPages = pagination.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* হেডার সেকশন */}
        <div className="border-b border-slate-800 pb-4 text-left">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-sky-400" /> Public Lawyer Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Search, filter, and hire expert legal counsel in real-time.</p>
        </div>

        {/* সার্চ এবং ফিল্টারিং প্যানেল */}
        <form method="GET" className="bg-[#152238] p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end text-left">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Search Legal Experts</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                name="search"
                type="text"
                placeholder="Type name or keyword..."
                defaultValue={currentSearch}
                className="w-full bg-[#0B1524] border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Specialization</label>
            <select 
              name="specialization"
              defaultValue={currentSpecialization}
              className="w-full bg-[#0B1524] border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-sky-500 h-[38px]"
            >
              <option value="">All Specializations</option>
              <option value="Criminal">Criminal Law</option>
              <option value="Corporate">Corporate Law</option>
              <option value="Family">Family Law</option>
              <option value="Civil">Civil Litigation</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Max Fee Range ($/hr)</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                name="maxFee"
                type="number"
                placeholder="Max hourly rate..."
                defaultValue={currentMaxFee}
                className="w-full bg-[#0B1524] border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col gap-2">
            <div className="w-full">
              <label className="text-xs font-semibold text-slate-400">Availability Status</label>
              <select 
                name="status"
                defaultValue={currentStatus}
                className="w-full bg-[#0B1524] border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-sky-500 h-[38px]"
              >
                <option value="">Any Status</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy / Booked</option>
              </select>
            </div>
            <Button type="submit" size="sm" className="bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold w-full rounded-xl h-[38px]">
              Apply Filters
            </Button>
          </div>
        </form>

        {/* ডাটা রেন্ডারিং */}
        {lawyers.length === 0 ? (
          <div className="text-center py-20 bg-[#152238] rounded-2xl border border-slate-800">
            <p className="text-slate-400 font-medium">No lawyers found matching your selected criteria.</p>
            <Link href="/browse-lawyers" className="text-sky-400 text-sm underline mt-2 inline-block">Reset Filters</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {lawyers.map((lawyer) => (
                <Card 
                  key={lawyer.userId || lawyer.email} 
                  className="bg-[#152238] border border-slate-700/60 p-5 rounded-2xl shadow-xl flex flex-col justify-between text-left transition-all hover:border-sky-500/40 h-full"
                >
                  <div className="space-y-4">
                    <div className="w-full h-48 rounded-xl bg-[#0B1524] border border-slate-700 overflow-hidden relative">
                      <Image 
                        src={lawyer.image && lawyer.image !== "null" ? lawyer.image : "/default-avatar.png"} 
                        alt={lawyer.name || "Lawyer"} 
                        fill
                        priority 
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-cover" 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h2 className="text-lg font-bold text-white line-clamp-1">{lawyer.name}</h2>
                        <Chip 
                          color={lawyer.status === "Available" ? "success" : "danger"} 
                          variant="flat" 
                          size="sm" 
                          className="shrink-0"
                        >
                          {lawyer.status || "Available"}
                        </Chip>
                      </div>
                      <p className="text-sky-400 font-medium text-xs flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> {lawyer.specialization}
                      </p>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <span className="bg-[#0B1524] border border-slate-800 px-3 py-1.5 rounded-xl text-emerald-400 font-bold flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> ${lawyer.fee || lawyer.hourlyRate}/hr
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0B1524] p-3 rounded-xl border border-slate-800 line-clamp-3 min-h-[72px]">
                      {lawyer.bio || "No biography provided."}
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 mt-auto">
                    <Link href={`/browse-lawyers/${lawyer.email}`} className="w-full">
                      <Button 
                        size="sm" 
                        className="bg-sky-500 hover:bg-sky-600 text-slate-900 font-bold w-full" 
                        radius="xl" 
                        endContent={<ArrowUpRight className="w-4 h-4" />}
                      >
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 pt-8 border-t border-slate-800 mt-10">
              <Link
                href={{
                  pathname: "/browse-lawyers",
                  query: {
                    search: currentSearch,
                    specialization: currentSpecialization,
                    status: currentStatus,
                    maxFee: currentMaxFee,
                    page: Math.max(currentPage - 1, 1).toString(),
                  },
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              >
                <Button
                  disabled={currentPage <= 1}
                  size="sm"
                  className="font-bold bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                  radius="xl"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
              </Link>

              <span className="text-xs text-slate-400 font-medium">
                Page <strong className="text-white">{currentPage}</strong> of {totalPages}
              </span>

              <Link
                href={{
                  pathname: "/browse-lawyers",
                  query: {
                    search: currentSearch,
                    specialization: currentSpecialization,
                    status: currentStatus,
                    maxFee: currentMaxFee,
                    page: Math.min(currentPage + 1, totalPages).toString(),
                  },
                }}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              >
                <Button
                  disabled={currentPage >= totalPages}
                  size="sm"
                  className="font-bold bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                  radius="xl"
                  endContent={<ArrowRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </Link>

            </div>
          </>
        )}
      </div>
    </div>
  );
}