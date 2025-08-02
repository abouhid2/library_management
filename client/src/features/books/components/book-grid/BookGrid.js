import React, { useState } from "react";
import BookFilter from "./BookFilter";
import BookCard from "./BookCard";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import useBookFilter from "./useBookFilter";
import usePagination from "./usePagination";

const BookGrid = ({
  books,
  isLibrarian,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
  borrowings = [],
  isSubmitting = false,
  onSubmitEdit,
  onCancelEdit,
}) => {
  const [filter, setFilter] = useState("all");
  const [editingBookId, setEditingBookId] = useState(null);

  // Use custom hooks for filtering and pagination
  const { filteredBooks, isBookBorrowed } = useBookFilter(
    books,
    filter,
    borrowings,
    isLibrarian
  );
  const {
    currentPage,
    paginatedItems: currentBooks,
    totalPages,
    handlePageChange: paginationHandlePageChange,
    resetPagination,
  } = usePagination(filteredBooks);

  // Helper function to get all active borrowings for a book (for librarians)
  const getActiveBorrowingsForBook = (bookId) => {
    return borrowings.filter(
      (borrowing) => borrowing.book_id === bookId && !borrowing.returned_at
    );
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    resetPagination();
    setEditingBookId(null);
  };

  const handleEditClick = (book) => {
    setEditingBookId(book.id);
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleSubmitEdit = async (bookData) => {
    try {
      await onSubmitEdit(editingBookId, bookData);
      setEditingBookId(null);
    } catch (error) {
      // Error handling is done in the parent component
      throw error;
    }
  };

  const handlePageChange = (pageNumber) => {
    paginationHandlePageChange(pageNumber);
    setEditingBookId(null);
  };

  if (filteredBooks.length === 0) {
    return <EmptyState filter={filter} isLibrarian={isLibrarian} />;
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls - Only show for members */}
      {!isLibrarian && (
        <BookFilter
          currentFilter={filter}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
        {currentBooks.map((book) => {
          const isBorrowed = isBookBorrowed(book.id);
          const activeBorrowings = getActiveBorrowingsForBook(book.id);
          const isEditing = editingBookId === book.id;

          return (
            <BookCard
              key={book.id}
              book={book}
              isLibrarian={isLibrarian}
              isBorrowed={isBorrowed}
              activeBorrowings={activeBorrowings}
              isEditing={isEditing}
              isSubmitting={isSubmitting}
              onEdit={handleEditClick}
              onDelete={onDelete}
              onBorrow={onBorrow}
              onSubmitEdit={handleSubmitEdit}
              onCancelEdit={handleCancelEdit}
            />
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BookGrid;
