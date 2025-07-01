"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar, MobileNavToggle } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Settings, Search } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === "loading" || !isMounted) return;

    console.log("Dashboard layout - session:", session);
    console.log("Dashboard layout - status:", status);

    if (!session) {
      console.log("No session, redirecting to signin");
      router.push("/auth/signin");
      return;
    }

    if (!session.user.role || (session.user.role !== "ADMIN" && session.user.role !== "VIEWER")) {
      console.log("Invalid role, redirecting to unauthorized. Role:", session.user.role);
      router.push("/unauthorized");
      return;
    }

    console.log("Access granted for role:", session.user.role);
  }, [session, status, router, isMounted]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (status === "loading" || !isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">กำลังโหลด...</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">กำลังตรวจสอบการเข้าสู่ระบบ</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <Sidebar
        isMobile
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <header className="lg:hidden bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 safe-top">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MobileNavToggle
                isOpen={isMobileSidebarOpen}
                onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Complaint Hub</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="tap-target">
                <Search className="w-5 h-5" />
              </Button>


              <Button variant="ghost" size="sm" className="tap-target">
                <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {session.user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </header>

        <header className="hidden lg:flex bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1"></div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 w-64"
                />
              </div>


              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {session.user.role?.toLowerCase()}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {session.user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 pb-24 lg:pb-0 safe-bottom">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-bottom z-30">
        <div className="grid grid-cols-4 py-2">
          <a
            href="/dashboard"
            className="flex flex-col items-center justify-center py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary tap-target"
          >
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <span>ภาพรวม</span>
          </a>

          <a
            href="/dashboard/complaints"
            className="relative flex flex-col items-center justify-center py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary tap-target"
          >
            <div className="w-6 h-6 mb-1 relative">
              <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
              </svg>
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center p-0 leading-none rounded-full">
                5
              </Badge>
            </div>
            <span>ร้องเรียน</span>
          </a>

          <a
            href="/dashboard/statistics"
            className="flex flex-col items-center justify-center py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary tap-target"
          >
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
              </svg>
            </div>
            <span>สถิติ</span>
          </a>

          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary tap-target"
          >
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </div>
            <span>เมนู</span>
          </button>
        </div>
      </nav>

      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50 lg:left-64">
        <div className="h-full bg-gradient-primary w-0 transition-all duration-300" id="loading-bar"></div>
      </div>
    </div>
  );
}
