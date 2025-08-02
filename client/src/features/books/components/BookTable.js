import React from "react";
import BorrowButton from "./BorrowButton";
import BorrowedColumn from "./BorrowedColumn";

const BookTable = ({
  books,
  isLibrarian,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
  borrowings = [],
  isSubmitting = false,
}) => {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Genre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ISBN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Copies
            </th>
            {isLibrarian && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrowed By
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => {
            const isBorrowed = isBookBorrowed(book.id);
            const activeBorrowings = getActiveBorrowingsForBook(book.id);

            return (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {book.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {book.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {book.genre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {book.isbn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      book.available_copies > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.available_copies}/{book.total_copies} available
                  </span>
                </td>
                {isLibrarian && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <BorrowedColumn borrowings={activeBorrowings} />
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {isLibrarian ? (
                    // Librarian actions
                    <>
                      <button
                        onClick={() => onEdit(book)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(book.id)}
                        disabled={activeBorrowings.length > 0}
                        className={`transition-colors duration-200 ${
                          activeBorrowings.length > 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:text-red-900"
                        }`}
                        title={
                          activeBorrowings.length > 0
                            ? "Cannot delete: Book is currently borrowed"
                            : "Delete book"
                        }
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    // Member actions
                    <BorrowButton
                      book={book}
                      isBorrowed={isBorrowed}
                      onBorrow={onBorrow}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
