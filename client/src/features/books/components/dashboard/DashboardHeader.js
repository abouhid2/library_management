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
        <h2 className="text-3xl font-bold text-secondary">
          {isLibrarian ? "Librarian Dashboard" : "My Dashboard"}
        </h2>
        <p className="text-neutral mt-1">
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
              ? "bg-neutral hover:bg-secondary text-primary"
              : "bg-warning hover:bg-warning/80 text-white"
          }`}
        >
          {showOverdue ? "Show All" : `Show Overdue (${overdueCount})`}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
