import { FaTachometerAlt, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const sidebarLinks = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { label: "Leads", path: "/admin/leads", icon: <FaUsers /> },
    { label: "Manage Agents", path: "/admin/agents", icon: <FaUsers /> }, // Optional
  ],
  agent: [
    { label: "Dashboard", path: "/agent/dashboard", icon: <FaTachometerAlt /> },
    { label: "Leads", path: "/agent/leads", icon: <FaUsers /> },
  ],
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const decoded = jwtDecode(token);
        setRole(decoded?.role);
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!role) return null;

  const links = role === "admin" ? sidebarLinks.admin : sidebarLinks.agent;

  return (
    <>
      <aside
        className={`bg-primary fixed top-0 left-0 z-40 min-h-full w-72 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block shadow-lg`}
      >
        <div className="p-6">
          <img
            src="https://leaderstaxconsultant.com/wp-content/uploads/2025/08/Leaders-logo-final-white-1.webp"
            alt="Leaders Tax Collection"
            className="w-40 mx-auto"
          />
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-4">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-all ${
                  isActive ? "bg-secondary text-white" : "text-white hover:bg-white/10"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 mt-4 rounded-md text-white hover:bg-white/10 hover:text-red-600 transition-all cursor-pointer"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
