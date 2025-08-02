import React from "react";

const BorrowingsHeader = ({ isLibrarian, overdueCount, showOverdue, onToggleOverdue }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">
        {isLibrarian ? "All Borrowings" : "My Borrowings"}
      </h2>
      <div className="flex space-x-3">
        {isLibrarian && overdueCount > 0 && (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
            {overdueCount} overdue
          </span>
        )}
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

export default BorrowingsHeader; 