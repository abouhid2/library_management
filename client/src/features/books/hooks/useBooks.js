import { useState, useEffect } from "react";
import { booksAPI } from "../../../services/api";

export const useBooks = (searchQuery = "") => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBooks = async (searchParams = {}) => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll(searchParams);
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch books");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData) => {
    setIsSubmitting(true);
    try {
      await booksAPI.create(bookData);
      await fetchBooks({ search: searchQuery });
      return true;
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateBook = async (bookId, bookData) => {
    setIsSubmitting(true);
    try {
      await booksAPI.update(bookId, bookData);
      await fetchBooks({ search: searchQuery });
      return true;
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await booksAPI.delete(bookId);
      await fetchBooks({ search: searchQuery });
    } catch (err) {
      setError("Failed to delete book");
      console.error("Error deleting book:", err);
    }
  };

  // Fetch books when search query changes
  useEffect(() => {
    fetchBooks({ search: searchQuery });
  }, [searchQuery]);

  return {
    books,
    loading,
    error,
    isSubmitting,
    createBook,
    updateBook,
    deleteBook,
    setError,
  };
};
