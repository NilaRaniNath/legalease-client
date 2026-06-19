'use client';

import { motion } from 'framer-motion';
import { Users, Gavel, ShieldAlert, CheckCircle, Target, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  // স্ক্রল অ্যানিমেশন ভ্যারিয়েন্ট
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white overflow-hidden py-20 lg:py-28">
      
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন (ব্যানারের মতো হুবহু গ্লোয়িং জ্যামিতিক শেপ) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ১. সেকশন হেডার */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider"
          >
            Who We Are
          </motion.span>
          
          {/* ব্যানারের মতো উজ্জ্বল আই-ক্যাচিং গ্রেডিয়েন্ট টাইটেল */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-black mt-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 pb-2"
          >
            Democratizing Access to Premium Legal Aid
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 mt-4 leading-relaxed text-base sm:text-lg"
          >
            LegalEase is a next-generation digital ecosystem designed to replace legacy consulting hurdles. We bridge the gap between clients, legal specialists, and transparent platform administration.
          </motion.p>
        </div>

        {/* ২. আওয়ার ভিশন ও মিশন (ডার্ক গ্লাস-মরফিজম ২-কলাম লেআউট) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 lg:mb-28">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex gap-5 items-start group hover:border-blue-500/40 transition-colors"
          >
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                To simplify legal hiring by offering secure secure payments via Stripe, role-specific actionable workflows, and interactive peer-driven validation systems.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex gap-5 items-start group hover:border-blue-500/40 transition-colors"
          >
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Building a global trustworthy ecosystem where emerging and corporate legal experts find fair validation, and clients experience secure decentralized consultancy.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ৩. থ্রি-রোল ইকোসিস্টেম (User, Lawyer, Admin রোল হাইলাইট) */}
        <div className="mb-12 text-center">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            How Our Role-Based Ecosystem Empowers You
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">Designed purposefully for comprehensive control and fluid experience.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* রোল ১: Clients / Users */}
          <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between group overflow-hidden backdrop-blur-md hover:border-blue-500/40 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">For Legal Seekers</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                Browse professional portfolios with advanced custom sorting, instantly book consultations via secure Stripe checkout, and transparently rate lawyer performance based on genuine case history.
              </p>
            </div>
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="flex items-center gap-2 text-xs font-medium text-gray-300"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Secure Escrow Checkout</span>
              <span className="flex items-center gap-2 text-xs font-medium text-gray-300"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Hiring History Tracking</span>
            </div>
          </motion.div>

          {/* রোল ২: Lawyers */}
          <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between group overflow-hidden backdrop-blur-md hover:border-indigo-500/40 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                <Gavel className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">For Legal Experts</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                Gain verified authority, showcase deep specialties with automated imgBB uploads, self-manage active availability status badges, and effortlessly control service listings via custom CRUD panels.
              </p>
            </div>
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="flex items-center gap-2 text-xs font-medium text-gray-300"><CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> One-time Publishing Pass</span>
              <span className="flex items-center gap-2 text-xs font-medium text-gray-300"><CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Inbound Request Controls</span>
            </div>
          </motion.div>

          {/* রোল ৩: Admins */}
          <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between group overflow-hidden backdrop-blur-md hover:border-purple-500/40 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">For Administration</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                Oversee entire application operations with dedicated analytics dashboards. Update user authorization metrics, inspect cross-network transaction IDs, and preserve integrity by unpublishing invalid nodes.
              </p>
            </div>
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="flex items-center gap-2 text-xs font-medium text-gray-300"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Direct Role Management</span>
              <span className="flex items-center gap-2 text-xs font-medium text-gray-300"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> Live Revenue Metrics</span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}