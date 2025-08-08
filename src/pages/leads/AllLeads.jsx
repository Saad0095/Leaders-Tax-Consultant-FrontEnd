import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";

const AllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await api.get("/api/leads");
      setLeads(response);
    } catch (error) {
      toast.error("Failed to fetch leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Leads</h1>

      {loading ? (
        <p>Loading...</p>
      ) : leads.length === 0 ? (
        <p>No leads available.</p>
      ) : (
        <table className="w-full bg-white rounded shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Assigned To</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.assignedTo || "Unassigned"}</td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-600">Edit</button>
                  <button className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllLeads;
