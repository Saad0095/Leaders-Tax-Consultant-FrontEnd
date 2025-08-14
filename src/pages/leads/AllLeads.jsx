import { useEffect, useState } from "react";
import api from "../../utils/api";
import Loading from "../../components/Loading";
import AddLeadModal from "../../components/AddLeadModal";
import EditLeadModal from "../../components/EditLeadModal";
import LeadDetailModal from "../../components/LeadDetailModal";
import Pagination from "../../components/Pagination";
import LeadsFilter from "../../components/LeadsFilter";
import { toast, ToastContainer } from "react-toastify";
import { FiCalendar, FiGlobe, FiEye, FiEdit2, FiTrash } from "react-icons/fi";
import { formatDateTime } from "../../utils/formatDateTime";
import { getStatusStyles } from "../../utils/getStatusStyles";
import { FaBuilding, FaUser } from "react-icons/fa";

const AllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [addingLead, setAddingLead] = useState(false);
  const [dubaiAgents, setDubaiAgents] = useState([]);
  const [assigningLeadId, setAssigningLeadId] = useState(null);
  const [assignedLeads, setAssignedLeads] = useState({});

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const fetchLeads = async (page = 1, limit = 12, searchFilters = {}) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...searchFilters,
      });

      // Remove empty parameters
      for (const [key, value] of params.entries()) {
        if (!value) {
          params.delete(key);
        }
      }

      const response = await api.get(`/api/leads?${params.toString()}`);

      // Handle both old format (array) and new format (object with pagination)
      if (Array.isArray(response)) {
        // Fallback for old API response format
        setLeads(response);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalLeads: response.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: response.length,
        });
      } else {
        // New paginated response format
        setLeads(response.leads || []);
        setPagination(
          response.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalLeads: 0,
            hasNextPage: false,
            hasPrevPage: false,
            limit: 12,
          }
        );
      }

      const assignedMap = {};
      const leadsArray = Array.isArray(response)
        ? response
        : response.leads || [];
      leadsArray.forEach((lead) => {
        if (lead.assignedTo && lead.assignedTo._id) {
          assignedMap[lead._id] = lead.assignedTo._id;
        }
      });
      setAssignedLeads(assignedMap);
    } catch (err) {
      toast.error("Failed to fetch leads.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDubaiAgents = async () => {
    try {
      const response = await api.get("/api/auth/dubai-agents");
      setDubaiAgents(response);
    } catch {
      toast.error("Failed to fetch Dubai agents.");
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    fetchLeads(page, pagination.limit, filters);
  };

  const handleLimitChange = (newLimit) => {
    fetchLeads(1, newLimit, filters);
  };

  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    fetchLeads(1, pagination.limit, { ...filters, ...newFilters });
  };

  const handleSearchChange = (searchTerm) => {
    // Update filters state
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    // Fetch with the new filters
    fetchLeads(1, pagination.limit, newFilters);
  };

  useEffect(() => {
    fetchLeads();
    fetchDubaiAgents();
  }, []);

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

  const openLeadDetail = async (id) => {
    const leadData = await fetchLeadById(id);
    if (leadData) setSelectedLead(leadData);
  };

  const openEditLead = async (id) => {
    const leadData = await fetchLeadById(id);
    if (leadData) setEditingLead(leadData);
  };

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

  const handleAssignToDubaiAgent = async (leadId, userId) => {
    if (!userId) return;
    setLoading(true);
    setAssigningLeadId(leadId);
    try {
      await api.post("/api/leads/assign", { leadId, userId });
      setAssignedLeads((prev) => ({ ...prev, [leadId]: userId }));
      await fetchLeads();
      setTimeout(() => {
        toast.success("Lead assigned to Dubai agent");
      }, 500);
    } catch {
      toast.error("Failed to assign lead");
    } finally {
      setAssigningLeadId(null);
      setLoading(false);
    }
  };

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
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📋 All Leads</h1>
        {/* <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setAddingLead(true)}
        >
          + Add Lead
        </button> */}
      </div>

      {/* Search and Filter */}
      <LeadsFilter
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        filters={filters}
      />

      {leads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No leads found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead) => {
              const isAssigned = assignedLeads[lead._id] !== undefined;
              const assignedAgentId = assignedLeads[lead._id] || "";
              return (
                <div
                  key={lead._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <FaBuilding className="text-blue-500" />{" "}
                      {lead.companyName}
                    </h3>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusStyles(
                          lead.status
                        )}`}
                      >
                        {lead.status || "Unknown"}
                      </span>
                      {lead.status === "In Follow-up" && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                          {lead.followUpReminderDays || 2} min {/* TESTING: minutes instead of days */}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <FaUser className="text-gray-500 mr-2" />
                    <span>{lead.customerName || "-"}</span>
                  </div>

                  <div className="flex items-center mb-3">
                    <FiCalendar className="text-gray-500 mr-2" />
                    <span>{formatDateTime(lead.meetingDateAndTime)}</span>
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
                      className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300
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
                    <button
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      onClick={() => openLeadDetail(lead._id)}
                      title="View Lead"
                    >
                      <FiEye size={18} />
                    </button>

                    <button
                      className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
                      onClick={() => openEditLead(lead._id)}
                      title="Edit Lead"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => handleDelete(lead._id)}
                      title="Delete Lead"
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalLeads}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

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
