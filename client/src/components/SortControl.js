import React from "react";

const SortControl = ({
  sortField,
  sortDirection,
  onSortChange,
  sortOptions,
  className = "",
}) => {
  const handleSortChange = (field) => {
    let newDirection = "asc";

    // If clicking the same field, toggle direction
    if (field === sortField) {
      newDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    onSortChange(field, newDirection);
  };

  const getSortIcon = (field) => {
    if (field !== sortField) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    if (sortDirection === "asc") {
      return (
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-4 h-4 text-blue-600"
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
    );
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <div className="flex items-center space-x-1">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors ${
              sortField === option.value
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
            }`}
            data-testid={`sort-${option.value}`}
          >
            <span>{option.label}</span>
            {getSortIcon(option.value)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortControl;
