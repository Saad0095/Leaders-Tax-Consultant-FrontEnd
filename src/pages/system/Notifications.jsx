import { useState, useEffect } from "react";
import {
  FiBell,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
  FiAlertTriangle,
  FiTrash2,
  FiRefreshCw,
  FiEye,
  FiExternalLink,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { useNotifications } from "../../context/NotificationContext";
import { toast } from "react-toastify";

const iconMap = {
  success: <FiCheckCircle className="text-green-500" />,
  info: <FiInfo className="text-blue-500" />,
  error: <FiXCircle className="text-red-500" />,
  warning: <FiAlertTriangle className="text-yellow-500" />,
};

const typeColorMap = {
  lead_created: "info",
  lead_assigned: "success",
  lead_status_changed: "warning",
  follow_up_reminder: "warning",
  system_notification: "info",
};

const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [markingAll, setMarkingAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    await markAllAsRead();
    setMarkingAll(false);
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      await markAsRead(notification._id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (notification) => {
    const category =
      notification.category || typeColorMap[notification.type] || "info";
    return iconMap[category] || iconMap.info;
  };

  const getNotificationBadge = (notification) => {
    const priorityColors = {
      low: "bg-gray-100 text-gray-600",
      medium: "bg-blue-100 text-blue-600",
      high: "bg-orange-100 text-orange-600",
      urgent: "bg-red-100 text-red-600",
    };

    return priorityColors[notification.priority] || priorityColors.medium;
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FiBell size={28} /> Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
            >
              <FiCheckCircle />
              {markingAll ? "Marking..." : "Mark all read"}
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <FiBell size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p>You're all caught up! New notifications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`group relative p-4 rounded-lg border transition-all cursor-pointer ${
                notification.read
                  ? "bg-white border-gray-200 hover:border-gray-300"
                  : "bg-blue-50 border-blue-200 border-l-4 border-l-blue-500"
              } hover:shadow-md`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-2xl mt-1">
                  {getNotificationIcon(notification)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3
                        className={`text-sm font-medium ${
                          !notification.read ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>

                      {notification.data?.leadTitle && (
                        <p className="text-xs text-blue-600 mt-1">
                          Lead: {notification.data.leadTitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* <span
                        className={`text-xs px-2 py-1 rounded-full ${getNotificationBadge(
                          notification
                        )}`}
                      >
                        {notification.priority}
                      </span> */}

                      {notification.actionRequired && (
                        <FiExternalLink className="text-blue-500 w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">
                      {notification.timeAgo ||
                        new Date(notification.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
