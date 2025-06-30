import { create } from 'zustand';

interface NotificationState {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: Date;
  }>;
  unreadCount: number;
  setNotifications: (notifications: NotificationState['notifications']) => void;
  addNotification: (notification: Omit<NotificationState['notifications'][0], 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set(() => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    })),
  
  addNotification: (notification) => {
    const newNotification = {
      id: Math.random().toString(36).substring(7),
      ...notification,
      read: false,
      createdAt: new Date(),
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
  
  markAsRead: (id) => {
    const notification = get().notifications.find(n => n.id === id);
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
      unreadCount: notification && !notification.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    }));
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
      unreadCount: 0,
    }));
  },
  
  removeNotification: (id) => {
    const notification = get().notifications.find(n => n.id === id);
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
      unreadCount: notification && !notification.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    }));
  },
}));
