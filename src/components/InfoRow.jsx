const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
    <Icon className="text-gray-500 text-lg flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

export default InfoRow