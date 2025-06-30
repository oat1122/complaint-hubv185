"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { 
  Home, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  MessageCircle,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/lib/stores/notification";

const navigation = [
  { name: "ภาพรวม", href: "/dashboard", icon: Home },
  { name: "เรื่องร้องเรียน", href: "/dashboard/complaints", icon: MessageSquare },
  { name: "สถิติ", href: "/dashboard/statistics", icon: BarChart3 },
  { name: "การตั้งค่า", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { unreadCount } = useNotificationStore();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b">
        <MessageCircle className="w-8 h-8 text-primary mr-2" />
        <h1 className="text-xl font-bold text-gray-900">Complaint Hub</h1>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {session?.user?.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {session?.user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const isSettings = item.href.includes("settings");
          
          // Hide settings for non-admin users
          if (isSettings && session?.user?.role !== "ADMIN") {
            return null;
          }

          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
              {item.href.includes("complaints") && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Notifications */}
      {unreadCount > 0 && (
        <div className="px-4 py-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Bell className="w-4 h-4 mr-2" />
              การแจ้งเตือน
            </div>
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          </div>
        </div>
      )}

      {/* Sign Out */}
      <div className="p-4 border-t">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );
}
