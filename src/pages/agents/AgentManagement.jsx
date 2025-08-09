import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaUserShield } from "react-icons/fa";
import api from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import ProfileModal from "../../components/ProfileModal";
import EditUserModal from "../../components/EditUserModal";
import AddUserModal from "../../components/AddUserModal";
import Loading from "../../components/Loading";

const AgentManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await api.get("/api/auth/users");
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/auth/users/${id}`);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to delete user");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const groupedUsers = users.reduce((acc, user) => {
    const role = user.role || "Unassigned";
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {});

  const roleOrder = ["admin", "karachi-agent", "dubai-agent", "unassigned"];

  if (loading) return <Loading/>

  return (
    <div className="p-4">
      <ToastContainer />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer"
        >
          ➕ Add New User
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 italic">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500 italic">No users found.</div>
      ) : (
        <div className="space-y-8">
          {roleOrder.map(
            (role) =>
              groupedUsers[role] && (
                <div key={role}>
                  <h2 className="text-xl font-semibold capitalize mb-4 border-b pb-2">
                    {role.replace("-", " ")}{"s"}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groupedUsers[role].map((user) => (
                      <div
                        key={user._id}
                        className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between border hover:shadow-lg transition"
                      >
                        {/* User Info */}
                        <div className="mb-3 space-y-1">
                          <div className="flex items-center gap-2 font-medium">
                            <FaUser className="text-gray-500" /> {user.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaEnvelope className="text-gray-500" /> {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-indigo-600 capitalize">
                            <FaUserShield /> {user.role}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="flex-1 text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setEditUser(user)}
                            className="flex-1 text-sm px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="flex-1 text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdated={fetchUsers}
        />
      )}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onUserAdded={fetchUsers}
        />
      )}
    </div>
  );
};

export default AgentManagement;
