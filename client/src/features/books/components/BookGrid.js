import React, { useState } from "react";
import BorrowButton from "./BorrowButton";

const BookGrid = ({
  books,
  isLibrarian,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
  borrowings = [],
  isSubmitting = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 9;

  if (books.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        No books found. {isLibrarian && "Add your first book to get started!"}
      </div>
    );
  }

  // Helper function to check if a book is borrowed by current user
  const isBookBorrowed = (bookId) => {
    return borrowings.some(
      (borrowing) => borrowing.book_id === bookId && !borrowing.returned_at
    );
  };

  // Helper function to get all active borrowings for a book (for librarians)
  const getActiveBorrowingsForBook = (bookId) => {
    return borrowings.filter(
      (borrowing) => borrowing.book_id === bookId && !borrowing.returned_at
    );
  };

  // Calculate pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-2">
      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
        {currentBooks.map((book) => {
          const isBorrowed = isBookBorrowed(book.id);
          const activeBorrowings = getActiveBorrowingsForBook(book.id);

          return (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Book Cover Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Hide the image and show the placeholder div instead
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                {/* CSS-based placeholder */}
                <div
                  className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 text-center p-4 ${
                    book.image_url ? "hidden" : "flex"
                  }`}
                  style={{ display: book.image_url ? "none" : "flex" }}
                >
                  <div>
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-sm font-medium leading-tight">
                      {book.title}
                    </div>
                  </div>
                </div>
                {/* Availability Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      book.available_copies > 0
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {book.available_copies > 0 ? "Available" : "Out of Stock"}
                  </span>
                </div>
                {/* Copies Info */}
                <div className="absolute bottom-2 left-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-black bg-opacity-75 text-white">
                    {book.available_copies}/{book.total_copies}
                  </span>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-xs line-clamp-1">
                  by {book.author}
                </p>
                <p className="text-gray-500 text-xs line-clamp-1">
                  {book.genre}
                </p>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  {isLibrarian ? (
                    // Librarian actions
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(book)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(book.id)}
                        disabled={activeBorrowings.length > 0}
                        className={`flex-1 text-xs font-medium py-2 px-3 rounded transition-colors duration-200 ${
                          activeBorrowings.length > 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                        title={
                          activeBorrowings.length > 0
                            ? "Cannot delete: Book is currently borrowed"
                            : "Delete book"
                        }
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    // Member actions
                    <BorrowButton
                      book={book}
                      isBorrowed={isBorrowed}
                      onBorrow={onBorrow}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookGrid;
