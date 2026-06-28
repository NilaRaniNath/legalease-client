'use client';

import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function AdminCharts({ totalRevenue }) {
  // ১. লয়ার ক্যাটাগরি ডাটা (লয়ারদের স্পেশালাইজেশন ডিস্ট্রিবিউশন)
  const lawyerCategoryData = [
    { name: 'Criminal Law', count: 14 },
    { name: 'Family Law', count: 22 },
    { name: 'Corporate Law', count: 9 },
    { name: 'Civil Litigation', count: 18 },
    { name: 'Tax Law', count: 7 },
  ];

  // ২. রাউন্ড ডোনাট চার্টের জন্য ট্রানজেকশন ব্রেকডাউন ডাটা
  const transactionData = [
    { name: 'Profile Activation', value: 380, color: '#3B82F6' }, // Blue
    { name: 'Lawyer Hiring Fees', value: 1420, color: '#10B981' }, // Emerald
    { name: 'Disputes/Refunds', value: 120, color: '#EF4444' },   // Red
  ];

  // ৩. রেভিনিউ গ্রোথ এরিয়া চার্ট ডাটা
  const revenueTrendData = [
    { month: 'Jan', revenue: 500 },
    { month: 'Feb', revenue: 850 },
    { month: 'Mar', revenue: 1100 },
    { month: 'Apr', revenue: 950 },
    { month: 'May', revenue: 1600 },
    { month: 'Jun', revenue: Number(totalRevenue) || 2000 },
  ];

  // অ্যানিমেশন কনফিগারেশন
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* 📊 গ্রাফ এবং চার্ট গ্রিড সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ক) লয়ার ক্যাটাগরি চার্ট (Bar Chart) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Lawyers by Specialization</h3>
            <p className="text-xs text-gray-400">Real-time distribution of registered legal experts</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lawyerCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* খ) ট্রানজেকশন ব্রেকডাউন চার্ট (Round / Donut Pie Chart) */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Transaction Breakdown</h3>
            <p className="text-xs text-gray-400">Revenue streams segments</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {transactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Volume</p>
              <p className="text-xl font-bold text-gray-900">
                ${transactionData.reduce((acc, curr) => acc + curr.value, 0)}
              </p>
            </div>
          </div>

          {/* লেজেন্ড গাইডার */}
          <div className="space-y-2 mt-2">
            {transactionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">${item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* গ) রেভিনিউ গ্রোথ এরিয়া চার্ট (Full Width) */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Revenue Growth Over Time</h3>
          <p className="text-xs text-gray-400">Monthly breakdown of overall platform earnings</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}