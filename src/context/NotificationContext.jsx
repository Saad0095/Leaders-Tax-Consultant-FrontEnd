import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const lastNotifIdRef = useRef(null);
  const firstRunRef = useRef(true);
  const isPollingRef = useRef(false); // Prevent multiple simultaneous polls

  // Fetch notifications - wrapped in useCallback to prevent unnecessary re-renders
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log('No token found, skipping fetchNotifications');
      return null;
    }

    try {
      setLoading(true);
      const response = await api.get(`/api/notifications?page=${page}&limit=${limit}`);

      setNotifications(response.notifications || []);
      setUnreadCount(response.pagination?.unreadCount || 0);
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Only show toast if user is logged in
      if (token) {
        toast.error("Failed to load notifications");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any state

  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log('No token found, skipping fetchUnreadCount');
      return;
    }

    try {
      const response = await api.get("/api/notifications/unread-count");
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  // Lightweight refresh for dropdown - only updates existing notifications read status
  const refreshNotifications = useCallback(async () => {
    if (notifications.length === 0) return;

    try {
      const response = await api.get(`/api/notifications?page=1&limit=${notifications.length}`);
      setNotifications(response.notifications || []);
      setUnreadCount(response.pagination?.unreadCount || 0);
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    }
  }, [notifications.length]);

  // Force immediate notification check (for testing and after user actions)
  const forceNotificationCheck = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log('No token found, skipping forceNotificationCheck');
      return;
    }

    try {
      const response = await fetchNotifications(1, 20);
      if (response) {
        console.log('Forced notification check completed');
      }
    } catch (error) {
      console.error("Error in forced notification check:", error);
    }
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await api.post(`/api/notifications/${notificationId}/mark-read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true, readAt: new Date() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/api/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, readAt: new Date() })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
      return false;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setLoading(true);
      await api.delete(`/api/notifications/${notificationId}`);
      const deletedNotification = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success("Notification deleted");
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
    const audio = new Audio("/notification.mp3");
    audio.play().catch((err) => console.warn("Sound play blocked by browser:", err));
  };

  // Clear notifications when user logs out
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setLoading(false);
    console.log('Notifications cleared due to logout');
  }, []);

  // Immediate unread count fetch on mount (faster than full notification fetch)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log('No token found, skipping notification fetch');
      return;
    }

    // Quick unread count fetch for immediate UI feedback
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Initial fetch and polling for notifications
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log('No token found, skipping notification polling');
      return;
    }

    const poll = async () => {
      // Prevent multiple simultaneous polls
      if (isPollingRef.current) return;

      isPollingRef.current = true;
      try {
        const response = await fetchNotifications();
        if (!response) return;

        const latestList = response.notifications || [];

        // Skip sound on first run
        if (!firstRunRef.current && latestList.length > 0) {
          if (latestList[0]._id !== lastNotifIdRef.current) {
            const audio = new Audio("/notification.mp3");
            audio.play().catch((err) => console.warn("Sound play blocked:", err));
          }
        }

        if (latestList.length > 0) {
          lastNotifIdRef.current = latestList[0]._id;
        }

        firstRunRef.current = false;
      } finally {
        isPollingRef.current = false;
      }
    };

    // Run immediately on mount for instant notification count
    poll();

    // Then continue polling every 15 seconds for better responsiveness
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, []); // ✅ empty deps — no warning

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    refreshNotifications,
    forceNotificationCheck,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    clearNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
