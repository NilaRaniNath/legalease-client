import AdminCharts from '@/components/AdminCharts';
import { Users, Scale, DollarSign, Wallet, TrendingUp } from 'lucide-react';


const NEXT_PUBLIC_BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;
async function getAnalyticsData() {
  try {
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/admin/analytics`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (error) {
    console.error('Error loading analytics:', error);
    return null;
  }
}

export default async function AdminDashboard() {
 
  const analytics = await getAnalyticsData();

  const totalUsers = analytics?.totalUsers || 0;
  const totalLawyers = analytics?.totalLawyers || 0;
  const totalHires = analytics?.totalHires || 0;
  const totalRevenue = analytics?.totalRevenue || 0;

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen text-gray-800">
      {/* হেডার পার্ট */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Efficient platform tracking driven by Next.js Server Components.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-medium text-gray-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Server Feed
        </div>
      </div>

      {/* 💳 স্ট্যাটাস ইনফো কার্ডস (৪টি গ্লসি গ্রিড) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Active Lawyers', value: totalLawyers, icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'Total Hires (Paid)', value: totalHires, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Total Revenue', value: `$${totalRevenue}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* 📊 ইন্টারেক্টিভ চার্ট সেকশন (এখানে ক্লায়েন্ট স্লাইস কম্পোনেন্টটি লোড হচ্ছে) */}
      <AdminCharts totalRevenue={totalRevenue} />
    </div>
  );
}