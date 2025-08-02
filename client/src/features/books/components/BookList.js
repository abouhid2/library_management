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
  onSubmitEdit,
  onCancelEdit,
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
        onSubmitEdit={onSubmitEdit}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
};

export default BookList;
