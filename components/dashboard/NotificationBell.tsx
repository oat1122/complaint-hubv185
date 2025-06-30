import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/lib/stores/notification";
import { formatDate } from "@/lib/utils";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    setNotifications,
    markAllAsRead,
  } = useNotificationStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notifications?limit=20", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        const notifs = data.notifications.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || "info",
          read: n.read,
          createdAt: new Date(n.createdAt),
        }));
        setNotifications(notifs);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [setNotifications]);

  const toggleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      markAllAsRead();
      try {
        await fetch("/api/admin/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markAllAsRead: true }),
        });
      } catch (err) {
        console.error("Failed to mark notifications as read", err);
      }
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="relative" onClick={toggleOpen}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center p-0">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">ไม่มีการแจ้งเตือน</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((n) => (
                <li key={n.id} className="p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">{n.title}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{n.message}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{formatDate(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
