import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FiFile } from "react-icons/fi";
import api from "../utils/api";
import { useNotifications } from "../context/NotificationContext";

const EditLeadModalDubai = ({ lead, onClose, onUpdated }) => {
  const { forceNotificationCheck } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(lead.status || "");
  const [notes, setNotes] = useState(lead.notesByDubAgent || "");
  const [revenue, setRevenue] = useState(lead.revenueAmount || "");
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [followUpReminderDays, setFollowUpReminderDays] = useState(lead.followUpReminderDays || 3);

  const statusOptions = [
    "Meeting Fixed",
    "Meeting Done",
    "In Follow-up",
    "Not Interested",
    "Not Responding",
    "Deal Done",
    "Closed",
  ];

  // Fetch existing files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await api.get(`/api/leads/${lead._id}/files`);
        if (res.files) {
          setExistingFiles(res.files);
        }
      } catch (error) {
        console.error("Error fetching lead files:", error);
      }
    };
    fetchFiles();
  }, [lead._id]);

  const handleSave = async () => {
    if (status === "Deal Done" && !revenue) {
      toast.error("Please enter revenue amount before saving.");
      return;
    }
    setLoading(true);
    try {
      if (status !== lead.status) {
        const statusData = { status };
        if (status === "In Follow-up") {
          statusData.followUpReminderDays = followUpReminderDays;
        }
        await api.patch(`/api/leads/${lead._id}/status`, statusData);
      }
      if (notes !== lead.notesByDubAgent && notes.trim() !== "") {
        await api.put(`/api/leads/${lead._id}/notes`, {
          notesByDubAgent: notes.trim(),
        });
      }
      if (status === "Deal Done") {
        if (revenue) {
          await api.put(`/api/leads/${lead._id}/revenue`, {
            revenueAmount: Number(revenue),
          });
        }
        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((file) => formData.append("files", file));
          await api.post(`/api/leads/${lead._id}/invoice`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }
      setLoading(false);
      toast.success("Lead Updated Successfully!");

      // Force notification check after lead update
      setTimeout(() => {
        forceNotificationCheck();
      }, 1000);

      setTimeout(() => {
        onUpdated();
        onClose();
      }, 500);
    } catch (err) {
      console.error("Error updating lead", err);
      toast.error(err.response?.data?.error || "Failed to update lead");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-fadeIn scale-95">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">
            Edit Lead –{" "}
            <span className="text-blue-600">{lead.companyName}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-50"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Follow-up Reminder Days (only show when status is "In Follow-up") */}
          {status === "In Follow-up" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Follow-up Reminder (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={followUpReminderDays}
                onChange={(e) => setFollowUpReminderDays(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-50"
                placeholder="Enter days (1-30)"
              />
              <p className="text-xs text-gray-500 mt-1">
                You'll receive a reminder after this many days (default: 3 days)
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-50"
              rows={3}
              placeholder="Add your notes here..."
            />
          </div>

          {status === "Deal Done" && (
            <>
              {/* Revenue */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Revenue Amount (AED)
                </label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="Enter revenue amount"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-50"
                  required
                />
              </div>

              {/* Existing Files */}
              {existingFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Existing Files
                  </label>
                  <ul className="space-y-1">
                    {existingFiles.map((file, i) => (
                      <li key={i}>
                        <a
                          href={`${
                            import.meta.env.VITE_BASE_URL
                          }/${file.replace(/\\/g, "/")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-blue-600 hover:underline"
                        >
                          <FiFile />
                          <span>{file.split(/[\\/]/).pop()}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Upload New File */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload New File (optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setFiles([...e.target.files])}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLeadModalDubai;
