import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaPhoneAlt, FaUser, FaBuilding, FaEye, FaEdit } from "react-icons/fa";
import api from "../../utils/api";
import Loading from "../../components/Loading";
import AddLeadModal from "../../components/AddLeadModal";
import LeadDetailModal from "../../components/LeadDetailModal";
import EditLeadModalDubai from "../../components/EditLeadModalDubai";
import Pagination from "../../components/Pagination";
import LeadsFilter from "../../components/LeadsFilter";

const MyLeads = () => {
  const [leads, setLeads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: ""
  });

  const fetchLeads = async (page = 1, limit = 10, searchFilters = {}) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const { role } = decoded;
    setRole(role);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...searchFilters
      });

      // Remove empty parameters
      for (const [key, value] of params.entries()) {
        if (!value) {
          params.delete(key);
        }
      }

      const res = await api.get(`/api/leads?${params.toString()}`);

      // Handle both old format (array) and new format (object with pagination)
      if (Array.isArray(res)) {
        // Fallback for old API response format
        setLeads(res);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalLeads: res.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: res.length
        });
      } else {
        // New paginated response format
        setLeads(res.leads || []);
        setPagination(res.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalLeads: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10
        });
      }
    } catch (err) {
      console.error(err);
      setLeads([]);
    } finally {
      setLoading(false);
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
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchLeads(1, pagination.limit, { ...filters, ...newFilters });
  };

  const handleSearchChange = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    fetchLeads(1, pagination.limit, { ...filters, search: searchTerm });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Meeting Fixed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Meeting Done":
        return "bg-green-100 text-green-700 border-green-300";
      case "In Follow-up":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Not Interested":
        return "bg-red-100 text-red-700 border-red-300";
      case "Not Responding":
        return "bg-red-100 text-red-700 border-red-300";
      case "Deal Done":
        return "bg-green-100 text-green-800 border-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Leads</h2>
        {role === "karachi-agent" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg cursor-pointer transition"
          >
            + Add Lead
          </button>
        )}
        {role === "dubai-agent" && (
          <p className="text-sm text-gray-500">Only assigned leads are shown</p>
        )}
      </div>

      {/* Search and Filter */}
      <LeadsFilter
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        filters={filters}
      />

      {loading ? (
        <Loading />
      ) : leads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No leads found.</p>
          {role === "karachi-agent" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Create Your First Lead
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <FaBuilding className="text-blue-500" /> {lead.companyName}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusStyles(
                      lead.status
                    )}`}
                  >
                    {lead.status || "Unknown"}
                  </span>
                </div>

              <div className="space-y-2 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  <FaUser className="text-gray-500" /> {lead.customerName}
                </p>
                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-gray-500" />{" "}
                  {lead.mobile || lead.whatsapp}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                {role === "dubai-agent" && lead.status !== "Closed" && (
                  <div className="mt-4 flex">
                    <button
                      onClick={() => setEditLead(lead)}
                      className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition"
                    >
                      <FaEdit /> Edit
                    </button>
                  </div>
                )}
                <div className="mt-4 ">
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition"
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
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

      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onLeadAdded={fetchLeads}
        />
      )}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
      {editLead && (
        <EditLeadModalDubai
          lead={editLead}
          onClose={() => setEditLead(null)}
          onUpdated={fetchLeads}
        />
      )}
    </div>
  );
};

export default MyLeads;
