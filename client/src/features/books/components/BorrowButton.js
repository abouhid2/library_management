import React, { useState } from "react";

const BorrowButton = ({
  book,
  isBorrowed,
  onBorrow,
  isSubmitting,
  disabled = false,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBorrowClick = async () => {
    if (isBorrowed) {
      return; // Already borrowed
    }

    if (book.available_copies <= 0) {
      return; // No copies available
    }

    if (!showConfirm) {
      setShowConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
      return;
    }

    try {
      await onBorrow(book.id);
      setShowConfirm(false);
    } catch (error) {
      setShowConfirm(false);
      // Error is handled by the parent component
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // If already borrowed, show borrowed status
  if (isBorrowed) {
    return (
      <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
        ✓ Borrowed
      </span>
    );
  }

  // If no copies available, show unavailable status
  if (book.available_copies <= 0) {
    return (
      <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
        Unavailable
      </span>
    );
  }

  // Show confirmation dialog
  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleBorrowClick}
          disabled={isSubmitting || disabled}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md transition-colors duration-200"
        >
          {isSubmitting ? "Borrowing..." : "Confirm"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-md transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    );
  }

  // Show borrow button
  return (
    <button
      onClick={handleBorrowClick}
      disabled={isSubmitting || disabled}
      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 rounded-md transition-colors duration-200"
    >
      {isSubmitting ? "Borrowing..." : "Borrow"}
    </button>
  );
};

export default BorrowButton;
