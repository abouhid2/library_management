import React, { useState } from "react";
import BookForm from "./BookForm";
import BookHeader from "./BookHeader";
import BookList from "./BookList";
import ErrorDisplay from "./ErrorDisplay";
import Notification from "../../../components/Notification";
import { useBooks } from "../hooks/useBooks";
import { useBorrowings } from "../hooks/useBorrowings";

const Books = ({ user, searchQuery = "" }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [notification, setNotification] = useState(null);

  const {
    books,
    loading,
    error,
    isSubmitting: isBookSubmitting,
    createBook,
    updateBook,
    deleteBook,
    setError,
    refreshBooks,
  } = useBooks(searchQuery);

  const {
    borrowings,
    loading: borrowingsLoading,
    error: borrowingsError,
    isSubmitting: isBorrowingSubmitting,
    borrowBook,
    returnBook,
  } = useBorrowings();

  const isLibrarian = user?.user_type === "librarian";

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const handleSubmit = async (bookData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
        showNotification("Book updated successfully!");
      } else {
        await createBook(bookData);
        showNotification("Book created successfully!");
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save book");
      throw err; // Re-throw to let BookForm handle field-specific errors
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }
    try {
      await deleteBook(bookId);
      showNotification("Book deleted successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to delete book";
      showNotification(errorMessage, "error");
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook(bookId);
      await refreshBooks();
      showNotification("Book borrowed successfully! Due in 2 weeks.");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to borrow book";
      showNotification(errorMessage, "error");
    }
  };

  const handleReturn = async (borrowingId) => {
    try {
      await returnBook(borrowingId);
      await refreshBooks();
      showNotification("Book returned successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to return book";
      showNotification(errorMessage, "error");
    }
  };

  const resetForm = () => {
    setEditingBook(null);
    setShowForm(false);
    setError(null);
  };

  if (loading || borrowingsLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BookHeader
        isLibrarian={isLibrarian}
        onAddBook={() => setShowForm(true)}
        books={books}
        searchQuery={searchQuery}
      />

      <ErrorDisplay error={error} />
      <ErrorDisplay error={borrowingsError} />

      {showForm && (
        <BookForm
          onSubmit={handleSubmit}
          onCancel={resetForm}
          editingBook={editingBook}
          isSubmitting={isBookSubmitting}
        />
      )}

      <BookList
        books={books}
        searchQuery={searchQuery}
        isLibrarian={isLibrarian}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
        borrowings={borrowings}
        isSubmitting={isBorrowingSubmitting}
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

export default Books;
