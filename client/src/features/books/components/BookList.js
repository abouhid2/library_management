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
