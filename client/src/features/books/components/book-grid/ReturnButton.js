import React, { useState } from "react";

const ReturnButton = ({
  borrowing,
  onReturn,
  isSubmitting,
  disabled = false,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReturnClick = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
      return;
    }

    try {
      await onReturn(borrowing.id);
      setShowConfirm(false);
    } catch (error) {
      setShowConfirm(false);
      // Error is handled by the parent component
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // Show confirmation dialog
  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleReturnClick}
          disabled={isSubmitting || disabled}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-md transition-colors duration-200"
        >
          {isSubmitting ? "Returning..." : "Confirm Return"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-md transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    );
  }

  // Show return button
  return (
    <button
      onClick={handleReturnClick}
      disabled={isSubmitting || disabled}
      className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 bg-green-100 hover:bg-green-200 disabled:bg-green-50 disabled:text-green-400 rounded-md transition-colors duration-200"
    >
      {isSubmitting ? "Returning..." : "Return"}
    </button>
  );
};

export default ReturnButton;
