import React, { useState, useEffect, useCallback } from "react";
import BorrowingsHeader from "./BorrowingsHeader";
import BorrowingsList from "./BorrowingsList";
import BorrowingsSummary from "./BorrowingsSummary";
import ErrorDisplay from "./ErrorDisplay";
import Notification from "../../../components/Notification";
import { useBorrowings } from "../hooks/useBorrowings";

const Borrowings = ({ user }) => {
  const [overdueBorrowings, setOverdueBorrowings] = useState([]);
  const [showOverdue, setShowOverdue] = useState(false);
  const [notification, setNotification] = useState(null);

  const {
    borrowings,
    loading,
    error,
    isSubmitting,
    returnBook,
    getMyOverdue,
    getOverdue,
  } = useBorrowings();

  const isLibrarian = user?.user_type === "librarian";

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const loadOverdueBorrowings = useCallback(async () => {
    try {
      const overdue = isLibrarian ? await getOverdue() : await getMyOverdue();
      setOverdueBorrowings(overdue);
    } catch (err) {
      console.error("Failed to load overdue borrowings:", err);
    }
  }, [isLibrarian, getOverdue, getMyOverdue]);

  const handleReturn = async (borrowingId) => {
    try {
      await returnBook(borrowingId);
      showNotification("Book returned successfully!");
      // Refresh overdue borrowings if showing them
      if (showOverdue) {
        await loadOverdueBorrowings();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to return book";
      showNotification(errorMessage, "error");
    }
  };

  const toggleOverdueView = async () => {
    if (!showOverdue) {
      await loadOverdueBorrowings();
    }
    setShowOverdue(!showOverdue);
  };

  // Load overdue borrowings on mount for librarians
  useEffect(() => {
    if (isLibrarian) {
      loadOverdueBorrowings();
    }
  }, [isLibrarian, loadOverdueBorrowings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600">Loading borrowings...</div>
      </div>
    );
  }

  const activeBorrowings = borrowings.filter(
    (borrowing) => !borrowing.returned_at
  );
  const overdueCount = overdueBorrowings.length;

  return (
    <div className="space-y-6">
      <BorrowingsHeader
        isLibrarian={isLibrarian}
        overdueCount={overdueCount}
        showOverdue={showOverdue}
        onToggleOverdue={toggleOverdueView}
      />

      <ErrorDisplay error={error} />

      <BorrowingsList
        borrowings={showOverdue ? overdueBorrowings : activeBorrowings}
        isLibrarian={isLibrarian}
        onReturn={handleReturn}
        isSubmitting={isSubmitting}
        showOverdue={showOverdue}
        overdueCount={overdueCount}
        activeBorrowingsCount={activeBorrowings.length}
      />

      {!isLibrarian && (
        <BorrowingsSummary
          activeBorrowingsCount={activeBorrowings.length}
          overdueCount={overdueCount}
        />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </div>
  );
};

export default Borrowings;
