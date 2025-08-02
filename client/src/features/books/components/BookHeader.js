import React from "react";

const BookHeader = ({ isLibrarian, onAddBook }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">Books</h2>
      {isLibrarian && (
        <button
          onClick={onAddBook}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Add New Book
        </button>
      )}
    </div>
  );
};

export default BookHeader; 