import React from "react";

const BookHeader = ({ isLibrarian, onAddBook, books, searchQuery }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-secondary">
        Books ({books.length})
        {searchQuery && (
          <span className="text-sm font-normal text-neutral ml-2">
            - Filtered by "{searchQuery}"
          </span>
        )}
      </h2>
      {isLibrarian && (
        <button
          onClick={onAddBook}
          className="bg-highlight hover:bg-accent text-secondary px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Add New Book
        </button>
      )}
    </div>
  );
};

export default BookHeader;
