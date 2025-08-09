import { FaBell, FaUserCircle } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";
import { useLocation } from "react-router-dom";

const Navbar = ({ isOpen, setIsOpen }) => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const data = await api.get(`/api/auth/users/${decoded.id}`);
        setUser(data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
      }
    };

    fetchUser();
  }, [pathname]);

  return (
    <div className="p-5 flex items-center justify-between gap-4 bg-white shadow">
      <div className="flex justify-center items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex text-3xl text-black cursor-pointer"
        >
          <HiMenu />
        </button>
        <img
          src="https://leaderstaxconsultant.com/wp-content/uploads/2025/08/Leaders-logo-final-white-1.webp"
          alt="Logo"
          className="md:hidden flex w-32"
        />
      </div>
      <div className="flex items-center gap-6">
        <FaBell className="text-xl text-gray-600 cursor-pointer" />
        <FaUserCircle
          className="text-2xl text-gray-600 cursor-pointer"
          onClick={() => setShowModal(true)}
        />
      </div>
      {showModal && (
        <ProfileModal user={user} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Navbar;
