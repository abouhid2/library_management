import React, { useState } from "react";
import BookForm from "./BookForm";
import BookTable from "./BookTable";
import { useBooks } from "../hooks/useBooks";

const Books = ({ user, searchQuery = "" }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const {
    books,
    loading,
    error,
    isSubmitting,
    createBook,
    updateBook,
    deleteBook,
    setError,
  } = useBooks(searchQuery);

  const isLibrarian = user?.user_type === "librarian";

  const handleSubmit = async (bookData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
      } else {
        await createBook(bookData);
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
    await deleteBook(bookId);
  };

  const resetForm = () => {
    setEditingBook(null);
    setShowForm(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Books</h2>
        {isLibrarian && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Add New Book
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Book Form */}
      {showForm && (
        <BookForm
          onSubmit={handleSubmit}
          onCancel={resetForm}
          editingBook={editingBook}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Books List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Book Collection ({books.length} books)
            {searchQuery && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - Filtered by "{searchQuery}"
              </span>
            )}
          </h3>
        </div>
        <BookTable
          books={books}
          isLibrarian={isLibrarian}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Books;
