import React, { useState } from "react";

const ImageUpload = ({
  onImageChange,
  onImageRemove,
  imagePreview,
  error,
  accept = "image/jpeg,image/png,image/gif,image/webp",
  maxSize = 5 * 1024 * 1024, // 5MB
  id = "image-upload",
}) => {
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!validTypes.includes(file.type)) {
      return "Image must be a JPEG, PNG, GIF, or WebP";
    }

    if (file.size > maxSize) {
      return `Image is too big (should be less than ${Math.round(
        maxSize / (1024 * 1024)
      )}MB)`;
    }

    return null;
  };

  const handleFileSelect = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      onImageChange(null, validationError);
      return;
    }

    onImageChange(file, null);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const getFieldClassName = () => {
    return `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
      error
        ? "border-red-300 focus:ring-red-500"
        : dragActive
        ? "border-blue-300 focus:ring-blue-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cover Image
      </label>

      {/* File Input */}
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        className={`${getFieldClassName()} cursor-pointer transition-colors ${
          dragActive ? "bg-blue-50" : "bg-white"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById(id).click()}
      >
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Accepted formats: JPEG, PNG, GIF, WebP (max{" "}
              {Math.round(maxSize / (1024 * 1024))}MB)
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Preview
          </label>
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Book cover preview"
              className="w-32 h-40 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={onImageRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
