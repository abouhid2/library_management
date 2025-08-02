import React from "react";

const EmptyState = ({ filter, isLibrarian }) => {
  const getMessage = () => {
    if (filter === "all") {
      return `No books found. ${
        isLibrarian && "Add your first book to get started!"
      }`;
    }
    return `No ${filter} books found.`;
  };

  return (
    <div className="px-6 py-8 text-center text-gray-500">{getMessage()}</div>
  );
};

export default EmptyState;
