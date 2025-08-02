import React from "react";
import BookGrid from "./BookGrid";

const BookList = ({
  books,
  searchQuery,
  isLibrarian,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
  borrowings,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Book Collection ({books.length} books)
            {searchQuery && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - Filtered by "{searchQuery}"
              </span>
            )}
          </h3>
        </div>
      </div>

      <BookGrid
        books={books}
        isLibrarian={isLibrarian}
        onEdit={onEdit}
        onDelete={onDelete}
        onBorrow={onBorrow}
        onReturn={onReturn}
        borrowings={borrowings}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default BookList;
