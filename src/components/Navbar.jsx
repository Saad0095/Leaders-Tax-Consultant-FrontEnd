import { FaBell, FaUserCircle } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";

const Navbar = ({ isOpen, setIsOpen }) => {
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
        <FaUserCircle className="text-2xl text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
