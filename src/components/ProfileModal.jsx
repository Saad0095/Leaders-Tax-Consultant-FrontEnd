import React from "react";
import { FiUser } from "react-icons/fi";

const roleColors = {
  admin: "bg-red-100 text-red-700",
  "karachi-agent": "bg-blue-100 text-blue-700",
  "dubai-agent": "bg-green-100 text-green-700",
  user: "bg-gray-100 text-gray-700", // fallback role color
};

const ProfileModal = ({ user, onClose }) => {
  const roleClass = roleColors[user.role?.toLowerCase()] || roleColors.user;

  // Capitalize role words properly (handle hyphens nicely)
  const formatRole = (role = "") =>
    role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      tabIndex={-1}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close profile modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded cursor-pointer transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.name}'s avatar`}
              className="w-28 h-28 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-6xl shadow-md">
              <FiUser />
            </div>
          )}
        </div>

        {/* Title */}
        <h2
          id="profile-modal-title"
          className="text-center text-3xl font-semibold text-gray-900 mb-8 tracking-wide"
        >
          User Profile
        </h2>

        {/* Info */}
        <dl className="space-y-6 text-gray-800">
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-gray-600">Name</dt>
            <dd className="mt-1 text-xl font-medium">{user.name}</dd>
          </div>

          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-gray-600">Email</dt>
            <dd className="mt-1 text-lg break-all">{user.email}</dd>
          </div>

          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-gray-600">Role</dt>
            <dd className="mt-1">
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-semibold tracking-wide ${roleClass}`}
              >
                {formatRole(user.role)}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfileModal;
