import React from "react";
import BorrowButton from "./BorrowButton";
import BookForm from "../BookForm";

const BookCard = ({
  book,
  isLibrarian,
  isBorrowed,
  activeBorrowings,
  isEditing,
  isSubmitting,
  onEdit,
  onDelete,
  onBorrow,
  onSubmitEdit,
  onCancelEdit,
}) => {
  // Check if book should be disabled for members
  const isDisabled =
    !isLibrarian && (isBorrowed || book.available_copies === 0);

  // If this book is being edited, show the inline form
  if (isEditing && isLibrarian) {
    return (
      <div className="col-span-1">
        <BookForm
          onSubmit={onSubmitEdit}
          onCancel={onCancelEdit}
          editingBook={book}
          isSubmitting={isSubmitting}
          isInline={true}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 group ${
        isDisabled
          ? "bg-gray-100 opacity-60 grayscale cursor-not-allowed"
          : "bg-white hover:shadow-xl"
      }`}
    >
      {/* Book Cover Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={`Cover of ${book.title}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isDisabled ? "" : "group-hover:scale-105"
            }`}
            onError={(e) => {
              // Hide the image and show the placeholder div instead
              e.target.style.display = "none";
              const placeholder =
                e.target.parentElement.querySelector(".book-placeholder");
              if (placeholder) {
                placeholder.style.display = "flex";
              }
            }}
          />
        ) : null}
        {/* CSS-based placeholder */}
        <div
          className={`book-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 text-center p-4 ${
            book.image_url ? "hidden" : "flex"
          }`}
        >
          <div>
            <div className="text-4xl mb-2">📚</div>
            <div className="text-sm font-medium leading-tight">
              {book.title}
            </div>
          </div>
        </div>
        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              book.available_copies > 0
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {book.available_copies > 0 ? "Available" : "Out of Stock"}
          </span>
        </div>
        {/* Copies Info */}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-black bg-opacity-75 text-white">
            {book.available_copies}/{book.total_copies}
          </span>
        </div>
        {/* Disabled overlay for members */}
        {isDisabled && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-lg px-3 py-2 text-center">
              <div className="text-sm font-semibold text-gray-700">
                {isBorrowed ? "Already Borrowed" : "Out of Stock"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4 space-y-2">
        <h3
          className={`font-semibold text-sm line-clamp-2 transition-colors duration-200 ${
            isDisabled
              ? "text-gray-500"
              : "text-secondary group-hover:text-highlight"
          }`}
        >
          {book.title}
        </h3>
        <p
          className={`text-xs line-clamp-1 ${
            isDisabled ? "text-gray-400" : "text-neutral"
          }`}
        >
          by {book.author}
        </p>
        <p
          className={`text-xs line-clamp-1 ${
            isDisabled ? "text-gray-400" : "text-neutral"
          }`}
        >
          {book.genre}
        </p>

        {/* Actions */}
        <div className="pt-2 space-y-2">
          {isLibrarian ? (
            // Librarian actions
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(book)}
                className="flex-1 bg-highlight hover:bg-accent text-secondary text-xs font-medium py-2 px-3 rounded transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(book.id)}
                disabled={activeBorrowings.length > 0}
                className={`flex-1 text-xs font-medium py-2 px-3 rounded transition-colors duration-200 ${
                  activeBorrowings.length > 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                title={
                  activeBorrowings.length > 0
                    ? "Cannot delete: Book is currently borrowed"
                    : "Delete book"
                }
              >
                Delete
              </button>
            </div>
          ) : (
            // Member actions
            <BorrowButton
              book={book}
              isBorrowed={isBorrowed}
              onBorrow={onBorrow}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
