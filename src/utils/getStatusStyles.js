 export const getStatusStyles = (status) => {
    switch (status) {
      case "Meeting Fixed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Meeting Done":
        return "bg-green-100 text-green-700 border-green-300";
      case "In Follow-up":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Not Interested":
        return "bg-red-100 text-red-700 border-red-300";
      case "Not Responding":
        return "bg-red-100 text-red-700 border-red-300";
      case "Deal Done":
        return "bg-green-100 text-green-800 border-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };