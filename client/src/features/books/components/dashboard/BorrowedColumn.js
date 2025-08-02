import React, { useState, useEffect, useRef } from "react";

const BorrowedColumn = ({ borrowings }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!borrowings || borrowings.length === 0) {
    return <span className="text-gray-400">Not borrowed</span>;
  }

  const firstBorrowing = borrowings[0];
  const additionalCount = borrowings.length - 1;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative flex" ref={dropdownRef}>
      {/* Main display with first borrower */}
      <div className="space-y-1">
        <div className="font-medium text-gray-900">
          {firstBorrowing.user?.name || "Unknown User"}
        </div>
        <div className="text-xs text-gray-500">
          Borrowed: {new Date(firstBorrowing.borrowed_at).toLocaleDateString()}
        </div>
        {firstBorrowing.due_at && (
          <div
            className={`text-xs ${
              new Date(firstBorrowing.due_at) < new Date()
                ? "text-red-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Due: {new Date(firstBorrowing.due_at).toLocaleDateString()}
          </div>
        )}
      </div>

      {additionalCount > 0 && (
        <div className="mt-2">
          <button
            onClick={toggleDropdown}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-secondary bg-primary hover:bg-primary-hover rounded-md transition-colors duration-200"
          >
            +{additionalCount}
            <svg
              className={`ml-1 w-3 h-3 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg transform transition-all duration-200 ease-out">
              <div className="py-2">
                {borrowings.slice(1).map((borrowing) => (
                  <div
                    key={borrowing.id}
                    className="px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">
                      {borrowing.user?.name || "Unknown User"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Borrowed:{" "}
                      {new Date(borrowing.borrowed_at).toLocaleDateString()}
                    </div>
                    {borrowing.due_at && (
                      <div
                        className={`text-xs ${
                          new Date(borrowing.due_at) < new Date()
                            ? "text-red-600 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        Due: {new Date(borrowing.due_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowedColumn;
