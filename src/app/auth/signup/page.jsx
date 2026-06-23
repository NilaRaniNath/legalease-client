'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Gavel, Mail, Lock, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; 

export default function SignUp() {
  const router = useRouter();
  const [role, setRole] = useState('user'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    // 💡 ডাইনামিক ড্যাশবোর্ড ইউআরএল জেনারেট করা হলো
    const targetDashboard = role === 'lawyer' ? '/dashboard/lawyer' : '/dashboard';

    await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.fullName,
      role: role, // BetterAuth মেটাডাটা বা কাস্টম প্লাগইনে রোল পাস হচ্ছে
      callbackUrl: targetDashboard, // ওঅথ বা সেশন রিডাইরেক্টের জন্য সেফটি নেট
    }, {
      onRequest: () => setLoading(true),
      onSuccess: () => {
        setLoading(false);
        // 🎯 রোল অনুযায়ী নির্দিষ্ট ড্যাশবোর্ড পেজে রিডিরেক্ট
        router.push(targetDashboard);
      },
      onError: (ctx) => {
        setLoading(false);
        setError(ctx.error.message || 'Something went wrong during sign up.');
      }
    });
  };

  const handleGoogleLogin = async () => {
    setError('');
    // 💡 গুগলের মাধ্যমে সাইন আপের সময়ও রোল অনুযায়ী ড্যাশবোর্ডে পাঠাবে
    const targetDashboard = role === 'lawyer' ? '/dashboard/lawyer' : '/dashboard';
    
    await authClient.signIn.social({
      provider: 'google',
      callbackUrl: targetDashboard, 
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড গ্লো ডেকোরেশন */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[140px]" />
      </div>

      <motion.div 
        className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 shadow-2xl shadow-black/40 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        
        {/* বাম পাশ: ইনফো প্যানেল */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600/20 to-indigo-600/10 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 text-center lg:text-left">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white">
              Legal<span className="text-blue-400">Ease</span>
            </Link>
            <h2 className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Join Our Legal Revolution
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Create an account to browse expert lawyers or manage your legal services within our role-based digital marketplace.
            </p>
          </div>

          <div className="hidden lg:block border-t border-white/5 pt-6 space-y-3">
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Secure Encryption (Database Session)
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Automated Role Mapping
            </div>
          </div>
        </div>

        {/* ডান পাশ: ফর্ম সেকশন */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">Get Started</h3>
            <p className="text-sm text-gray-400 mt-1.5">Already have an account? <Link href="/auth/signin" className="text-blue-400 hover:underline">SignIn</Link></p>
          </div>

          {/* অ্যানিমেটেড এরর অ্যালার্ট বক্স */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-start gap-3 text-red-400 overflow-hidden"
              >
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs font-medium leading-relaxed">{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ১. রোল সিলেক্টর */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Your Platform Role</label>
              <div className="grid grid-cols-2 gap-4">
                
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`relative py-3.5 px-4 rounded-xl border flex items-center justify-center gap-3 text-sm font-bold transition-all cursor-pointer ${
                    role === 'user' 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <User className="w-4 h-4" /> Client (User)
                </button>

                <button
                  type="button"
                  onClick={() => setRole('lawyer')}
                  className={`relative py-3.5 px-4 rounded-xl border flex items-center justify-center gap-3 text-sm font-bold transition-all cursor-pointer ${
                    role === 'lawyer' 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Gavel className="w-4 h-4" /> Professional Lawyer
                </button>
              </div>
            </div>

            {/* ২. ইনপুট ফিল্ডস */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-semibold uppercase tracking-wide">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter Your Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-base text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-semibold uppercase tracking-wide">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-base text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-semibold uppercase tracking-wide">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-base text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-semibold uppercase tracking-wide">Confirm Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-base text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg shadow-blue-600/20 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? 'Registering Account...' : `Create Account As ${role === 'user' ? 'Client' : 'Lawyer'}`}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </motion.button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-slate-900/80 backdrop-blur-sm px-4 text-xs text-gray-500 uppercase tracking-wider absolute">Or</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-3 text-base transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.436 1.187 15.62 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.77 0-.79-.085-1.39-.187-1.945H12.24z"/>
            </svg>
            Sign up with Google
          </button>

        </div>
      </motion.div>
    </div>
  );
}