import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BookForm from "../BookForm";

// Mock the useBookForm hook
jest.mock("../../hooks/useBookForm");
const mockUseBookForm = require("../../hooks/useBookForm");

// Mock the form components
jest.mock("../form", () => ({
  BookFormFields: ({ formData, fieldErrors, handleInputChange, isInline }) => (
    <div data-testid="book-form-fields">
      <input
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        data-testid="title-input"
      />
      <input
        name="author"
        value={formData.author}
        onChange={handleInputChange}
        data-testid="author-input"
      />
      <input
        name="genre"
        value={formData.genre}
        onChange={handleInputChange}
        data-testid="genre-input"
      />
      <input
        name="isbn"
        value={formData.isbn}
        onChange={handleInputChange}
        data-testid="isbn-input"
      />
      <input
        name="total_copies"
        value={formData.total_copies}
        onChange={handleInputChange}
        data-testid="total-copies-input"
      />
      <input
        name="available_copies"
        value={formData.available_copies}
        onChange={handleInputChange}
        data-testid="available-copies-input"
      />
      {fieldErrors.title && (
        <div data-testid="title-error">{fieldErrors.title}</div>
      )}
      {fieldErrors.author && (
        <div data-testid="author-error">{fieldErrors.author}</div>
      )}
      {fieldErrors.genre && (
        <div data-testid="genre-error">{fieldErrors.genre}</div>
      )}
      {fieldErrors.isbn && (
        <div data-testid="isbn-error">{fieldErrors.isbn}</div>
      )}
      {fieldErrors.total_copies && (
        <div data-testid="total-copies-error">{fieldErrors.total_copies}</div>
      )}
      {fieldErrors.available_copies && (
        <div data-testid="available-copies-error">
          {fieldErrors.available_copies}
        </div>
      )}
    </div>
  ),
  ImageUpload: ({
    onImageChange,
    onImageRemove,
    imagePreview,
    error,
    isInline,
  }) => (
    <div data-testid="image-upload">
      <input
        type="file"
        onChange={(e) => onImageChange(e.target.files[0])}
        data-testid="image-input"
        id="image-upload"
      />
      {imagePreview && (
        <img src={imagePreview} alt="preview" data-testid="image-preview" />
      )}
      {error && <div data-testid="image-error">{error}</div>}
      <button onClick={onImageRemove} data-testid="remove-image">
        Remove Image
      </button>
    </div>
  ),
  ErrorDisplay: ({ errors }) => (
    <div data-testid="error-display">
      {errors &&
        Array.isArray(errors) &&
        errors.map((error, index) => (
          <div key={index} data-testid={`general-error-${index}`}>
            {error}
          </div>
        ))}
    </div>
  ),
  FormActions: ({ onCancel, isSubmitting, submitText, isInline }) => (
    <div data-testid="form-actions">
      <button type="submit" disabled={isSubmitting} data-testid="submit-button">
        {submitText}
      </button>
      <button type="button" onClick={onCancel} data-testid="cancel-button">
        Cancel
      </button>
    </div>
  ),
}));

describe("BookForm", () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isSubmitting: false,
  };

  const mockFormData = {
    title: "",
    author: "",
    genre: "",
    isbn: "",
    total_copies: "",
    available_copies: "",
  };

  const mockHandleInputChange = jest.fn();
  const mockHandleImageChange = jest.fn();
  const mockHandleImageRemove = jest.fn();
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    mockUseBookForm.useBookForm.mockReturnValue({
      formData: mockFormData,
      imagePreview: null,
      fieldErrors: {},
      handleInputChange: mockHandleInputChange,
      handleImageChange: mockHandleImageChange,
      handleImageRemove: mockHandleImageRemove,
      handleSubmit: mockHandleSubmit,
    });
  });

  describe("Rendering", () => {
    test("renders add new book form by default", () => {
      render(<BookForm {...defaultProps} />);

      expect(screen.getByText("Add New Book")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toHaveTextContent("Add Book");
    });

    test("renders edit book form when editingBook is provided", () => {
      const editingBook = { id: 1, title: "Test Book" };
      render(<BookForm {...defaultProps} editingBook={editingBook} />);

      expect(screen.getByText("Edit Book")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toHaveTextContent(
        "Update Book"
      );
    });

    test("renders inline form when isInline is true", () => {
      render(<BookForm {...defaultProps} isInline={true} />);

      expect(screen.getByText("Edit Book")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toHaveTextContent("Save");
    });

    test("shows loading state when isSubmitting is true", () => {
      render(<BookForm {...defaultProps} isSubmitting={true} />);

      expect(screen.getByTestId("submit-button")).toHaveTextContent(
        "Saving..."
      );
      expect(screen.getByTestId("submit-button")).toBeDisabled();
    });
  });

  describe("Form Fields", () => {
    test("renders all form fields", () => {
      render(<BookForm {...defaultProps} />);

      expect(screen.getByTestId("title-input")).toBeInTheDocument();
      expect(screen.getByTestId("author-input")).toBeInTheDocument();
      expect(screen.getByTestId("genre-input")).toBeInTheDocument();
      expect(screen.getByTestId("isbn-input")).toBeInTheDocument();
      expect(screen.getByTestId("total-copies-input")).toBeInTheDocument();
      expect(screen.getByTestId("available-copies-input")).toBeInTheDocument();
    });

    test("displays form data correctly", () => {
      const formDataWithValues = {
        title: "Test Book",
        author: "Test Author",
        genre: "Fiction",
        isbn: "1234567890",
        total_copies: "5",
        available_copies: "3",
      };

      mockUseBookForm.useBookForm.mockReturnValue({
        formData: formDataWithValues,
        imagePreview: null,
        fieldErrors: {},
        handleInputChange: mockHandleInputChange,
        handleImageChange: mockHandleImageChange,
        handleImageRemove: mockHandleImageRemove,
        handleSubmit: mockHandleSubmit,
      });

      render(<BookForm {...defaultProps} />);

      expect(screen.getByTestId("title-input")).toHaveValue("Test Book");
      expect(screen.getByTestId("author-input")).toHaveValue("Test Author");
      expect(screen.getByTestId("genre-input")).toHaveValue("Fiction");
      expect(screen.getByTestId("isbn-input")).toHaveValue("1234567890");
      expect(screen.getByTestId("total-copies-input")).toHaveValue("5");
      expect(screen.getByTestId("available-copies-input")).toHaveValue("3");
    });
  });

  describe("Error Handling", () => {
    test("displays field-specific errors", () => {
      const fieldErrors = {
        title: "Title is required",
        author: "Author is required",
        total_copies: "Total copies must be a positive number",
      };

      mockUseBookForm.useBookForm.mockReturnValue({
        formData: mockFormData,
        imagePreview: null,
        fieldErrors,
        handleInputChange: mockHandleInputChange,
        handleImageChange: mockHandleImageChange,
        handleImageRemove: mockHandleImageRemove,
        handleSubmit: mockHandleSubmit,
      });

      render(<BookForm {...defaultProps} />);

      expect(screen.getByTestId("title-error")).toHaveTextContent(
        "Title is required"
      );
      expect(screen.getByTestId("author-error")).toHaveTextContent(
        "Author is required"
      );
      expect(screen.getByTestId("total-copies-error")).toHaveTextContent(
        "Total copies must be a positive number"
      );
    });

    test("displays general errors", () => {
      const fieldErrors = {
        general: ["Network error occurred", "Server is unavailable"],
      };

      mockUseBookForm.useBookForm.mockReturnValue({
        formData: mockFormData,
        imagePreview: null,
        fieldErrors,
        handleInputChange: mockHandleInputChange,
        handleImageChange: mockHandleImageChange,
        handleImageRemove: mockHandleImageRemove,
        handleSubmit: mockHandleSubmit,
      });

      render(<BookForm {...defaultProps} />);

      expect(screen.getByTestId("general-error-0")).toHaveTextContent(
        "Network error occurred"
      );
      expect(screen.getByTestId("general-error-1")).toHaveTextContent(
        "Server is unavailable"
      );
    });

    test("displays image upload errors", () => {
      const fieldErrors = {
        image: "Image file is too large",
      };

      mockUseBookForm.useBookForm.mockReturnValue({
        formData: mockFormData,
        imagePreview: null,
        fieldErrors,
        handleInputChange: mockHandleInputChange,
        handleImageChange: mockHandleImageChange,
        handleImageRemove: mockHandleImageRemove,
        handleSubmit: mockHandleSubmit,
      });

      render(<BookForm {...defaultProps} />);

      expect(screen.getByTestId("image-error")).toHaveTextContent(
        "Image file is too large"
      );
    });
  });

  describe("User Interactions", () => {
    test("calls handleInputChange when form fields are changed", async () => {
      render(<BookForm {...defaultProps} />);

      const titleInput = screen.getByTestId("title-input");
      await userEvent.type(titleInput, "New Book Title");

      expect(mockHandleInputChange).toHaveBeenCalled();
    });

    test("calls handleImageChange when image is uploaded", async () => {
      render(<BookForm {...defaultProps} />);

      const file = new File(["test"], "test.png", { type: "image/png" });
      const imageInput = screen.getByTestId("image-input");

      await userEvent.upload(imageInput, file);

      expect(mockHandleImageChange).toHaveBeenCalledWith(file);
    });

    test("calls handleImageRemove when remove image button is clicked", async () => {
      render(<BookForm {...defaultProps} />);

      const removeButton = screen.getByTestId("remove-image");
      fireEvent.click(removeButton);

      expect(mockHandleImageRemove).toHaveBeenCalled();
    });

    test("calls onCancel when cancel button is clicked", async () => {
      render(<BookForm {...defaultProps} />);

      const cancelButton = screen.getByTestId("cancel-button");
      fireEvent.click(cancelButton);

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    test("calls handleSubmit when form is submitted", async () => {
      render(<BookForm {...defaultProps} />);

      fireEvent.click(screen.getByTestId("submit-button"));

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  describe("Image Preview", () => {
    test("displays image preview when available", () => {
      const imagePreview = "data:image/png;base64,test";

      mockUseBookForm.useBookForm.mockReturnValue({
        formData: mockFormData,
        imagePreview,
        fieldErrors: {},
        handleInputChange: mockHandleInputChange,
        handleImageChange: mockHandleImageChange,
        handleImageRemove: mockHandleImageRemove,
        handleSubmit: mockHandleSubmit,
      });

      render(<BookForm {...defaultProps} />);

      const previewImage = screen.getByTestId("image-preview");
      expect(previewImage).toBeInTheDocument();
      expect(previewImage).toHaveAttribute("src", imagePreview);
    });

    test("does not display image preview when not available", () => {
      render(<BookForm {...defaultProps} />);

      expect(screen.queryByTestId("image-preview")).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    test("prevents submission when isSubmitting is true", async () => {
      render(<BookForm {...defaultProps} isSubmitting={true} />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeDisabled();

      fireEvent.click(submitButton);
      expect(mockHandleSubmit).not.toHaveBeenCalled();
    });

    test("allows submission when isSubmitting is false", async () => {
      render(<BookForm {...defaultProps} isSubmitting={false} />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).not.toBeDisabled();

      fireEvent.click(submitButton);
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty editingBook gracefully", () => {
      render(<BookForm {...defaultProps} editingBook={null} />);

      expect(screen.getByText("Add New Book")).toBeInTheDocument();
    });

    test("handles editingBook with missing properties", () => {
      const incompleteBook = { id: 1 };
      render(<BookForm {...defaultProps} editingBook={incompleteBook} />);

      expect(screen.getByText("Edit Book")).toBeInTheDocument();
    });

    test("handles form with all empty values", () => {
      const emptyFormData = {
        title: "",
        author: "",
        genre: "",
        isbn: "",
        total_copies: "",
        available_copies: "",
      };

      mockUseBookForm.useBookForm.mockReturnValue({
        formData: emptyFormData,
        imagePreview: null,
        fieldErrors: {},
        handleInputChange: mockHandleInputChange,
        handleImageChange: mockHandleImageChange,
        handleImageRemove: mockHandleImageRemove,
        handleSubmit: mockHandleSubmit,
      });

      render(<BookForm {...defaultProps} />);

      expect(screen.getByTestId("title-input")).toHaveValue("");
      expect(screen.getByTestId("author-input")).toHaveValue("");
    });
  });

  describe("Validation Error Scenarios", () => {
    test("displays validation errors for required fields", () => {
      const validationErrors = {
        title: "Title cannot be blank",
        author: "Author cannot be blank",
        isbn: "ISBN must be 10 or 13 characters",
        total_copies: "Total copies must be greater than 0",
        available_copies: "Available copies cannot exceed total copies",
      };

      mockUseBookForm.useBookForm.mockReturnValue({
        formData: mockFormData,
        imagePreview: null,
        fieldErrors: validationErrors,
        handleInputChange: mockHandleInputChange,
        handleImageChange: mockHandleImageChange,
        handleImageRemove: mockHandleImageRemove,
        handleSubmit: mockHandleSubmit,
      });

      render(<BookForm {...defaultProps} />);

      expect(screen.getByTestId("title-error")).toHaveTextContent(
        "Title cannot be blank"
      );
      expect(screen.getByTestId("author-error")).toHaveTextContent(
        "Author cannot be blank"
      );
      expect(screen.getByTestId("isbn-error")).toHaveTextContent(
        "ISBN must be 10 or 13 characters"
      );
      expect(screen.getByTestId("total-copies-error")).toHaveTextContent(
        "Total copies must be greater than 0"
      );
      expect(screen.getByTestId("available-copies-error")).toHaveTextContent(
        "Available copies cannot exceed total copies"
      );
    });

    test("handles multiple errors for the same field", () => {
      const multipleErrors = {
        title: ["Title cannot be blank", "Title is too short"],
        isbn: "Invalid ISBN format",
      };

      mockUseBookForm.useBookForm.mockReturnValue({
        formData: mockFormData,
        imagePreview: null,
        fieldErrors: multipleErrors,
        handleInputChange: mockHandleInputChange,
        handleImageChange: mockHandleImageChange,
        handleImageRemove: mockHandleImageRemove,
        handleSubmit: mockHandleSubmit,
      });

      render(<BookForm {...defaultProps} />);

      expect(screen.getByTestId("title-error")).toHaveTextContent(
        "Title cannot be blank"
      );
      expect(screen.getByTestId("isbn-error")).toHaveTextContent(
        "Invalid ISBN format"
      );
    });

    test("handles network and server errors", () => {
      const serverErrors = {
        general: [
          "Network connection failed",
          "Server error: 500 Internal Server Error",
          "Database connection timeout",
        ],
      };

      mockUseBookForm.useBookForm.mockReturnValue({
        formData: mockFormData,
        imagePreview: null,
        fieldErrors: serverErrors,
        handleInputChange: mockHandleInputChange,
        handleImageChange: mockHandleImageChange,
        handleImageRemove: mockHandleImageRemove,
        handleSubmit: mockHandleSubmit,
      });

      render(<BookForm {...defaultProps} />);

      expect(screen.getByTestId("general-error-0")).toHaveTextContent(
        "Network connection failed"
      );
      expect(screen.getByTestId("general-error-1")).toHaveTextContent(
        "Server error: 500 Internal Server Error"
      );
      expect(screen.getByTestId("general-error-2")).toHaveTextContent(
        "Database connection timeout"
      );
    });
  });
});
