import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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

  // Fetch notifications
  const fetchNotifications = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/notifications?page=${page}&limit=${limit}`);
      setNotifications(response.notifications || []);
      setUnreadCount(response.pagination?.unreadCount || 0);
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/api/notifications/unread-count");
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

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

  // Poll for new notifications every 30s
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const poll = async () => {
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
    };

    // Run immediately
    poll();

    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, []); // ✅ empty deps — no warning

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
