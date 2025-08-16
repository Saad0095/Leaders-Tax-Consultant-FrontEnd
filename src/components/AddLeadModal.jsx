import { useState } from "react";
import {
  FiBriefcase,
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiMapPin,
  FiCalendar,
  FiGlobe,
  FiTag,
  FiX,
  FiEdit3,
} from "react-icons/fi";
import api from "../utils/api";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const AddLeadModal = ({ onLeadAdded, onClose }) => {
  const [leadData, setLeadData] = useState({
    companyName: "",
    customerName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    emirate: "",
    area: "",
    meetingDateAndTime: "",
    language: "",
    service: "",
    status: "",
    notesByKarUser: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setLeadData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log(leadData);

    try {
      await api.post("/api/leads", leadData);
      setSubmitting(false);
      onLeadAdded();
      onClose();
    } catch (error) {
      setSubmitting(false);
      console.error("Failed to add lead:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-3 sticky top-0 bg-white z-10 p-6">
          <h2 className="text-xl font-semibold text-gray-800">Add New Lead</h2>
          <button
            onClick={onClose}
            type="button"
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            disabled={submitting}
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 pt-0"
        >
          <div className="col-span-full">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Basic Info
            </h3>
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiBriefcase className="text-gray-400 mr-2" />
            <input
              type="text"
              name="companyName"
              value={leadData.companyName}
              onChange={onChange}
              placeholder="Company Name"
              className="w-full outline-none"
              disabled={submitting}
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="customerName"
              value={leadData.customerName}
              onChange={onChange}
              placeholder="Customer Name"
              className="w-full outline-none"
              disabled={submitting}
              required
            />
          </div>

          <div className="col-span-full">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Contact Info
            </h3>
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiMail className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              value={leadData.email}
              onChange={onChange}
              placeholder="Email"
              className="w-full outline-none"
              disabled={submitting}
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiPhone className="text-gray-400 mr-2" />
            <input
              type="text"
              name="mobile"
              value={leadData.mobile}
              onChange={onChange}
              placeholder="Mobile"
              className="w-full outline-none"
              disabled={submitting}
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiMessageSquare className="text-gray-400 mr-2" />
            <input
              type="text"
              name="whatsapp"
              value={leadData.whatsapp}
              onChange={onChange}
              placeholder="WhatsApp"
              className="w-full outline-none"
              disabled={submitting}
            />
          </div>

          {/* Section: Lead Details */}
          <div className="col-span-full">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Lead Details
            </h3>
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiMapPin className="text-gray-400 mr-2" />
            <select
              name="emirate"
              value={leadData.emirate}
              onChange={onChange}
              className="w-full outline-none bg-transparent"
              disabled={submitting}
            >
              <option value="">Select Emirate</option>
              <option value="Dubai">Dubai</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Ajman">Ajman</option>
              <option value="Fujairah">Fujairah</option>
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
            </select>
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiMapPin className="text-gray-400 mr-2" />
            <input
              type="text"
              name="area"
              value={leadData.area}
              onChange={onChange}
              placeholder="Area"
              className="w-full outline-none"
              disabled={submitting}
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiCalendar className="text-gray-400 mr-2" />
            <DateTimePicker
              onChange={(date) =>
                setLeadData((prev) => ({
                  ...prev,
                  meetingDateAndTime: date,
                }))
              }
              value={leadData.meetingDateAndTime}
              className="flex-1"
              calendarClassName="rounded-lg shadow-lg"
              clearIcon={null}
              disableClock
              format="dd MMM yyyy, h:mm a"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiGlobe className="text-gray-400 mr-2" />
            <select
              name="language"
              value={leadData.language}
              onChange={onChange}
              className="w-full outline-none bg-transparent"
              disabled={submitting}
            >
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiGlobe className="text-gray-400 mr-2" />
            <select
              name="service"
              value={leadData.service}
              onChange={onChange}
              className="w-full outline-none bg-transparent"
              disabled={submitting}
            >
              <option value="">Select Service</option>
              <option value="Corporate Tax Registration">
                Corporate Tax Registration
              </option>
              <option value="Vat Registration">Vat Registration</option>
              <option value="Corporate Tax Filing">Corporate Tax Filing</option>
              <option value="Vat Filing">Vat Filing</option>
              <option value="Audit Report">Audit Report</option>
              <option value="Financial Statement">Financial Statement</option>
              <option value="Accounting & Bookkeeping">
                Accounting & Bookkeeping
              </option>
              <option value="Penalty waiver">Penalty waiver</option>
            </select>
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition">
            <FiTag className="text-gray-400 mr-2" />
            <select
              name="status"
              value={leadData.status}
              onChange={onChange}
              className="w-full outline-none bg-transparent"
              disabled={submitting}
            >
              <option value="">Select Status</option>
              <option value="Meeting Fixed">Meeting Fixed</option>
              <option value="Meeting Done">Meeting Done</option>
              <option value="Postponed">Postponed</option>
              <option value="Cancelled">Cancelled</option>
              {/* <option value="Closed">Closed</option> */}
            </select>
          </div>

          {/* Section: Notes */}
          <div className="col-span-full">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Key Notes
            </h3>
          </div>
          <div className="flex items-start border border-gray-300 rounded-lg p-2 hover:border-blue-400 focus-within:border-blue-500 transition col-span-full">
            <FiEdit3 className="text-gray-400 mr-2 mt-1" />
            <textarea
              name="notesByKarUser"
              value={leadData.notesByKarUser}
              onChange={onChange}
              placeholder="Enter any important notes here..."
              rows="4"
              className="w-full outline-none resize-none"
              disabled={submitting}
            />
          </div>

          {/* Actions */}
          <div className="col-span-full flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
