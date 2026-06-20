'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import {  ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

   
    await signIn.email(
      {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/',
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          router.push('/');
        },
        onError: (ctx) => {
          setLoading(false);
          setError(
            ctx.error?.message || 'Invalid credentials. Please try again.'
          );
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl shadow-black/50"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* ব্র্যান্ড লোগো ও হেডিং */}
        <div className="text-center space-y-2 mb-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-white inline-block">
            Legal<span className="text-blue-400">Ease</span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to access your role-specific legal panel.</p>
        </div>

        {/* ডাইনামিক অ্যানিমেটেড এরর অ্যালার্ট */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-start gap-3 text-red-400 mb-6 overflow-hidden"
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs font-medium leading-relaxed">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* সাইন ইন ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ইমেইল ফিল্ড */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium">Email Address</label>
            <div className="relative flex items-center">
              
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 p-2 text-base text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* পাসওয়ার্ড ফিল্ড */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-400 font-medium">Password</label>
              <a href="#" className="text-[11px] text-blue-400 hover:underline">Forgot?</a>
            </div>
            <div className="relative flex items-center">
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 p-2  text-base text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg shadow-blue-600/10 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} mt-2`}
          >
            {loading ? 'Verifying Account...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>

        {/* সাইন আপ পেজের লিংক */}
        <div className="text-center mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-gray-400">
            New to LegalEase?{' '}
            <Link 
              href="/auth/signup" 
              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors inline-flex items-center gap-1 group"
            >
              Create an account
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}