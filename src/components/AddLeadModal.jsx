import { useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import Loading from "./Loading";

const AddLeadModal = ({ onClose, onLeadAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/leads", formData);
      toast.success("Lead added successfully!");
      onLeadAdded();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to add lead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl animate-scaleIn">
        <h2 className="text-2xl font-semibold mb-4 text-center border-b pb-2">➕ Add New Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
            required
          />
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Source"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Location"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded cursor-pointer transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded cursor-pointer transition"
              disabled={loading}
            >
              {loading ? <Loading size="small" /> : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
