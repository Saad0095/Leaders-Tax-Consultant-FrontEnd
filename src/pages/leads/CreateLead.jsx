import { useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";

const CreateLead = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    customerName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    service: "",
    emirate: "",
    area: "",
    meetingDateAndTime: "",
    language: "",
    notesByKarUser: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/leads", formData);
      toast.success("Lead created successfully!");
      setFormData({
        companyName: "",
        customerName: "",
        email: "",
        mobile: "",
        whatsapp: "",
        service: "",
        emirate: "",
        area: "",
        meetingDateAndTime: "",
        language: "",
        notesByKarUser: ""
      });
    } catch (error) {
      toast.error("Failed to create lead.");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Create New Lead</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required />
        <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Customer Name" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" />
        <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" />
        <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="Whatsapp" />
        <select name="service" value={formData.service} onChange={handleChange}>
          <option value="">Select Service</option>
          {/* Map servicesEnum here */}
        </select>
        <select name="emirate" value={formData.emirate} onChange={handleChange}>
          <option value="">Select Emirate</option>
          <option value="Dubai">Dubai</option>
          <option value="Sharjah">Sharjah</option>
          {/* ...rest */}
        </select>
        <input name="area" value={formData.area} onChange={handleChange} placeholder="Area" />
        <input name="meetingDateAndTime" value={formData.meetingDateAndTime} onChange={handleChange} type="datetime-local" />
        <select name="language" value={formData.language} onChange={handleChange}>
          <option value="">Select Language</option>
          <option value="English">English</option>
          <option value="Urdu">Urdu</option>
          <option value="Arabic">Arabic</option>
        </select>
        <textarea name="notesByKarUser" value={formData.notesByKarUser} onChange={handleChange} placeholder="Additional Notes"></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded cursor-pointer col-span-2">Create Lead</button>
      </form>
    </div>
  );
};

export default CreateLead;
