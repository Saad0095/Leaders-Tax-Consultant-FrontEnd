import { useEffect, useState } from "react";
import Loading from "../../components/Loading";

const AdminDashboard = () => {
  
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

  const statusColors = {
    "Meeting Fixed": "bg-blue-100 text-blue-700",
    "Meeting Done": "bg-green-100 text-green-700",
    Postponed: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
    Closed: "bg-gray-200 text-gray-700",
  };

  const stats = [
    {
      label: "Total Leads",
      value: leads.length,
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "Meeting Fixed",
      value: leads.filter((l) => l.status === "Meeting Fixed").length,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Meeting Done",
      value: leads.filter((l) => l.status === "Meeting Done").length,
      color: "from-green-400 to-green-600",
    },
    {
      label: "Postponed",
      value: leads.filter((l) => l.status === "Postponed").length,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      label: "Cancelled",
      value: leads.filter((l) => l.status === "Cancelled").length,
      color: "from-red-400 to-red-600",
    },
    {
      label: "Closed",
      value: leads.filter((l) => l.status === "Closed").length,
      color: "from-gray-400 to-gray-600",
    },
  ];

  
  const fetchLeads = async () => {
    try {
      const response = await api.get("/api/leads");
      setLeads(response);
    } catch (err) {
      toast.error("Failed to fetch leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

    if (loading) return <Loading />;


  return (
    <div className="p-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-r ${stat.color} text-white p-4 rounded-xl shadow`}
          >
            <p className="text-sm">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
