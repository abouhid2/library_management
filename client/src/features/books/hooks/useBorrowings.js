import { useState, useEffect } from "react";
import { borrowingsAPI } from "../../../services/api";

export const useBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingsAPI.getAll();
      setBorrowings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch borrowings");
      console.error("Error fetching borrowings:", err);
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookId) => {
    setIsSubmitting(true);
    try {
      const response = await borrowingsAPI.borrowBook(bookId);
      await fetchBorrowings(); // Refresh borrowings list
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to borrow book";
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnBook = async (borrowingId) => {
    setIsSubmitting(true);
    try {
      const response = await borrowingsAPI.returnBook(borrowingId);
      await fetchBorrowings(); // Refresh borrowings list
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to return book";
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMyOverdue = async () => {
    try {
      const response = await borrowingsAPI.getMyOverdue();
      return response.data;
    } catch (err) {
      console.error("Error fetching overdue borrowings:", err);
      return [];
    }
  };

  const getOverdue = async () => {
    try {
      const response = await borrowingsAPI.getOverdue();
      return response.data;
    } catch (err) {
      console.error("Error fetching overdue borrowings:", err);
      return [];
    }
  };

  // Check if user has borrowed a specific book
  const hasBorrowedBook = (bookId) => {
    return borrowings.some(
      (borrowing) => borrowing.book_id === bookId && !borrowing.returned_at
    );
  };

  // Get borrowing for a specific book
  const getBorrowingForBook = (bookId) => {
    return borrowings.find(
      (borrowing) => borrowing.book_id === bookId && !borrowing.returned_at
    );
  };

  // Fetch borrowings on mount
  useEffect(() => {
    fetchBorrowings();
  }, []);

  return {
    borrowings,
    loading,
    error,
    isSubmitting,
    borrowBook,
    returnBook,
    getMyOverdue,
    getOverdue,
    hasBorrowedBook,
    getBorrowingForBook,
    setError,
    refreshBorrowings: fetchBorrowings,
  };
};
