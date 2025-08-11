import { useState, useEffect } from "react";
import { FiBell, FiCheckCircle, FiInfo, FiXCircle } from "react-icons/fi";
import Loading from "../../components/Loading";
import api from "../../utils/api";
import { toast } from "react-toastify";

const iconMap = {
  success: <FiCheckCircle className="text-green-500" />,
  info: <FiInfo className="text-blue-500" />,
  error: <FiXCircle className="text-red-500" />,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/notifications");
      setNotifications(response);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     fetchNotifications();
  //   }, []);

  const markAllRead = async () => {
    try {
      setMarkingAll(true);
      await api.post("/api/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.post(`/api/notifications/${id}/mark-read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FiBell size={28} /> Notifications
        </h1>
        <button
          //   onClick={markAllRead}
          disabled={markingAll}
          className={`text-sm px-4 py-2 cursor-pointer rounded transition ${
            markingAll
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {markingAll ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          You have no notifications.
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map(({ id, type, title, timestamp, read }) => (
            <li
              key={id}
              className={`flex items-center gap-4 p-4 rounded-lg shadow-sm transition
              ${
                read
                  ? "bg-white"
                  : "bg-blue-50 border-l-4 border-blue-500 font-semibold"
              } hover:shadow-md cursor-pointer`}
              //   onClick={() => {
              //     if (!read) markRead(id);
              //   }}
              tabIndex={0}
              role="button"
              //   onKeyDown={(e) => {
              //     if (e.key === "Enter" || e.key === " ") {
              //       if (!read) markRead(id);
              //     }
              //   }}
            >
              <div className="text-2xl">{iconMap[type] || iconMap.info}</div>
              <div>
                <p>{title}</p>
                <p className="text-xs text-gray-400">{timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

// import { useState } from "react";
// import { FiBell, FiCheckCircle, FiInfo, FiXCircle } from "react-icons/fi";

// const notificationsMock = [
//   {
//     id: 1,
//     type: "success",
//     title: "Your lead has been assigned to Dubai agent.",
//     timestamp: "2 hours ago",
//     read: false,
//   },
//   {
//     id: 2,
//     type: "info",
//     title: "New update available for your CRM app.",
//     timestamp: "1 day ago",
//     read: true,
//   },
//   {
//     id: 3,
//     type: "error",
//     title: "Failed to sync your data. Please try again.",
//     timestamp: "3 days ago",
//     read: false,
//   },
// ];

// const iconMap = {
//   success: <FiCheckCircle className="text-green-500" />,
//   info: <FiInfo className="text-blue-500" />,
//   error: <FiXCircle className="text-red-500" />,
// };

// const Notifications = () => {
//   const [notifications, setNotifications] = useState(notificationsMock);

//   const markAllRead = () => {
//     setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
//   };

//   return (
//     <div className="p-6 mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold flex items-center gap-2">
//           <FiBell size={28} /> Notifications
//         </h1>
//         <button
//           onClick={markAllRead}
//           className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           Mark all as read
//         </button>
//       </div>

//       {notifications.length === 0 ? (
//         <div className="text-center text-gray-500 py-20">
//           You have no notifications.
//         </div>
//       ) : (
//         <ul className="space-y-4">
//           {notifications.map(({ id, type, title, timestamp, read }) => (
//             <li
//               key={id}
//               className={`flex items-center gap-4 p-4 rounded-lg shadow-sm transition
//               ${
//                 read
//                   ? "bg-white"
//                   : "bg-blue-50 border-l-4 border-blue-500 font-semibold"
//               } hover:shadow-md cursor-pointer`}
//               onClick={() => {
//                 setNotifications((prev) =>
//                   prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//                 );
//               }}
//               tabIndex={0}
//               role="button"
//             >
//               <div className="text-2xl">{iconMap[type]}</div>
//               <div>
//                 <p>{title}</p>
//                 <p className="text-xs text-gray-400">{timestamp}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notifications;
