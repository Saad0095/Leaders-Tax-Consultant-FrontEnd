import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUserCheck,
  FiBriefcase,
  FiMapPin,
  FiFlag,
} from "react-icons/fi";
import Loading from "../../components/Loading";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/api/leads/dashboard/stats");
        setData(res);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <Loading />;

  if (error)
    return (
      <p className="p-6 text-center text-red-600 font-semibold">{error}</p>
    );

  if (!data) return null;

  const {
    totalLeads,
    statusBreakdown = {},
    totalKarachiAgents,
    totalDubaiAgents,
    unassignedLeads,
  } = data;

  const statuses = [
    { key: "meetingFixed", label: "Meeting Fixed", icon: <FiCalendar /> },
    { key: "meetingDone", label: "Meeting Done", icon: <FiCheckCircle /> },
    { key: "inFollowUp", label: "In Follow Up", icon: <FiClock /> },
    { key: "notInterested", label: "Not Interested", icon: <FiXCircle /> },
    { key: "notResponding", label: "Not Responding", icon: <FiUserCheck /> },
    { key: "dealDone", label: "Deal Done", icon: <FiCheckCircle /> },
    { key: "closed", label: "Closed", icon: <FiBriefcase /> },
  ];

  // Explicit color classes per status key (for border and bg)
  const statusStyles = {
    meetingFixed: "border-blue-500 bg-blue-50 text-blue-600",
    meetingDone: "border-green-500 bg-green-50 text-green-600",
    inFollowUp: "border-yellow-500 bg-yellow-50 text-yellow-600",
    notInterested: "border-red-500 bg-red-50 text-red-600",
    notResponding: "border-gray-500 bg-gray-50 text-gray-600",
    dealDone: "border-green-600 bg-green-100 text-green-700", // emerald replaced with green variants
    closed: "border-purple-500 bg-purple-50 text-purple-600",
  };

  const SummaryCard = ({ icon, label, value, gradient }) => (
    <div
      className="flex flex-col justify-center items-center text-white rounded-xl shadow-lg p-5 w-full sm:w-48 hover:scale-105 transition-transform"
      style={{ background: gradient }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm opacity-80">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>

      {/* Summary */}
      <div className="flex flex-wrap gap-6">
        <SummaryCard
          icon={<FiUsers />}
          label="Total Leads"
          value={totalLeads}
          gradient="linear-gradient(135deg, #6366F1, #4F46E5)"
        />
        <SummaryCard
          icon={<FiUserCheck />}
          label="Unassigned Leads"
          value={unassignedLeads}
          gradient="linear-gradient(135deg, #22C55E, #16A34A)"
        />
        <SummaryCard
          icon={<FiMapPin />}
          label="Karachi Agents"
          value={totalKarachiAgents}
          gradient="linear-gradient(135deg, #3B82F6, #2563EB)"
        />
        <SummaryCard
          icon={<FiFlag />}
          label="Dubai Agents"
          value={totalDubaiAgents}
          gradient="linear-gradient(135deg, #F59E0B, #D97706)"
        />
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Status Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {statuses.map(({ key, label, icon }) => (
            <div
              key={key}
              className={`flex items-center space-x-3 border-l-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${statusStyles[key]}`}
            >
              <div className="text-2xl">{icon}</div>
              <div>
                <p className="text-sm">{label}</p>
                <p className="font-bold">{statusBreakdown[key] ?? 0}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
