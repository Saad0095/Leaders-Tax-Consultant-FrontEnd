const ProfileModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl animate-scaleIn">
        <h2 className="text-2xl font-semibold mb-6 text-center border-b pb-2">👤 User Profile</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            <span className="capitalize font-medium text-blue-600">{user.role}</span>
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
