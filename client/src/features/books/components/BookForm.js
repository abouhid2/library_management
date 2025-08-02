import React, { useState } from "react";

const BookForm = ({ onSubmit, onCancel, editingBook, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: editingBook?.title || "",
    author: editingBook?.author || "",
    genre: editingBook?.genre || "",
    isbn: editingBook?.isbn || "",
    total_copies: editingBook?.total_copies?.toString() || "",
    available_copies: editingBook?.available_copies?.toString() || "",
    image: editingBook?.image || "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookData = {
        ...formData,
        total_copies: parseInt(formData.total_copies),
        available_copies: parseInt(formData.available_copies),
      };

      await onSubmit(bookData);

      // Reset form on success
      setFormData({
        title: "",
        author: "",
        genre: "",
        isbn: "",
        total_copies: "",
        available_copies: "",
        image: "",
      });
      setFieldErrors({});
    } catch (err) {
      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const newFieldErrors = {};

        // Parse backend errors and map them to field names
        backendErrors.forEach((errorMessage) => {
          if (errorMessage.includes("Title")) {
            newFieldErrors.title = errorMessage;
          } else if (errorMessage.includes("Author")) {
            newFieldErrors.author = errorMessage;
          } else if (errorMessage.includes("Genre")) {
            newFieldErrors.genre = errorMessage;
          } else if (
            errorMessage.includes("ISBN") ||
            errorMessage.includes("Isbn")
          ) {
            newFieldErrors.isbn = errorMessage;
          } else if (errorMessage.includes("Total copies")) {
            newFieldErrors.total_copies = errorMessage;
          } else if (errorMessage.includes("Available copies")) {
            newFieldErrors.available_copies = errorMessage;
          } else if (errorMessage.includes("Image")) {
            newFieldErrors.image = errorMessage;
          }
        });

        setFieldErrors(newFieldErrors);
      }
      throw err; // Re-throw to let parent handle general errors
    }
  };

  const getFieldClassName = (fieldName) => {
    return `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
      fieldErrors[fieldName]
        ? "border-red-300 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingBook ? "Edit Book" : "Add New Book"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={getFieldClassName("title")}
            />
            {fieldErrors.title && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              className={getFieldClassName("author")}
            />
            {fieldErrors.author && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.author}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre *
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              required
              className={getFieldClassName("genre")}
            />
            {fieldErrors.genre && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.genre}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN *
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              required
              className={getFieldClassName("isbn")}
            />
            {fieldErrors.isbn && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.isbn}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Copies *
            </label>
            <input
              type="number"
              name="total_copies"
              value={formData.total_copies}
              onChange={handleInputChange}
              required
              min="0"
              className={getFieldClassName("total_copies")}
            />
            {fieldErrors.total_copies && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.total_copies}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Copies *
            </label>
            <input
              type="number"
              name="available_copies"
              value={formData.available_copies}
              onChange={handleInputChange}
              required
              min="0"
              className={getFieldClassName("available_copies")}
            />
            {fieldErrors.available_copies && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.available_copies}
              </p>
            )}
          </div>
        </div>

        {/* Image URL field - full width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/book-cover.jpg"
            className={getFieldClassName("image")}
          />
          <p className="text-gray-500 text-xs mt-1">
            Leave empty to use a placeholder image with the book title
          </p>
          {fieldErrors.image && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.image}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium transition-colors duration-200"
          >
            {isSubmitting
              ? "Saving..."
              : editingBook
              ? "Update Book"
              : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
