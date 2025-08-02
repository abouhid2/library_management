import React, { useState } from "react";
import { useFormErrors } from "../../../hooks/useFormErrors";

const BookForm = ({
  onSubmit,
  onCancel,
  editingBook,
  isSubmitting,
  isInline = false,
}) => {
  const [formData, setFormData] = useState({
    title: editingBook?.title || "",
    author: editingBook?.author || "",
    genre: editingBook?.genre || "",
    isbn: editingBook?.isbn || "",
    total_copies: editingBook?.total_copies?.toString() || "",
    available_copies: editingBook?.available_copies?.toString() || "",
    image: editingBook?.image || "",
  });

  // Use the custom error handling hook
  const { fieldErrors, clearErrors, handleApiError } = useFormErrors({
    title: "title",
    author: "author",
    genre: "genre",
    isbn: "isbn",
    total_copies: "total_copies",
    available_copies: "available_copies",
    image: "image",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      clearErrors();
    } catch (err) {
      // Use the custom error handler
      handleApiError(err);
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

  if (isInline) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-3">Edit Book</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Display general errors */}
          {fieldErrors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    There were errors with your submission
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {Array.isArray(fieldErrors.general) ? (
                        fieldErrors.general.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))
                      ) : (
                        <li>{fieldErrors.general}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.author}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded text-xs font-medium transition-colors duration-200"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingBook ? "Edit Book" : "Add New Book"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display general errors */}
        {fieldErrors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There were errors with your submission
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {Array.isArray(fieldErrors.general) ? (
                      fieldErrors.general.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))
                    ) : (
                      <li>{fieldErrors.general}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
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
