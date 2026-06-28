import { Users, ShieldCheck, Briefcase, DollarSign, BarChart3 } from "lucide-react";
const NEXT_PUBLIC_BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;
async function getAnalyticsData() {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/admin/analytics`, { cache: "no-store" });
    if (!res.ok) return { totalUsers: 0, totalLawyers: 0, totalHires: 0, totalRevenue: 0 };
    return await res.json();
  } catch (err) {
    console.error(err);
    return { totalUsers: 0, totalLawyers: 0, totalHires: 0, totalRevenue: 0 };
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  const cardConfig = [
    { title: "Total Platform Users", value: data.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Lawyers", value: data.totalLawyers, icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Completed Hires", value: data.totalHires, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Total Revenue Generated", value: `$${data.totalRevenue}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-white text-left">
      <div className="flex items-center gap-2">
        <BarChart3 className="text-amber-500 w-6 h-6" />
        <h2 className="text-2xl font-bold">Platform Performance Analytics</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfig.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-[#152238] p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <p className="text-sm text-slate-400 font-medium">{card.title}</p>
                <p className="text-3xl font-extrabold tracking-tight">{card.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${card.bg}`}>
                <Icon className={`${card.color} w-6 h-6`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}