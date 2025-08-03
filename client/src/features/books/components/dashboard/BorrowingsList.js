import React, { useState, useMemo } from "react";
import SearchBar from "../../../../components/SearchBar";
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by book title, author, user name or email"
      />
      <BorrowingsTable
        borrowings={filteredBorrowings}
        isLibrarian={isLibrarian}
        onReturn={onReturn}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default BorrowingsList;
