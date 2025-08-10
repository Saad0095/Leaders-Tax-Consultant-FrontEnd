import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiUser,
  FiClock,
  FiX,
  FiFileText,
  FiFile,
} from "react-icons/fi";
import { MdOutlineWhatsapp } from "react-icons/md";

const statusColors = {
  "Meeting Fixed": "bg-blue-100 text-blue-800 border border-blue-300",
  "Meeting Done": "bg-green-100 text-green-800 border border-green-300",
  "In Follow-up": "bg-yellow-100 text-yellow-800 border border-yellow-300",
  "Not Interested": "bg-red-100 text-red-800 border border-red-300",
  "Not Responding": "bg-orange-100 text-orange-800 border border-orange-300",
  "Deal Done": "bg-emerald-100 text-emerald-800 border border-emerald-300",
  Closed: "bg-gray-200 text-gray-800 border border-gray-300",
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
    <Icon className="text-gray-500 text-lg flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

const LeadDetailModal = ({ lead, onClose }) => {
  console.log(lead);
  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl animate-fadeIn overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {lead.customerName || "Lead Details"}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status */}
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                statusColors[lead.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {lead.status || "N/A"}
            </span>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              icon={FiBriefcase}
              label="Company"
              value={lead.companyName}
            />
            <InfoRow icon={FiUser} label="Customer" value={lead.customerName} />
            <InfoRow icon={FiMail} label="Email" value={lead.email} />
            <InfoRow icon={FiPhone} label="Phone" value={lead.mobile} />
            <InfoRow
              icon={MdOutlineWhatsapp}
              label="WhatsApp"
              value={lead.whatsapp}
            />
            <InfoRow icon={FiMapPin} label="Emirate" value={lead.emirate} />
            <InfoRow icon={FiMapPin} label="Area" value={lead.area} />
            <InfoRow
              icon={FiClock}
              label="Meeting Date"
              value={
                lead.meetingDateAndTime
                  ? new Date(lead.meetingDateAndTime).toLocaleString()
                  : "N/A"
              }
            />
            <InfoRow icon={FiBriefcase} label="Service" value={lead.service} />
            <InfoRow icon={FiUser} label="Language" value={lead.language} />
          </div>

          {/* Notes */}
          {(lead.notesByKarUser || lead.notesByDubAgent) && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Notes</h3>
              {lead.notesByKarUser && (
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border mb-2">
                  <strong>Notes by Karachi User:</strong> {lead.notesByKarUser}
                </p>
              )}
              {lead.notesByDubAgent && (
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg border">
                  <strong>Notes by Dubai Agent:</strong> {lead.notesByDubAgent}
                </p>
              )}
            </div>
          )}

          {/* Assigned To & Created By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              icon={FiUser}
              label="Assigned To"
              value={lead.assignedTo?.name || "N/A"}
            />
            <InfoRow
              icon={FiUser}
              label="Created By"
              value={lead.createdBy?.name || "N/A"}
            />
          </div>

          {/* Files */}
          {lead.files?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Files</h3>
              <ul className="space-y-1">
                {lead.files.map((file, i) => (
                  <li key={i}>
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                      <FiFile />
                      <span>{file.split("/").pop()}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status History */}
          {lead.statusHistory?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Status History</h3>
              <ul className="space-y-2 text-sm">
                {lead.statusHistory.map((s) => (
                  <li
                    key={s._id}
                    className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm hover:bg-gray-50 transition"
                  >
                    <strong className="text-gray-800">{s.status}</strong> by{" "}
                    <span className="text-blue-600">{s.updatedBy?.name || "N/A"}</span>{" "}
                    — <span className="text-gray-500">{new Date(s.changedAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
