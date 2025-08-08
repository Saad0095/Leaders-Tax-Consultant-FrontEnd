const LeadDetailModal = ({ lead, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl animate-scaleIn">
        <h2 className="text-2xl font-semibold mb-4 text-center border-b pb-2">📄 Lead Details</h2>
        <div className="space-y-3 text-gray-700">
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Phone:</strong> {lead.phone}</p>
          <p><strong>Source:</strong> {lead.source}</p>
          <p><strong>Location:</strong> {lead.location}</p>
          <p><strong>Created:</strong> {new Date(lead.createdAt).toLocaleString()}</p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
