import { useState, useRef, useEffect } from "react";
import { FiBell, FiX, FiEye, FiExternalLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { notifications, unreadCount, markAsRead, fetchNotifications } =
    useNotifications();

  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded?.role);
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1, 5);
    }
  }, [isOpen, fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      await markAsRead(notification._id);
    }

    setIsOpen(false);

    // Navigate to a0ction URL if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (notification) => {
    const iconMap = {
      lead_created: "📋",
      lead_assigned: "👤",
      lead_status_changed: "🔄",
      follow_up_reminder: "⏰",
      system_notification: "ℹ️",
    };

    return iconMap[notification.type] || "ℹ️";
  };

  const truncateMessage = (message, maxLength = 60) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <FiBell size={32} className="mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="py-2">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors ${
                      notification.read
                        ? "border-l-transparent"
                        : "border-l-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification)}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            notification.read
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {truncateMessage(notification.message)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {notification.timeAgo ||
                              new Date(
                                notification.createdAt
                              ).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                            {notification.actionRequired && (
                              <FiExternalLink className="text-blue-500 w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/${role}/notifications`);
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
