"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  MessageSquare,
  BarChart3,
  Settings,
  MessageCircle,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight,
  Activity,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/ui/auth-buttons";
import { useNotificationStore } from "@/lib/stores/notification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "ภาพรวม",
    href: "/dashboard",
    icon: Home,
    description: "สรุปข้อมูลและสถิติ"
  },
  {
    name: "เรื่องร้องเรียน",
    href: "/dashboard/complaints",
    icon: MessageSquare,
    description: "จัดการเรื่องร้องเรียนทั้งหมด"
  },
  {
    name: "สถิติ",
    href: "/dashboard/statistics",
    icon: BarChart3,
    description: "กราฟและการวิเคราะห์"
  },
  {
    name: "การตั้งค่า",
    href: "/dashboard/settings",
    icon: Settings,
    description: "จัดการระบบและผู้ใช้"
  }
];

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { unreadCount } = useNotificationStore();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in-scale"
            onClick={onClose}
          />
        )}

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden safe-top safe-bottom",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <MobileSidebarContent
            session={session}
            pathname={pathname}
            unreadCount={unreadCount}
            onSignOut={handleSignOut}
            onNavClick={handleNavClick}
            onClose={onClose}
          />
        </div>
      </>
    );
  }

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-800">
      <DesktopSidebarContent
        session={session}
        pathname={pathname}
        unreadCount={unreadCount}
        onSignOut={handleSignOut}
      />
    </div>
  );
}

function MobileSidebarContent({
  session,
  pathname,
  unreadCount,
  onSignOut,
  onNavClick,
  onClose
}: {
  session: any;
  pathname: string;
  unreadCount: number;
  onSignOut: () => void;
  onNavClick: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white border border-primary rounded-xl shadow-soft">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Complaint Hub</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">ระบบจัดการ</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="tap-target"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
            <span className="text-white font-bold text-lg">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {session?.user?.email}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs capitalize">
                {session?.user?.role?.toLowerCase()}
              </Badge>
              {session?.user?.role === "ADMIN" && (
                <Shield className="w-3 h-3 text-primary" />
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isSettings = item.href.includes("settings");

            if (isSettings && session?.user?.role !== "ADMIN") {
              return null;
            }

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  "group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 tap-target",
                  isActive
                    ? "bg-primary/10 text-primary shadow-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item.name}</div>
                    <div
                      className={cn(
                        "text-xs truncate mt-0.5",
                        isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.href.includes("complaints") && unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isActive ? "text-white" : "text-gray-400"
                    )}
                  />
                </div>
              </a>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Activity className="w-4 h-4" />
            <span>สถานะระบบ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 dark:text-green-400 text-xs font-medium">ปกติ</span>
          </div>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">การแจ้งเตือน</span>
            </div>
            <Badge className="bg-orange-500 text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={onSignOut}
          variant="outline"
          className="w-full tap-target justify-start"
        >
          <LogOut className="w-4 h-4 mr-3" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );
}

function DesktopSidebarContent({
  session,
  pathname,
  unreadCount,
  onSignOut
}: {
  session: any;
  pathname: string;
  unreadCount: number;
  onSignOut: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-6 py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white border border-primary rounded-xl shadow-soft">
            <MessageCircle className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Complaint Hub</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">ระบบจัดการเรื่องร้องเรียน</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
            <span className="text-white font-bold">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {session?.user?.email}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs capitalize">
                {session?.user?.role?.toLowerCase()}
              </Badge>
              {session?.user?.role === "ADMIN" && (
                <Shield className="w-3 h-3 text-primary" />
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
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
                "group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover-lift",
                isActive
                  ? "bg-primary/10 text-primary shadow-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.href.includes("complaints") && unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </a>
          );
        })}
      </nav>

      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Activity className="w-4 h-4" />
            <span>สถานะระบบ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 dark:text-green-400 text-xs font-medium">ปกติ</span>
          </div>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">การแจ้งเตือน</span>
            </div>
            <Badge className="bg-orange-500 text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <LogoutButton onClick={onSignOut} className="mx-auto" />
      </div>
    </div>
  );
}

export function MobileNavToggle({
  isOpen,
  onToggle
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="lg:hidden tap-target"
      aria-label="เปิด/ปิดเมนู"
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </Button>
  );
}
