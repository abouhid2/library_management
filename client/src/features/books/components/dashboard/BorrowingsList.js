import React, { useState, useMemo } from "react";
import SearchBar from "../../../../components/SearchBar";
import SortControl from "../../../../components/SortControl";
import useSorting from "../../hooks/useSorting";
import BorrowingsTable from "./BorrowingsTable";

const BorrowingsList = ({
  borrowings,
  isLibrarian,
  onReturn,
  isSubmitting,
  showOverdue,
  overdueCount,
  activeBorrowingsCount,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sort options for borrowings
  const sortOptions = [
    { value: "book.title", label: "Book Title" },
    { value: "book.author", label: "Author" },
    { value: "user.name", label: "Borrower" },
    { value: "borrowed_at", label: "Borrowed Date" },
    { value: "due_at", label: "Due Date" },
  ];

  // Apply search filter first
  const filteredBorrowings = useMemo(() => {
    if (!searchQuery.trim()) {
      return borrowings;
    }

    const query = searchQuery.toLowerCase();
    return borrowings.filter((borrowing) => {
      const bookTitle = borrowing.book?.title?.toLowerCase() || "";
      const bookAuthor = borrowing.book?.author?.toLowerCase() || "";
      const userName = borrowing.user?.name?.toLowerCase() || "";
      const userEmail = borrowing.user?.email?.toLowerCase() || "";

      return (
        bookTitle.includes(query) ||
        bookAuthor.includes(query) ||
        userName.includes(query) ||
        userEmail.includes(query)
      );
    });
  }, [borrowings, searchQuery]);

  // Apply sorting to filtered results
  const {
    sortedItems: sortedBorrowings,
    sortField,
    sortDirection,
    handleSortChange,
  } = useSorting(filteredBorrowings, "borrowed_at", "desc");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by book title, author, user name or email"
      />

      {/* Sort Controls */}
      <div className="px-4 py-3 border-b border-gray-200">
        <SortControl
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
        />
      </div>

      <BorrowingsTable
        borrowings={sortedBorrowings}
        isLibrarian={isLibrarian}
        onReturn={onReturn}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default BorrowingsList;
