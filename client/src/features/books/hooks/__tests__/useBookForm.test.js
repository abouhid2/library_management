import { renderHook, act } from "@testing-library/react";
import { useBookForm } from "../useBookForm";

// Mock the useFormErrors hook
jest.mock("../useFormErrors");
const mockUseFormErrors = require("../useFormErrors");

describe("useBookForm", () => {
  const mockOnSubmit = jest.fn();
  const mockHandleApiError = jest.fn();
  const mockClearErrors = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation for useFormErrors
    mockUseFormErrors.useFormErrors.mockReturnValue({
      fieldErrors: {},
      clearErrors: mockClearErrors,
      handleApiError: mockHandleApiError,
    });
  });

  describe("Initial State", () => {
    test("initializes with empty form data when no editingBook", () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      expect(result.current.formData).toEqual({
        title: "",
        author: "",
        genre: "",
        isbn: "",
        total_copies: "",
        available_copies: "",
      });
      expect(result.current.imagePreview).toBeNull();
    });

    test("initializes with editingBook data when provided", () => {
      const editingBook = {
        id: 1,
        title: "Test Book",
        author: "Test Author",
        genre: "Fiction",
        isbn: "1234567890",
        total_copies: 5,
        available_copies: 3,
        image_url: "http://example.com/image.jpg",
      };

      const { result } = renderHook(() => useBookForm(editingBook, mockOnSubmit));

      expect(result.current.formData).toEqual({
        title: "Test Book",
        author: "Test Author",
        genre: "Fiction",
        isbn: "1234567890",
        total_copies: "5",
        available_copies: "3",
      });
      expect(result.current.imagePreview).toBe("http://example.com/image.jpg");
    });

    test("handles editingBook with missing properties", () => {
      const incompleteBook = { id: 1, title: "Test Book" };

      const { result } = renderHook(() => useBookForm(incompleteBook, mockOnSubmit));

      expect(result.current.formData).toEqual({
        title: "Test Book",
        author: "",
        genre: "",
        isbn: "",
        total_copies: "",
        available_copies: "",
      });
      expect(result.current.imagePreview).toBeNull();
    });
  });

  describe("handleInputChange", () => {
    test("updates form data when input changes", () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      act(() => {
        result.current.handleInputChange({
          target: { name: "title", value: "New Book Title" },
        });
      });

      expect(result.current.formData.title).toBe("New Book Title");
    });

    test("updates multiple fields correctly", () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      act(() => {
        result.current.handleInputChange({
          target: { name: "title", value: "Book Title" },
        });
        result.current.handleInputChange({
          target: { name: "author", value: "Book Author" },
        });
        result.current.handleInputChange({
          target: { name: "total_copies", value: "10" },
        });
      });

      expect(result.current.formData).toEqual({
        title: "Book Title",
        author: "Book Author",
        genre: "",
        isbn: "",
        total_copies: "10",
        available_copies: "",
      });
    });
  });

  describe("handleImageChange", () => {
    test("handles valid image upload", () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));
      const mockFile = new File(["test"], "test.png", { type: "image/png" });

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null,
      };
      global.FileReader = jest.fn(() => mockFileReader);

      act(() => {
        result.current.handleImageChange(mockFile);
      });

      expect(result.current.selectedImage).toBe(mockFile);
      expect(mockClearErrors).toHaveBeenCalled();
    });

    test("handles image upload with error", () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));
      const error = "Image file is too large";

      act(() => {
        result.current.handleImageChange(null, error);
      });

      expect(mockHandleApiError).toHaveBeenCalledWith({
        response: {
          data: {
            errors: {
              image: [error],
            },
          },
        },
      });
    });

    test("creates image preview for valid file", () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));
      const mockFile = new File(["test"], "test.png", { type: "image/png" });

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null,
      };
      global.FileReader = jest.fn(() => mockFileReader);

      act(() => {
        result.current.handleImageChange(mockFile);
      });

      // Simulate FileReader onload
      act(() => {
        mockFileReader.onload({ target: { result: "data:image/png;base64,test" } });
      });

      expect(result.current.imagePreview).toBe("data:image/png;base64,test");
    });
  });

  describe("handleImageRemove", () => {
    test("removes image and clears preview", () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      // First set an image using handleImageChange
      const mockFile = new File(["test"], "test.png", { type: "image/png" });
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null,
      };
      global.FileReader = jest.fn(() => mockFileReader);

      act(() => {
        result.current.handleImageChange(mockFile);
      });

      // Simulate FileReader onload to set imagePreview
      act(() => {
        mockFileReader.onload({ target: { result: "data:image/png;base64,test" } });
      });

      // Now remove the image
      act(() => {
        result.current.handleImageRemove();
      });

      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imagePreview).toBeNull();
    });

    test("handles missing file input gracefully", () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      act(() => {
        result.current.handleImageRemove();
      });

      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imagePreview).toBeNull();
    });
  });

  describe("handleSubmit", () => {
    test("submits form data correctly", async () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      // Set form data
      act(() => {
        result.current.handleInputChange({
          target: { name: "title", value: "Test Book" },
        });
        result.current.handleInputChange({
          target: { name: "author", value: "Test Author" },
        });
        result.current.handleInputChange({
          target: { name: "total_copies", value: "5" },
        });
        result.current.handleInputChange({
          target: { name: "available_copies", value: "3" },
        });
      });

      const mockEvent = { preventDefault: jest.fn() };

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Book",
        author: "Test Author",
        genre: "",
        isbn: "",
        total_copies: 5,
        available_copies: 3,
      });
    });

    test("includes image in submission when available", async () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));
      const mockFile = new File(["test"], "test.png", { type: "image/png" });

      // Set form data
      act(() => {
        result.current.handleInputChange({
          target: { name: "title", value: "Test Book" },
        });
      });

      // Set image using handleImageChange
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null,
      };
      global.FileReader = jest.fn(() => mockFileReader);

      act(() => {
        result.current.handleImageChange(mockFile);
      });

      const mockEvent = { preventDefault: jest.fn() };

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Book",
        author: "",
        genre: "",
        isbn: "",
        total_copies: NaN,
        available_copies: NaN,
        image: mockFile,
      });
    });

    test("handles submission errors", async () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));
      const mockError = new Error("Submission failed");

      mockOnSubmit.mockRejectedValueOnce(mockError);

      const mockEvent = { preventDefault: jest.fn() };

      await act(async () => {
        await expect(result.current.handleSubmit(mockEvent)).rejects.toThrow("Submission failed");
      });

      expect(mockHandleApiError).toHaveBeenCalledWith(mockError);
    });

    test("converts string numbers to integers", async () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      // Set form data with string numbers
      act(() => {
        result.current.handleInputChange({
          target: { name: "title", value: "Test Book" },
        });
        result.current.handleInputChange({
          target: { name: "total_copies", value: "10" },
        });
        result.current.handleInputChange({
          target: { name: "available_copies", value: "7" },
        });
      });

      const mockEvent = { preventDefault: jest.fn() };

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Book",
        author: "",
        genre: "",
        isbn: "",
        total_copies: 10,
        available_copies: 7,
      });
    });
  });

  describe("resetForm", () => {
    test("resets form to initial state", () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      // Set some form data
      act(() => {
        result.current.handleInputChange({
          target: { name: "title", value: "Test Book" },
        });
        result.current.selectedImage = new File(["test"], "test.png");
        result.current.imagePreview = "data:image/png;base64,test";
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formData).toEqual({
        title: "",
        author: "",
        genre: "",
        isbn: "",
        total_copies: "",
        available_copies: "",
      });
      expect(result.current.selectedImage).toBeNull();
      expect(result.current.imagePreview).toBeNull();
      expect(mockClearErrors).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    test("exposes field errors from useFormErrors", () => {
      const mockFieldErrors = {
        title: "Title is required",
        author: "Author is required",
      };

      mockUseFormErrors.useFormErrors.mockReturnValue({
        fieldErrors: mockFieldErrors,
        clearErrors: mockClearErrors,
        handleApiError: mockHandleApiError,
      });

      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      expect(result.current.fieldErrors).toEqual(mockFieldErrors);
    });

    test("handles API errors through useFormErrors", async () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));
      const mockError = new Error("API Error");

      mockOnSubmit.mockRejectedValueOnce(mockError);

      const mockEvent = { preventDefault: jest.fn() };

      await act(async () => {
        await expect(result.current.handleSubmit(mockEvent)).rejects.toThrow("API Error");
      });

      expect(mockHandleApiError).toHaveBeenCalledWith(mockError);
    });
  });

  describe("Edge Cases", () => {
    test("handles empty string values for numeric fields", async () => {
      const { result } = renderHook(() => useBookForm(null, mockOnSubmit));

      // Set empty string for numeric fields
      act(() => {
        result.current.handleInputChange({
          target: { name: "title", value: "Test Book" },
        });
        result.current.handleInputChange({
          target: { name: "total_copies", value: "" },
        });
        result.current.handleInputChange({
          target: { name: "available_copies", value: "" },
        });
      });

      const mockEvent = { preventDefault: jest.fn() };

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Book",
        author: "",
        genre: "",
        isbn: "",
        total_copies: NaN,
        available_copies: NaN,
      });
    });

    test("handles editingBook with null/undefined values", () => {
      const editingBook = {
        id: 1,
        title: "Test Book",
        total_copies: null,
        available_copies: undefined,
      };

      const { result } = renderHook(() => useBookForm(editingBook, mockOnSubmit));

      expect(result.current.formData).toEqual({
        title: "Test Book",
        author: "",
        genre: "",
        isbn: "",
        total_copies: "",
        available_copies: "",
      });
    });
  });
}); 