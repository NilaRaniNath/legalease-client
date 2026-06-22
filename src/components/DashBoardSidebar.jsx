import { auth } from "@/lib/auth";
import { Button, Drawer } from "@heroui/react";
import { 
  Briefcase, 
  User, 
  MessageSquare, 
  CreditCard, 
  Users, 
  BarChart3, 
  Menu
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardSidebar() {
  const headerList = await headers();
  // সার্ভার কম্পোনেন্টে একটিভ রুট ট্র্যাক করার জন্য প্যাথনেম নেওয়া হলো
  const activePath = headerList.get("x-current-path") || ""; 

  const session = await auth.api.getSession({
    headers: headerList,
  });

  const user = session?.user;
  const role = user?.role || "user";

  // আপনার প্রজেক্ট অনুযায়ী আইকন ও লেবেল আপডেট
  const dashboardItems = {
    lawyer: [
      { icon: Briefcase, label: "Hiring History", link: "/dashboard/lawyer/hiring-history" },
      { icon: Briefcase, label: "Manage Profile", link: "/dashboard/lawyer/manage-legal-profile" },
      { icon: CreditCard, label: "Transaction", link: "/dashboard/lawyer/transaction" },
    ],

    user: [
      { icon: Briefcase, label: "Hiring History", link: "/dashboard/user/hiring-history" },
      { icon: User, label: "My Profile", link: "/dashboard/user/update-profile" },
      { icon: MessageSquare, label: "Comments", link: "/dashboard/user/comments" },
      { icon: CreditCard, label: "Transaction", link: "/dashboard/user/transaction" },
    ],

    admin: [
      { icon: Users, label: "Manage Users", link: "/dashboard/admin/manage-users" },
      { icon: BarChart3, label: "Analytics", link: "/dashboard/admin/analytics" },
      { icon: CreditCard, label: "Transaction", link: "/dashboard/admin/transaction" },
    ],
  };

  const navItems = dashboardItems[role] || [];

  // একটিভ লিংক চেক করার হেল্পার ফাংশন
  const isLinkActive = (link) => activePath === link;

  return (
    <Drawer>
      {/* মোবাইল রেসপন্সিভ ট্রিগার বাটন */}
      <Button 
        className="lg:hidden fixed bottom-5 right-5 z-50 shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer" 
        variant="solid"
      >
        <Menu className="w-5 h-5" />
        Menu
      </Button>

      {/* ডেস্কটপ সাইডবার (ডিজাইন আপডেট করা হয়েছে) */}
      <nav className="hidden lg:flex flex-col gap-2 w-[260px] min-h-[calc(100vh-4rem)] bg-slate-950/40 border-r border-white/10 p-4 backdrop-blur-xl">
        <div className="px-3 py-2 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {role} Dashboard
          </p>
        </div>

        {navItems.map((item) => {
          const active = isLinkActive(item.link);
          return (
            <Link key={item.label} href={item.link} className="w-full">
              <button
                className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group cursor-pointer ${
                  active 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/10' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
                type="button"
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-400'}`} />
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* মোবাইল ভিউ রেন্ডারিং (Drawer Content) */}
      <Drawer.Backdrop>
        <Drawer.Content placement="left" className="bg-slate-950/95 border-r border-white/10 text-white backdrop-blur-2xl">
          <Drawer.Dialog>
            <Drawer.CloseTrigger className="text-gray-400 hover:text-white" />
            <Drawer.Header className="border-b border-white/5 pb-4">
              <Drawer.Heading className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 capitalize">
                LegalEase Navigation
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="py-4">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const active = isLinkActive(item.link);
                  return (
                    <Link key={item.label} href={item.link} className="w-full">
                      <button
                        className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                          active 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                        type="button"
                      >
                        <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} />
                        {item.label}
                      </button>
                    </Link>
                  );
                })}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}