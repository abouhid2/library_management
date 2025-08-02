import { useState, useEffect } from "react";
import { booksAPI } from "../../../services/api";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
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
      await fetchBooks();
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
      await fetchBooks();
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
      await fetchBooks();
    } catch (err) {
      setError("Failed to delete book");
      console.error("Error deleting book:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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
