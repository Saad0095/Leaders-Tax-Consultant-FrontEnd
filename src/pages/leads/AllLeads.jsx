import { useEffect, useState } from "react";
import api from "../../utils/api";
import Loading from "../../components/Loading";
import AddLeadModal from "../../components/AddLeadModal";
import EditLeadModal from "../../components/EditLeadModal";
import LeadDetailModal from "../../components/LeadDetailModal";
import { toast } from "react-toastify";
import {
  FiBriefcase,
  FiUser,
  FiCalendar,
  FiGlobe,
  FiEye,
  FiEdit2,
  FiTrash,
} from "react-icons/fi";

const statusColors = {
  "Meeting Fixed": "bg-blue-100 text-blue-700",
  "Meeting Done": "bg-green-100 text-green-700",
  Postponed: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
  Closed: "bg-gray-200 text-gray-700",
};

const AllLeads = () => {
  const currentUser = { role: "Admin" }; // e.g., "Creator", "Assignee", or "Admin"

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [addingLead, setAddingLead] = useState(false);
  const [dubaiAgents, setDubaiAgents] = useState([]);
  const [assigningLeadId, setAssigningLeadId] = useState(null);
  const [assignedLeads, setAssignedLeads] = useState({}); // map leadId -> agentId

  // Fetch all leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/leads");
      setLeads(response);

      // Build map for assigned leads
      const assignedMap = {};
      response.forEach((lead) => {
        if (lead.assignedTo && lead.assignedTo._id) {
          assignedMap[lead._id] = lead.assignedTo._id;
        }
      });
      setAssignedLeads(assignedMap);
    } catch (err) {
      toast.error("Failed to fetch leads.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Dubai agents
  const fetchDubaiAgents = async () => {
    try {
      const response = await api.get("/api/auth/dubai-agents");
      setDubaiAgents(response);
    } catch {
      toast.error("Failed to fetch Dubai agents.");
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchDubaiAgents();
  }, []);

  // Fetch single lead by ID
  const fetchLeadById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/leads/${id}`);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch lead details.");
      return null;
    }
  };

  // Open lead details modal with fresh data
  const openLeadDetail = async (id) => {
    const leadData = await fetchLeadById(id);
    if (leadData) setSelectedLead(leadData);
  };

  // Open edit modal with fresh data
  const openEditLead = async (id) => {
    const leadData = await fetchLeadById(id);
    if (leadData) setEditingLead(leadData);
  };

  // Handle lead deletion (Admin only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/api/leads/${id}`);
      toast.success("Lead deleted successfully!");
      fetchLeads();
    } catch {
      toast.error("Failed to delete lead");
    }
  };

  // Handle assign lead to Dubai agent
  const handleAssignToDubaiAgent = async (leadId, userId) => {
    if (!userId) return;
    setAssigningLeadId(leadId);
    try {
      await api.post("/api/leads/assign", { leadId, userId });
      toast.success("Lead assigned to Dubai agent");

      // Update local assigned leads map
      setAssignedLeads((prev) => ({ ...prev, [leadId]: userId }));

      fetchLeads();
    } catch {
      toast.error("Failed to assign lead");
    } finally {
      setAssigningLeadId(null);
    }
  };

  // Handle lead update from EditLeadModal
  const handleUpdateLead = async (updatedLead) => {
    try {
      setLoading(true);
      await api.put(`/api/leads/${updatedLead._id}`, updatedLead);
      setLoading(false);
      toast.success("Lead updated successfully");
      setEditingLead(null);
      fetchLeads();
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update lead");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 All Leads</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setAddingLead(true)}
        >
          + Add Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => {
          const isAssigned = assignedLeads[lead._id] !== undefined;
          const assignedAgentId = assignedLeads[lead._id] || "";
          return (
            <div
              key={lead._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-5"
            >
              <div className="flex items-center mb-3">
                <FiBriefcase className="text-blue-500 mr-2" />
                <h2 className="font-semibold">{lead.companyName || "-"}</h2>
              </div>
              <div className="flex items-center mb-3">
                <FiUser className="text-gray-500 mr-2" />
                <span>{lead.customerName || "-"}</span>
              </div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                  statusColors[lead.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {lead.status}
              </span>

              <div className="flex items-center mb-3">
                <FiCalendar className="text-gray-500 mr-2" />
                <span>{lead.meetingDateAndTime || "-"}</span>
              </div>

              <div className="flex items-center mb-4">
                <FiGlobe className="text-gray-500 mr-2" />
                <span>{lead.service || "-"}</span>
              </div>

              <div className="mb-4">
                <label
                  htmlFor={`assign-agent-${lead._id}`}
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Assign to Dubai Agent:
                </label>
                <select
                  id={`assign-agent-${lead._id}`}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300
                    ${
                      isAssigned
                        ? "bg-gray-100 cursor-not-allowed text-gray-600"
                        : ""
                    }
                  `}
                  onChange={(e) =>
                    handleAssignToDubaiAgent(lead._id, e.target.value)
                  }
                  disabled={assigningLeadId === lead._id || isAssigned}
                  value={assignedAgentId}
                >
                  <option value="" disabled>
                    Select an agent
                  </option>
                  {dubaiAgents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                {/* View button - accessible by all */}
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => openLeadDetail(lead._id)}
                  title="View Lead"
                >
                  <FiEye size={18} />
                </button>

                {/* Edit button - only for Creator, Assignee, Admin */}
                {(currentUser.role === "Creator" ||
                  currentUser.role === "Assignee" ||
                  currentUser.role === "Admin") && (
                  <button
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => openEditLead(lead._id)}
                    title="Edit Lead"
                  >
                    <FiEdit2 size={18} />
                  </button>
                )}

                {/* Delete button - only for Admin */}
                {currentUser.role === "Admin" && (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(lead._id)}
                    title="Delete Lead"
                  >
                    <FiTrash size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
          onUpdate={handleUpdateLead}
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
