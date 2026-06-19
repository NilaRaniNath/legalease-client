'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Scale, Award, ArrowRight } from 'lucide-react';

export default function Banner() {
  // Framer Motion এর অ্যানিমেশন ভ্যারিয়েন্ট
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-36">
      
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন (মডার্ন জ্যামিতিক শেপ) - হুবহু আগের মতো */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ১. টেক্সট সেকশন: এখন সম্পূর্ণ সেন্টারে (Middle Aligned) */}
        <motion.div 
          className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 mb-20 lg:mb-24"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* ছোট ব্যাজ */}
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-sm font-medium">
            <Shield className="w-4 h-4" /> Trusted Online Legal Marketplace
          </motion.div>

          {/* মেইন হেডিং */}
          <motion.h1 
            variants={fadeIn}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Find & Hire Expert <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Legal Counsel
            </span> Easily.
          </motion.h1>

          {/* সাব-টেক্সট */}
          <motion.p 
            variants={fadeIn}
            className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed"
          >
            Connecting individuals and businesses with top-tier, verified legal experts. Get consultations, secure hiring, and premium legal protection all in one place.
          </motion.p>

          {/* CTA বাটন */}
          <motion.div variants={fadeIn} className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/browse-lawyers" 
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse Lawyers
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center bg-gray-800/80 hover:bg-gray-800 text-gray-200 border border-gray-700 font-semibold px-6 py-3.5 rounded-xl transition-all"
            >
              How It Works
            </Link>
          </motion.div>
        </motion.div>

        {/* ২. কার্ড সেকশন: একই ডিজাইনের ৪টি কার্ড এখন একদম নিচের দিকে সুন্দর লাইনে সাজানো */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          {/* কার্ড ১: Expert Lawyers */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-blue-500/40 transition-colors group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Expert Lawyers</h3>
              <p className="text-sm text-gray-400">Top vetted legal professionals across various domains.</p>
            </div>
          </div>

          {/* কার্ড ২: Secure Payments */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-blue-500/40 transition-colors group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Secure Escrow</h3>
              <p className="text-sm text-gray-400">Your payments are fully protected with Stripe integration.</p>
            </div>
          </div>

          {/* কার্ড ৩: Top Success Rate */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-blue-500/40 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">98% Success</h3>
              <p className="text-sm text-gray-400">Proven track record of high case resolution rates.</p>
            </div>
          </div>

          {/* কার্ড ৪: Quick Consultation */}
          <div className="p-6 bg-blue-600 rounded-2xl flex flex-col justify-between shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Need Help Now?</h3>
              <p className="text-sm text-blue-100">Instantly search and connect with local available experts.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}