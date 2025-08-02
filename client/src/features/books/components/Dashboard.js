import React, { useState, useEffect, useCallback } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import BorrowingsList from "./BorrowingsList";
import ErrorDisplay from "./ErrorDisplay";
import Notification from "../../../components/Notification";
import { useBorrowings } from "../hooks/useBorrowings";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard = ({ user }) => {
  const [overdueBorrowings, setOverdueBorrowings] = useState([]);
  const [showOverdue, setShowOverdue] = useState(false);
  const [notification, setNotification] = useState(null);

  const {
    borrowings,
    loading: borrowingsLoading,
    error: borrowingsError,
    isSubmitting,
    returnBook,
    getMyOverdue,
    getOverdue,
  } = useBorrowings();

  const isLibrarian = user?.user_type === "librarian";
  const {
    stats: dashboardStats,
    loading: statsLoading,
    error: statsError,
    refreshStats,
  } = useDashboard(isLibrarian);

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
      // Refresh dashboard stats
      await refreshStats();
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
      const loadInitialOverdue = async () => {
        try {
          const overdue = await getOverdue();
          setOverdueBorrowings(overdue);
        } catch (err) {
          console.error("Failed to load overdue borrowings:", err);
        }
      };
      loadInitialOverdue();
    }
  }, [isLibrarian, getOverdue]);

  if (borrowingsLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const activeBorrowings = borrowings.filter(
    (borrowing) => !borrowing.returned_at
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        isLibrarian={isLibrarian}
        overdueCount={dashboardStats.overdue_count || 0}
        showOverdue={showOverdue}
        onToggleOverdue={toggleOverdueView}
      />

      <DashboardStats stats={dashboardStats} isLibrarian={isLibrarian} />

      <ErrorDisplay error={borrowingsError || statsError} />

      <BorrowingsList
        borrowings={showOverdue ? overdueBorrowings : activeBorrowings}
        isLibrarian={isLibrarian}
        onReturn={handleReturn}
        isSubmitting={isSubmitting}
        showOverdue={showOverdue}
        overdueCount={dashboardStats.overdue_count || 0}
        activeBorrowingsCount={activeBorrowings.length}
      />

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

export default Dashboard;
