import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNotificationStore } from "@/lib/stores/notification";
import { formatDate } from "@/lib/utils";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    setNotifications,
    addNotification,
    markAllAsRead,
    markAsRead,
    removeNotification,
  } = useNotificationStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadInitial = async () => {
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
          complaintId: n.complaintId,
          createdAt: new Date(n.createdAt),
        }));
        setNotifications(notifs);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    loadInitial();

    const es = new EventSource("/api/admin/notifications/stream");
    es.onmessage = (ev) => {
      if (!ev.data) return;
      try {
        const n = JSON.parse(ev.data);
        addNotification({
          title: n.title,
          message: n.message,
          type: n.type,
          complaintId: n.complaintId,
        });
        toast(n.title, { description: n.message });
      } catch (e) {
        console.error("Failed to parse SSE notification", e);
      }
    };
    return () => {
      es.close();
    };
  }, [setNotifications, addNotification]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleMarkAll = async () => {
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
  };

  const handleNotificationClick = async (n: typeof notifications[0]) => {
    if (n.complaintId) {
      router.push(`/dashboard/complaints?view=${n.complaintId}`);
      setOpen(false);
    }
    if (!n.read) {
      markAsRead(n.id);
      try {
        await fetch("/api/admin/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: n.id }),
        });
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={toggleOpen}
        aria-label="การแจ้งเตือน"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center p-0 animate-bounce-gentle">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 animate-fade-in-scale">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">ไม่มีการแจ้งเตือน</div>
          ) : (
            <>
              <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium">การแจ้งเตือน</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAll}
                      className="text-xs text-primary hover:underline"
                    >
                      อ่านทั้งหมด
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="ปิด"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`relative p-4 pr-10 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${n.read ? '' : 'bg-gray-50 dark:bg-gray-700'}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{n.title}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{n.message}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{formatDate(n.createdAt)}</p>
                    {n.complaintId && (
                      <span className="text-primary text-xs underline mt-1 inline-block">ดูรายละเอียด</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                      className="absolute top-1 right-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      aria-label="ลบ"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
