import React from "react";
import { FormField } from "./index";

const BookFormFields = ({
  formData,
  fieldErrors,
  handleInputChange,
  isInline = false,
}) => {
  const gridCols = isInline ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";

  return (
    <div className={`grid ${gridCols} gap-4`}>
      <FormField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        required
        error={fieldErrors.title}
      />

      <FormField
        label="Author"
        name="author"
        value={formData.author}
        onChange={handleInputChange}
        required
        error={fieldErrors.author}
      />

      <FormField
        label="Genre"
        name="genre"
        value={formData.genre}
        onChange={handleInputChange}
        required
        error={fieldErrors.genre}
      />

      <FormField
        label="ISBN"
        name="isbn"
        value={formData.isbn}
        onChange={handleInputChange}
        required
        error={fieldErrors.isbn}
      />

      <FormField
        label="Total Copies"
        name="total_copies"
        type="number"
        value={formData.total_copies}
        onChange={handleInputChange}
        required
        min="0"
        error={fieldErrors.total_copies}
      />
    </div>
  );
};

export default BookFormFields;
