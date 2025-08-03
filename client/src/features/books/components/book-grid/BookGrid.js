import React, { useState } from "react";
import BookFilter from "./BookFilter";
import BookCard from "./BookCard";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import SortControl from "../../../../components/SortControl";
import useBookFilter from "./useBookFilter";
import usePagination from "./usePagination";
import useSorting from "../../hooks/useSorting";

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

  // Sort options for books
  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" },
    { value: "genre", label: "Genre" },
    { value: "available_copies", label: "Available Copies" },
    { value: "total_copies", label: "Total Copies" },
  ];

  // Use custom hooks for filtering and pagination
  const { filteredBooks, isBookBorrowed } = useBookFilter(
    books,
    filter,
    borrowings,
    isLibrarian
  );

  // Apply sorting to filtered results
  const {
    sortedItems: sortedBooks,
    sortField,
    sortDirection,
    handleSortChange,
  } = useSorting(filteredBooks, "title", "asc");

  const {
    currentPage,
    paginatedItems: currentBooks,
    totalPages,
    handlePageChange: paginationHandlePageChange,
    resetPagination,
  } = usePagination(sortedBooks);

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

  const handleSortChangeLocal = (field, direction) => {
    handleSortChange(field, direction);
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
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        {/* Filter Controls - Only show for members */}
        {!isLibrarian && (
          <BookFilter
            currentFilter={filter}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Sort Controls */}
        <SortControl
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChangeLocal}
          sortOptions={sortOptions}
        />
      </div>

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
