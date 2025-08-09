import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUserCheck,
  FiBriefcase,
  FiUsers,
} from "react-icons/fi";
import Loading from "../../components/Loading";

const AgentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/api/leads/dashboard/stats");
        console.log(res);
        setData(res);
      } catch {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!data) return null;

  const { totalLeads, statusBreakdown = {} } = data;

  const statuses = [
    {
      key: "meetingFixed",
      label: "Meeting Fixed",
      color: "blue",
      icon: <FiCalendar />,
    },
    {
      key: "meetingDone",
      label: "Meeting Done",
      color: "green",
      icon: <FiCheckCircle />,
    },
    {
      key: "inFollowUp",
      label: "In Follow Up",
      color: "yellow",
      icon: <FiClock />,
    },
    {
      key: "notInterested",
      label: "Not Interested",
      color: "red",
      icon: <FiXCircle />,
    },
    {
      key: "notResponding",
      label: "Not Responding",
      color: "gray",
      icon: <FiUserCheck />,
    },
    {
      key: "dealDone",
      label: "Deal Done",
      color: "emerald",
      icon: <FiCheckCircle />,
    },
    { key: "closed", label: "Closed", color: "purple", icon: <FiBriefcase /> },
  ];

  // Fixed Tailwind color classes per status to avoid purge issues
  const statusStyles = {
    meetingFixed: "border-blue-500 bg-blue-50 text-blue-600",
    meetingDone: "border-green-500 bg-green-50 text-green-600",
    inFollowUp: "border-yellow-500 bg-yellow-50 text-yellow-600",
    notInterested: "border-red-500 bg-red-50 text-red-600",
    notResponding: "border-gray-500 bg-gray-50 text-gray-600",
    dealDone: "border-green-600 bg-green-100 text-green-700",
    closed: "border-purple-500 bg-purple-50 text-purple-600",
  };

  return (
    <main className="p-6 mx-auto font-sans space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        📋 Agent Dashboard
      </h1>

      {/* Total Leads Summary */}
      <section
        aria-label="Total leads"
        className="bg-indigo-600 text-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
      >
        <FiUsers className="text-4xl" />
        <div>
          <p className="text-sm opacity-80">Total Leads</p>
          <p className="text-3xl font-extrabold">{totalLeads}</p>
        </div>
      </section>

      {/* Status Breakdown */}
      <section aria-label="Status breakdown">
        <h2 className="text-xl font-semibold mb-4">Status Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statuses.map(({ key, label, icon }) => (
            <div
              key={key}
              className={`flex items-center space-x-3 border-l-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${statusStyles[key]}`}
              role="region"
              aria-labelledby={`${key}-label`}
            >
              <div className="text-2xl">{icon}</div>
              <div>
                <p id={`${key}-label`} className="text-sm font-medium">
                  {label}
                </p>
                <p className="text-lg font-bold">{statusBreakdown[key] ?? 0}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AgentDashboard;
