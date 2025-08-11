import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

const LeadsFilter = ({ onFilterChange, onSearchChange, filters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || "",
    startDate: filters.startDate || "",
    endDate: filters.endDate || "",
  });

  // Update local state when filters change from parent
  useEffect(() => {
    setSearchTerm(filters.search || "");
    setLocalFilters({
      status: filters.status || "",
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
    });
  }, [filters]);

  const statusOptions = [
    "Meeting Fixed",
    "Meeting Done", 
    "In Follow-up",
    "Not Interested",
    "Not Responding",
    "Deal Done",
    "Closed"
  ];

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Just update the input value, don't trigger search automatically
  };

  const handleSearchSubmit = () => {
    // Trigger search when user explicitly wants to search
    onSearchChange(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: "",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(clearedFilters);
    setSearchTerm("");

    onFilterChange(clearedFilters);
    onSearchChange("");
  };

  const hasActiveFilters = localFilters.status || localFilters.startDate || localFilters.endDate || searchTerm;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search leads by company, customer, email, mobile, status..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearchSubmit}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Search (or press Enter)"
          >
            <FiSearch className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {[localFilters.status, localFilters.startDate, localFilters.endDate, searchTerm].filter(Boolean).length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiX className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={localFilters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={localFilters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsFilter;