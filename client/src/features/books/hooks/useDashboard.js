import { useState, useEffect } from "react";
import { dashboardAPI } from "../../../services/api";

export const useDashboard = (isLibrarian) => {
  const [stats, setStats] = useState({
    total_books: 0,
    total_borrowed: 0,
    books_due_today: 0,
    overdue_count: 0,
    overdue_borrowings: [],
    my_borrowings: [],
    my_overdue_borrowings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = isLibrarian
        ? await dashboardAPI.getLibrarianStats()
        : await dashboardAPI.getMemberStats();

      setStats(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch dashboard statistics");
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [isLibrarian]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};
