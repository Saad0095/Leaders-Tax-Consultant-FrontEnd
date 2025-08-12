import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiUser,
  FiClock,
  FiX,
} from "react-icons/fi";
import { MdOutlineWhatsapp } from "react-icons/md";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const statusColors = {
  "Meeting Fixed": "bg-blue-100 text-blue-800 border border-blue-300",
  "Meeting Done": "bg-green-100 text-green-800 border border-green-300",
  "In Follow-up": "bg-yellow-100 text-yellow-800 border border-yellow-300",
  "Not Interested": "bg-red-100 text-red-800 border border-red-300",
  "Not Responding": "bg-orange-100 text-orange-800 border border-orange-300",
  "Deal Done": "bg-emerald-100 text-emerald-800 border border-emerald-300",
  Closed: "bg-gray-200 text-gray-800 border border-gray-300",
};

const InfoRowInput = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => (
  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
    <Icon className="text-gray-500 text-lg flex-shrink-0" />
    <div className="flex-1">
      <label className="text-xs text-gray-500 block mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  </div>
);

const EditLeadModal = ({ lead, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    customerName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    emirate: "",
    area: "",
    meetingDateAndTime: "",
    service: "",
    language: "",
    notesByKarUser: "",
    notesByDubUser: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        companyName: lead.companyName || "",
        customerName: lead.customerName || "",
        email: lead.email || "",
        mobile: lead.mobile || "",
        whatsapp: lead.whatsapp || "",
        emirate: lead.emirate || "",
        area: lead.area || "",
        meetingDateAndTime: lead.meetingDateAndTime
          ? new Date(lead.meetingDateAndTime).toISOString().slice(0, 16)
          : "",
        service: lead.service || "",
        language: lead.language || "",
        notesByKarUser: lead.notesByKarUser || "",
        notesByDubUser: lead.notesByDubUser || "",
        status: lead.status || "",
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim() || !formData.customerName.trim()) {
      toast.error("Company and Customer names are required.");
      return;
    }

    setLoading(true);
    try {
      const updatedLead = {
        ...formData,
        _id: lead._id,
        meetingDateAndTime: formData.meetingDateAndTime
          ? new Date(formData.meetingDateAndTime).toISOString()
          : null,
      };
      toast.success("Lead Updated Successfully!");
      setTimeout(() => {
        onUpdate(updatedLead);
      }, 1000);
    } catch (error) {
      toast.success("Failed to Update Lead!");
      // onUpdate handles error toasts
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <ToastContainer />
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl animate-fadeIn overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-bold text-gray-800">
            Edit Lead: {lead.customerName}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            disabled={loading}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRowInput
              icon={FiBriefcase}
              label="Company"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading}
            />
            <InfoRowInput
              icon={FiUser}
              label="Customer"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              disabled={loading}
            />
            <InfoRowInput
              icon={FiMail}
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <InfoRowInput
              icon={FiPhone}
              label="Phone"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              disabled={loading}
            />
            <InfoRowInput
              icon={MdOutlineWhatsapp}
              label="WhatsApp"
              name="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={handleChange}
              disabled={loading}
            />
            <InfoRowInput
              icon={FiMapPin}
              label="Emirate"
              name="emirate"
              value={formData.emirate}
              onChange={handleChange}
              disabled={loading}
            />
            <InfoRowInput
              icon={FiMapPin}
              label="Area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              disabled={loading}
            />
            {/* <InfoRowInput
              icon={FiClock}
              label="Meeting Date & Time"
              name="meetingDateAndTime"
              type="datetime-local"
              value={formData.meetingDateAndTime}
              onChange={handleChange}
              disabled={loading}
            /> */}
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <FiClock className="text-gray-500 text-lg flex-shrink-0" />
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">
                  Meeting Date & Time
                </label>
                <DateTimePicker
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      meetingDateAndTime: date,
                    }))
                  }
                  value={
                    formData.meetingDateAndTime
                      ? new Date(formData.meetingDateAndTime)
                      : null
                  }
                  className="w-full"
                  calendarClassName="rounded-lg shadow-lg border border-gray-300"
                  clearIcon={null}
                  disableClock
                  format="dd MMM yyyy, h:mm a"
                  minDate={new Date()}
                  disabled={loading}
                />
              </div>
            </div>

            <InfoRowInput
              icon={FiBriefcase}
              label="Service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              disabled={loading}
            />
            <InfoRowInput
              icon={FiUser}
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block mb-1 font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="notesByKarUser"
              className="block mb-1 font-medium text-gray-700"
            >
              Notes By Karachi Agent:
            </label>
            <textarea
              id="notes"
              name="notesByKarUser"
              rows={4}
              value={formData.notesByKarUser}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="notesByDubAgent"
              className="block mb-1 font-medium text-gray-700"
            >
              Notes By Duabi Agent:
            </label>
            <textarea
              id="notes"
              name="notesByDubAgent"
              rows={4}
              value={formData.notesByDubAgent}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
