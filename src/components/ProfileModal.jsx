import React, { useState } from "react";
import { FiUser } from "react-icons/fi";
import Loading from "./Loading";
import { toast, ToastContainer } from "react-toastify";
import api from "../utils/api";

const roleColors = {
  admin: "bg-red-50 text-red-600 ring-1 ring-red-200",
  "karachi-agent": "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
  "dubai-agent": "bg-green-50 text-green-600 ring-1 ring-green-200",
  user: "bg-gray-50 text-gray-600 ring-1 ring-gray-200",
};

const ProfileModal = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const roleClass = roleColors[user.role?.toLowerCase()] || roleColors.user;

  const formatRole = (role = "") =>
    role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleForgetPassword = async (e) => {
    setLoading(true);
    try {
       await api.post("/api/auth/forgot-password", {
        email: user.email,
      });
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.log("Error: ", error);

      const message = error?.response?.data?.message || "Something went wrong!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      tabIndex={-1}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 transition-opacity"
      onClick={onClose}
    >
      <ToastContainer />
      <div
        className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 relative transform transition-all duration-300 ease-out scale-100 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close profile modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg transition cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex justify-center mb-6">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.name}'s avatar`}
              className="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-5xl shadow-sm border border-gray-200">
              <FiUser />
            </div>
          )}
        </div>

        <h2
          id="profile-modal-title"
          className="text-center text-2xl font-semibold text-gray-900 mb-8 tracking-tight"
        >
          User Profile
        </h2>

        <dl className="space-y-5 text-gray-800">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Name
            </dt>
            <dd className="mt-1 text-lg font-semibold">{user.name}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </dt>
            <dd className="mt-1 text-base text-gray-700 break-all">
              {user.email}
            </dd>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Password
              </dt>
              <dd className="mt-1 text-base text-gray-700 break-all">
                ************
              </dd>
            </div>
            {loading ? (
              <p className="text-sm font-medium text-green-700 italic">
                Sending Reset Link... Please wait!
              </p>
            ) : (
              <button
                type="button"
                onClick={handleForgetPassword}
                className="text-sm font-medium text-green-700 underline-offset-4 hover:underline focus:outline-none cursor-pointer"
              >
                Reset password
              </button>
            )}
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Role
            </dt>
            <dd className="mt-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleClass}`}
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
