import React from "react";
import { useBookForm } from "../hooks/useBookForm";
import { BookFormFields, ImageUpload, ErrorDisplay, FormActions } from "./form";

const BookForm = ({
  onSubmit,
  onCancel,
  editingBook,
  isSubmitting,
  isInline = false,
}) => {
  const {
    formData,
    imagePreview,
    fieldErrors,
    handleInputChange,
    handleImageChange,
    handleImageRemove,
    handleSubmit,
  } = useBookForm(editingBook, onSubmit);

  const getSubmitText = () => {
    if (isSubmitting) return "Saving...";
    return editingBook ? "Update Book" : "Add Book";
  };

  if (isInline) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-3">Edit Book</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <ErrorDisplay errors={fieldErrors.general} />

          <BookFormFields
            formData={formData}
            fieldErrors={fieldErrors}
            handleInputChange={handleInputChange}
            isInline={true}
          />

          <ImageUpload
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
            imagePreview={imagePreview}
            error={fieldErrors.image}
            isInline={true}
          />

          <FormActions
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitText="Save"
            isInline={true}
          />
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
        <ErrorDisplay errors={fieldErrors.general} />

        <BookFormFields
          formData={formData}
          fieldErrors={fieldErrors}
          handleInputChange={handleInputChange}
        />

        <ImageUpload
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          imagePreview={imagePreview}
          error={fieldErrors.image}
        />

        <FormActions
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          submitText={getSubmitText()}
        />
      </form>
    </div>
  );
};

export default BookForm;
