import { Card, Avatar, Chip, Button } from "@heroui/react";
import { DollarSign, Briefcase, User, Calendar, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getLawyerDetails(id) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/lawyer/details/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    return null;
  }
}

export default async function LawyerDetails({ params }) {
  const lawyer = await getLawyerDetails(params.id);

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-[#0B1524] flex flex-col items-center justify-center text-slate-300 gap-2">
        <p>Lawyer profile not completed or not found.</p>
        <Link href="/lawyers"><Button size="sm" className="bg-sky-500 text-slate-900 font-bold">Back</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1524] text-slate-100 p-6 md:p-12 flex justify-center">
      <div className="max-w-3xl w-full space-y-4">
        <Link href="/lawyers" className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3 h-3" /> Back to Directory
        </Link>

        <Card className="bg-[#152238] border border-slate-700 p-6 flex flex-col md:flex-row gap-6 text-left items-center md:items-start">
          <Avatar src={lawyer.image || null} className="w-28 h-28 md:w-36 md:h-36 rounded-xl bg-[#0B1524] shrink-0" fallback={<User />} />
          
          <div className="flex-1 space-y-4 w-full">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-1.5">{lawyer.name} <ShieldCheck className="w-5 h-5 text-sky-400" /></h1>
                <p className="text-sky-400 font-medium text-xs md:text-sm flex items-center gap-1 mt-1"><Briefcase className="w-3.5 h-3.5" /> {lawyer.specialization}</p>
              </div>
              <Chip color={lawyer.status === "Available" ? "success" : "danger"} variant="flat" size="sm">
                {lawyer.status || "Available"}
              </Chip>
            </div>

            <div className="flex gap-2 text-xs">
              <span className="bg-[#0B1524] border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1 text-emerald-400 font-bold"><DollarSign className="w-3.5 h-3.5" /> ${lawyer.fee}/hr</span>
              <span className="bg-[#0B1524] border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1 text-purple-400 font-medium">
                <Calendar className="w-3.5 h-3.5" /> Joined: {lawyer.createdAt ? new Date(lawyer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Recent"}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Bio / Professional Summary</h4>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{lawyer.bio}</p>
            </div>

            <Button className="w-full sm:w-auto font-bold bg-sky-500 hover:bg-sky-600 text-slate-900" radius="xl">
              Hire Lawyer Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}