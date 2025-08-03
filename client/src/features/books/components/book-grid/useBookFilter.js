import { useMemo } from "react";

const useBookFilter = (books, filter, borrowings, isLibrarian) => {
  // Helper function to check if a book is borrowed by current user
  const isBookBorrowed = (bookId) => {
    return borrowings.some(
      (borrowing) => borrowing.book_id === bookId && !borrowing.returned_at
    );
  };

  const filteredBooks = useMemo(() => {
    if (isLibrarian || filter === "all") {
      return books;
    }

    return books.filter((book) => {
      const isBorrowed = isBookBorrowed(book.id);
      const isAvailable = book.available_copies > 0;

      if (filter === "available") {
        return isAvailable && !isBorrowed;
      } else if (filter === "borrowed") {
        return isBorrowed;
      }

      return true;
    });
  }, [books, filter, borrowings, isLibrarian]);

  return { filteredBooks, isBookBorrowed };
};

export default useBookFilter;
