import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const MyLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const { id } = jwtDecode(token);

      const response = await api.get(`/api/leads/agent/${id}`);
      setLeads(response);
    } catch (error) {
      toast.error("Failed to fetch your leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeads();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Leads</h1>

      {loading ? (
        <p>Loading...</p>
      ) : leads.length === 0 ? (
        <p>No leads assigned to you.</p>
      ) : (
        <table className="w-full bg-white rounded shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyLeads;
