import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import ProfileModal from "../../components/ProfileModal";
import EditUserModal from "../../components/EditUserModal";
import AddUserModal from "../../components/AddUserModal"; // NEW

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

  return (
    <div className="p-4">
      <ToastContainer />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">All Users</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer"
        >
          ➕ Add New User
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 space-x-2 flex gap-3 ">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditUser(user)}
                      className="text-sm px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
