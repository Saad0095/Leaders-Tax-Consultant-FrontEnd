import { useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import Loading from "./Loading";

const EditUserModal = ({ user, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/api/auth/users/${user._id}`, formData);
      toast.success("User updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl animate-scaleIn">
        <h2 className="text-2xl font-semibold mb-6 text-center border-b pb-2">✏️ Edit User</h2>

        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="karachi-agent">Karachi Agent</option>
              <option value="dubai-agent">Dubai Agent</option>
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded cursor-pointer transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUserModal;
