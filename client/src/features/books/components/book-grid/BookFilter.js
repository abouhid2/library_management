import React from "react";

const BookFilter = ({ currentFilter, onFilterChange }) => {
  const filterOptions = [
    { value: "all", label: "All Books" },
    { value: "available", label: "Available to Borrow" },
    { value: "borrowed", label: "My Borrowed Books" },
  ];

  return (
    <div className="flex justify-center space-x-2">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            currentFilter === option.value
              ? "bg-highlight text-secondary"
              : "bg-white text-neutral hover:bg-primary border border-neutral"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default BookFilter;
