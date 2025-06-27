"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Home, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  MessageCircle,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/lib/stores/notification";

const navigation = [
  { 
    name: "ภาพรวม", 
    href: "/dashboard", 
    icon: Home,
    description: "สรุปข้อมูลทั้งหมด"
  },
  { 
    name: "เรื่องร้องเรียน", 
    href: "/dashboard/complaints", 
    icon: MessageSquare,
    description: "จัดการเรื่องร้องเรียน"
  },
  { 
    name: "สถิติ", 
    href: "/dashboard/statistics", 
    icon: BarChart3,
    description: "วิเคราะห์ข้อมูล"
  },
  { 
    name: "การตั้งค่า", 
    href: "/dashboard/settings", 
    icon: Settings,
    description: "จัดการระบบ"
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { unreadCount } = useNotificationStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Complaint Hub</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
          </div>
        </div>
        
        {/* Mobile close button */}
        <button
          onClick={closeMobileMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {session?.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session?.user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {session?.user?.role}
              </p>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              showUserMenu && "rotate-180"
            )} />
          </button>

          {/* User dropdown menu */}
          {showUserMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-fade-in-scale">
              <div className="py-2">
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
                  {isDarkMode ? 'โหมดสว่าง' : 'โหมดมืด'}
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-4">
          เมนูหลัก
        </div>
        
        {navigation.map((item, index) => {
          const isActive = pathname === item.href;
          const isSettings = item.href.includes("settings");
          
          // Hide settings for non-admin users
          if (isSettings && session?.user?.role !== "ADMIN") {
            return null;
          }

          return (
            <div key={item.name} className="animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 shadow-sm border-l-4 border-blue-500"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg mr-3 transition-colors",
                  isActive 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                </div>
                
                {item.href.includes("complaints") && unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center animate-pulse-subtle">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </div>
                )}
              </a>
            </div>
          );
        })}
      </nav>

      {/* Notifications Section */}
      {unreadCount > 0 && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
                  <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">การแจ้งเตือน</p>
                  <p className="text-xs text-orange-600 dark:text-orange-300">เรื่องใหม่ที่ต้องตรวจสอบ</p>
                </div>
              </div>
              <div className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[24px] text-center font-medium">
                {unreadCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 Complaint Hub
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            v2.0.0
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:w-80 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700",
        className
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar */}
          <div className="relative flex flex-col w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl animate-slide-in-left">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mobile-safe-area z-40">
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            const isSettings = item.href.includes("settings");
            
            if (isSettings && session?.user?.role !== "ADMIN") {
              return null;
            }

            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors touch-manipulation relative",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                )}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
                
                {item.href.includes("complaints") && unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}