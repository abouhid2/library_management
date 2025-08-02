import React from "react";

const DashboardHeader = ({
  isLibrarian,
  overdueCount,
  showOverdue,
  onToggleOverdue,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          {isLibrarian ? "Librarian Dashboard" : "My Dashboard"}
        </h2>
        <p className="text-gray-600 mt-1">
          {isLibrarian
            ? "Monitor library operations and manage borrowings"
            : "Track your borrowed books and due dates"}
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onToggleOverdue}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            showOverdue
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-yellow-600 hover:bg-yellow-700 text-white"
          }`}
        >
          {showOverdue ? "Show All" : `Show Overdue (${overdueCount})`}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
