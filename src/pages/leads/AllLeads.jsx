import { useEffect, useState } from "react";
import api from "../../utils/api";
import Loading from "../../components/Loading";
import AddLeadModal from "../../components/AddLeadModal";
import EditLeadModal from "../../components/EditLeadModal";
import LeadDetailModal from "../../components/LeadDetailModal";
import { toast } from "react-toastify";

const AllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [addingLead, setAddingLead] = useState(false);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/api/leads/${id}`);
      toast.success("Lead deleted");
      fetchLeads();
    } catch {
      toast.error("Failed to delete lead");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📋 All Leads</h1>
        <button
          onClick={() => setAddingLead(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          + Add Lead
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full border">
          <thead className="bg-gray-100 text-left text-sm uppercase">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Assigned</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.assignedTo?.name || "-"}</td>
                <td className="p-3 capitalize">{lead.status}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    View
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded cursor-pointer"
                    onClick={() => setEditingLead(lead)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
                    onClick={() => handleDelete(lead._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addingLead && (
        <AddLeadModal
          onClose={() => setAddingLead(false)}
          onLeadAdded={fetchLeads}
        />
      )}
      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onUpdated={fetchLeads}
        />
      )}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
};

export default AllLeads;
