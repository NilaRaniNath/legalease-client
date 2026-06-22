import DashBoardSidebar from "@/components/DashBoardSidebar";

export default function DashboardLayout({ children }) {
  return (
    // 💡 ফিক্সড: bg-background বদলে bg-slate-950 এবং টেক্সট সাদা (text-white) করা হয়েছে
    <div className="flex h-screen bg-blue-950 text-white selection:bg-blue-500/30">
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <DashBoardSidebar />

        <div className="flex-1 overflow-y-auto">
          {/* navbar */}
          {/* <div className="border border-b-1 p-3 w-full border-white/10 bg-slate-900/50">Navbar</div> */}
          
          <main className="p-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}