'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // console.log("session",session)
  useEffect(() => {
    if (user) {
      router.refresh();
    }
  }, [user, router]);

  // সার্চ হ্যান্ডলার
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse-lawyers?search=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  // লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsDropdownOpen(false);
          setIsOpen(false);
          router.push('/');
          router.refresh(); 
        }
      }
    });
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          
          {/* ১. লোগো / সাইট নেম */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              Legal<span className="text-gray-800">Ease</span>
            </Link>
          </div>

          {/* ২. গ্লোবাল সার্চ বার (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search lawyers by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* ৩. নেভিগেশন লিংকস (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/browse-lawyers"
              className={`text-sm font-medium transition-colors ${
                isActive('/browse-lawyers') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Browse Lawyers
            </Link>

            {isPending ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-lg" />
            ) : (
              <>
                {/* ড্যাশবোর্ড ড্রপডাউন */}
                {user && (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`flex items-center text-sm font-medium transition-colors focus:outline-none gap-1 cursor-pointer capitalize ${
                        pathname.startsWith('/dashboard') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      Dashboard ({user.role || 'user'})
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50 border border-gray-100">
                        {user.role === 'user' && (
                          <>
                            <Link href="/dashboard/user" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                            <Link href="/dashboard/user/hiring-history" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hiring History</Link>
                            <Link href="/dashboard/user/comments" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Comments</Link>
                          </>
                        )}
                        {user.role === 'lawyer' && (
                          <>
                            <Link href="/dashboard/lawyer" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Lawyer Profile</Link>
                            <Link href="/dashboard/lawyer/hiring-history" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hiring Requests</Link>
                            <Link href="/dashboard/lawyer/manage-legal-profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Services</Link>
                          </>
                        )}
                        {user.role === 'admin' && (
                          <>
                            <Link href="/dashboard/admin" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Panel</Link>
                            <Link href="/dashboard/admin/manage-users" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Users</Link>
                            <Link href="/dashboard/admin/all-transactions" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Transactions</Link>
                            <Link href="/dashboard/admin/analytics" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Analytics</Link>
                          </>
                        )}
                        
                        {/* 🛠️ রিকোয়ারমেন্ট অনুযায়ী ডেক্সটপ ড্রপডাউন মেনুর নিচে লগআউট লিংক যুক্ত করা হলো */}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* লগইন / সাইনইন অ্যাকশন */}
                {!user && (
                  <Link
                    href="/auth/signin"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    SignIn
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Hamburger Icon */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none cursor-pointer"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* মোবাইল রেসপন্সিভ ড্রপডাউন মেনু */}
      {isOpen && (
        <div className="lg:hidden bg-gray-50 border-t border-gray-200 px-4 pt-2 pb-4 space-y-3 shadow-inner text-left">
          <form onSubmit={handleSearch} className="md:hidden pt-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search lawyers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block py-2 text-base font-medium ${isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
          >
            Home
          </Link>
          <Link
            href="/browse-lawyers"
            onClick={() => setIsOpen(false)}
            className={`block py-2 text-base font-medium ${isActive('/browse-lawyers') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
          >
            Browse Lawyers
          </Link>

          {/* মোবাইল রোল-বেসড ড্যাশবোর্ড এবং লগআউট লিংক */}
          {!isPending && user && (
            <div className="border-t border-gray-200 pt-2 space-y-1.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 capitalize">
                Dashboard ({user.role || 'user'})
              </p>
              {user.role === 'user' && (
                <>
                  <Link href="/dashboard/user" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">My Profile</Link>
                  <Link href="/dashboard/user/hiring-history" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">Hiring History</Link>
                  <Link href="/dashboard/user/comments" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">My Comments</Link>
                </>
              )}
              {user.role === 'lawyer' && (
                <>
                  <Link href="/dashboard/lawyer" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">Lawyer Profile</Link>
                  <Link href="/dashboard/lawyer/hiring-history" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">Hiring Requests</Link>
                  <Link href="/dashboard/lawyer/manage-legal-profile" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">Manage Services</Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link href="/dashboard/admin" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">Admin Panel</Link>
                  <Link href="/dashboard/admin/manage-users" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">Manage Users</Link>
                  <Link href="/dashboard/admin/all-transactions" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">Transactions</Link>
                  <Link href="/dashboard/admin/analytics" onClick={() => setIsOpen(false)} className="block py-1.5 text-sm text-gray-600 pl-2 hover:text-blue-600">Analytics</Link>
                </>
              )}
              
              {/* 🛠️ মোবাইল ভিউ ড্যাশবোর্ড লিংকের নিচে প্রপার লগআউট ট্রিগার */}
              <button
                onClick={handleLogout}
                className="w-full text-left block py-2 text-sm text-red-600 pl-2 font-medium border-t border-gray-100 mt-2 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}

          {/* মোবাইল সাইন-ইন বাটন */}
          {!isPending && !user && (
            <div className="pt-2">
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium text-sm"
              >
                SignIn
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}