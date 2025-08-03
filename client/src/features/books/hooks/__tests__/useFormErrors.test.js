import { renderHook, act } from "@testing-library/react";
import { useFormErrors } from "../useFormErrors";

describe("useFormErrors", () => {
  const fieldMapping = {
    title: "title",
    author: "author",
    genre: "genre",
    isbn: "isbn",
    total_copies: "total_copies",
    available_copies: "available_copies",
    image: "image",
  };

  describe("Initial State", () => {
    test("initializes with empty field errors", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));

      expect(result.current.fieldErrors).toEqual({});
    });

    test("initializes with custom field mapping", () => {
      const customMapping = { custom_field: "custom_field" };
      const { result } = renderHook(() => useFormErrors(customMapping));

      expect(result.current.fieldErrors).toEqual({});
    });
  });

  describe("clearErrors", () => {
    test("clears all field errors", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));

      // Set some errors first
      act(() => {
        result.current.setFieldError("title", "Title is required");
        result.current.setFieldError("author", "Author is required");
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title is required",
        author: "Author is required",
      });

      // Clear errors
      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.fieldErrors).toEqual({});
    });
  });

  describe("setFieldError", () => {
    test("sets error for specific field", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));

      act(() => {
        result.current.setFieldError("title", "Title is required");
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title is required",
      });
    });

    test("overwrites existing error for same field", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));

      act(() => {
        result.current.setFieldError("title", "Title is required");
        result.current.setFieldError("title", "Title is too short");
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title is too short",
      });
    });
  });

  describe("clearFieldError", () => {
    test("clears error for specific field", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));

      // Set multiple errors
      act(() => {
        result.current.setFieldError("title", "Title is required");
        result.current.setFieldError("author", "Author is required");
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title is required",
        author: "Author is required",
      });

      // Clear specific field
      act(() => {
        result.current.clearFieldError("title");
      });

      expect(result.current.fieldErrors).toEqual({
        author: "Author is required",
      });
    });

    test("handles clearing non-existent field gracefully", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));

      act(() => {
        result.current.clearFieldError("non_existent");
      });

      expect(result.current.fieldErrors).toEqual({});
    });
  });

  describe("parseBackendErrors", () => {
    test("parses array of error messages", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = [
        "Title cannot be blank",
        "Author cannot be blank",
        "ISBN must be 10 or 13 characters",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title cannot be blank",
        author: "Author cannot be blank",
        isbn: "ISBN must be 10 or 13 characters",
      });
    });

    test("parses single error message string", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendError = "Title cannot be blank";

      act(() => {
        result.current.parseBackendErrors(backendError);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title cannot be blank",
      });
    });

    test("parses object with errors array", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = {
        errors: ["Title cannot be blank", "Author cannot be blank"],
      };

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title cannot be blank",
        author: "Author cannot be blank",
      });
    });

    test("parses object with single error", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = {
        error: "Network connection failed",
      };

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Network connection failed"],
      });
    });

    test("handles null/undefined errors gracefully", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));

      act(() => {
        result.current.parseBackendErrors(null);
      });

      expect(result.current.fieldErrors).toEqual({});

      act(() => {
        result.current.parseBackendErrors(undefined);
      });

      expect(result.current.fieldErrors).toEqual({});
    });

    test("maps field name variations correctly", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = [
        "Total copies must be greater than 0",
        "Available copies cannot exceed total copies",
        "Book title cannot be blank",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        total_copies: "Available copies cannot exceed total copies",
        title: "Book title cannot be blank",
      });
    });

    test("assigns unmatched errors to general", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = [
        "Title cannot be blank",
        "Unknown field error",
        "Another unknown error",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title cannot be blank",
        general: ["Unknown field error", "Another unknown error"],
      });
    });

    test("handles custom field mapping", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = ["Custom field error"];
      const customMapping = { custom_field: "custom_field" };

      act(() => {
        result.current.parseBackendErrors(backendErrors, customMapping);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Custom field error"],
      });
    });
  });

  describe("handleApiError", () => {
    test("handles backend validation errors", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const apiError = {
        response: {
          data: {
            errors: {
              title: ["Title cannot be blank"],
              author: ["Author cannot be blank"],
            },
          },
        },
      };

      act(() => {
        result.current.handleApiError(apiError);
      });

      expect(result.current.fieldErrors).toEqual({
        title:
          '{"title":["Title cannot be blank"],"author":["Author cannot be blank"]}',
      });
    });

    test("handles single error message", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const apiError = {
        response: {
          data: {
            error: "Network connection failed",
          },
        },
      };

      act(() => {
        result.current.handleApiError(apiError);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Network connection failed"],
      });
    });

    test("handles network errors", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const apiError = new Error("Network connection failed");

      act(() => {
        result.current.handleApiError(apiError);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Network connection failed"],
      });
    });

    test("handles errors without response", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const apiError = new Error("Unexpected error");

      act(() => {
        result.current.handleApiError(apiError);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Unexpected error"],
      });
    });

    test("handles errors with empty message", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const apiError = new Error("");

      act(() => {
        result.current.handleApiError(apiError);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["An unexpected error occurred"],
      });
    });
  });

  describe("Error Message Variations", () => {
    test("handles different error message formats", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = [
        "Title is required",
        "Title cannot be blank",
        "Title is too short",
        "Title must be present",
        "Title field is invalid",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title field is invalid",
      });
    });

    test("handles case insensitive matching", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = [
        "TITLE cannot be blank",
        "Author IS required",
        "ISBN must be valid",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "TITLE cannot be blank",
        author: "Author IS required",
        isbn: "ISBN must be valid",
      });
    });

    test("handles field name variations", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = [
        "Total copies must be positive",
        "Available copies cannot be negative",
        "Book title is required",
        "Book author is required",
        "Book genre is invalid",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        total_copies: "Total copies must be positive",
        available_copies: "Available copies cannot be negative",
        title: "Book title is required",
        author: "Book author is required",
        genre: "Book genre is invalid",
      });
    });
  });

  describe("Edge Cases", () => {
    test("handles empty error messages", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = ["", "   ", null, undefined];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["   "],
      });
    });

    test("handles non-string error messages", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = [123, true, false, {}];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({});
    });

    test("handles complex nested error objects", () => {
      const { result } = renderHook(() => useFormErrors(fieldMapping));
      const backendErrors = {
        errors: {
          title: ["Title is required"],
          author: ["Author is required"],
          nested: {
            field: "Nested error",
          },
        },
      };

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        title:
          '{"errors":{"title":["Title is required"],"author":["Author is required"],"nested":{"field":"Nested error"}}}',
      });
    });
  });
});
