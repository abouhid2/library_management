import { renderHook, act } from "@testing-library/react";
import { useFormErrors } from "../useFormErrors";

describe("useFormErrors", () => {
  let result;

  beforeEach(() => {
    result = renderHook(() => useFormErrors()).result;
  });

  describe("Initial State", () => {
    it("should initialize with empty field errors", () => {
      expect(result.current.fieldErrors).toEqual({});
    });
  });

  describe("clearErrors", () => {
    it("should clear all field errors", () => {
      act(() => {
        result.current.setFieldError("title", "Title is required");
        result.current.setFieldError("author", "Author is required");
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title is required",
        author: "Author is required",
      });

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.fieldErrors).toEqual({});
    });
  });

  describe("setFieldError", () => {
    it("should set a field error", () => {
      act(() => {
        result.current.setFieldError("title", "Title is required");
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title is required",
      });
    });

    it("should update existing field error", () => {
      act(() => {
        result.current.setFieldError("title", "Title is required");
        result.current.setFieldError(
          "title",
          "Title must be at least 3 characters"
        );
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title must be at least 3 characters",
      });
    });
  });

  describe("clearFieldError", () => {
    it("should clear a specific field error", () => {
      act(() => {
        result.current.setFieldError("title", "Title is required");
        result.current.setFieldError("author", "Author is required");
      });

      act(() => {
        result.current.clearFieldError("title");
      });

      expect(result.current.fieldErrors).toEqual({
        author: "Author is required",
      });
    });

    it("should handle clearing non-existent field error", () => {
      act(() => {
        result.current.clearFieldError("nonExistent");
      });

      expect(result.current.fieldErrors).toEqual({});
    });
  });

  describe("parseBackendErrors", () => {
    it("should parse array of error messages", () => {
      const backendErrors = [
        "Title can't be blank",
        "Author can't be blank",
        "ISBN is invalid",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title can't be blank",
        author: "Author can't be blank",
        isbn: "ISBN is invalid",
      });
    });

    it("should handle empty array", () => {
      act(() => {
        result.current.parseBackendErrors([]);
      });

      expect(result.current.fieldErrors).toEqual({});
    });

    it("should handle null backendErrors", () => {
      act(() => {
        result.current.parseBackendErrors(null);
      });

      expect(result.current.fieldErrors).toEqual({});
    });

    it("should handle undefined backendErrors", () => {
      act(() => {
        result.current.parseBackendErrors(undefined);
      });

      expect(result.current.fieldErrors).toEqual({});
    });

    it("should handle non-array backendErrors", () => {
      act(() => {
        result.current.parseBackendErrors("Single error message");
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Single error message"],
      });
    });

    it("should handle object backendErrors", () => {
      act(() => {
        result.current.parseBackendErrors({ error: "Object error" });
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Object error"],
      });
    });

    it("should use custom field mapping", () => {
      const customMapping = {
        book_title: "title",
        book_author: "author",
      };

      const backendErrors = [
        "Book title can't be blank",
        "Book author can't be blank",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors, customMapping);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Book title can't be blank",
        author: "Book author can't be blank",
      });
    });

    it("should handle field variations", () => {
      const backendErrors = [
        "Total copies must be greater than 0",
        "Available copies cannot exceed total copies",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        total_copies: "Available copies cannot exceed total copies",
      });
    });

    it("should handle unmatched errors as general errors", () => {
      const backendErrors = [
        "Title can't be blank",
        "Some unrelated error message",
        "Another general error",
      ];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title can't be blank",
        general: ["Some unrelated error message", "Another general error"],
      });
    });

    it("should handle case insensitive matching", () => {
      const backendErrors = ["TITLE can't be blank", "Author is required"];

      act(() => {
        result.current.parseBackendErrors(backendErrors);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "TITLE can't be blank",
        author: "Author is required",
      });
    });
  });

  describe("handleApiError", () => {
    it("should handle backend validation errors", () => {
      const mockError = {
        response: {
          data: {
            errors: ["Title can't be blank", "Author can't be blank"],
          },
        },
      };

      act(() => {
        result.current.handleApiError(mockError);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title can't be blank",
        author: "Author can't be blank",
      });
    });

    it("should handle single error message", () => {
      const mockError = {
        response: {
          data: {
            error: "Something went wrong",
          },
        },
      };

      act(() => {
        result.current.handleApiError(mockError);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Something went wrong"],
      });
    });

    it("should handle network errors", () => {
      const mockError = {
        message: "Network Error",
      };

      act(() => {
        result.current.handleApiError(mockError);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Network Error"],
      });
    });

    it("should handle errors without message", () => {
      const mockError = {};

      act(() => {
        result.current.handleApiError(mockError);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["An unexpected error occurred"],
      });
    });

    it("should handle CSV upload errors", () => {
      const mockError = {
        response: {
          data: {
            errors: "Invalid CSV format. Please check your file.",
          },
        },
      };

      act(() => {
        result.current.handleApiError(mockError);
      });

      expect(result.current.fieldErrors).toEqual({
        general: ["Invalid CSV format. Please check your file."],
      });
    });

    it("should handle mixed error formats", () => {
      const mockError = {
        response: {
          data: {
            errors: ["Title can't be blank", "Invalid file format"],
          },
        },
      };

      act(() => {
        result.current.handleApiError(mockError);
      });

      expect(result.current.fieldErrors).toEqual({
        title: "Title can't be blank",
        general: ["Invalid file format"],
      });
    });
  });

  describe("with field mapping", () => {
    it("should use provided field mapping", () => {
      const { result: mappedResult } = renderHook(() =>
        useFormErrors({
          book_title: "title",
          book_author: "author",
        })
      );

      const backendErrors = [
        "Book title can't be blank",
        "Book author can't be blank",
      ];

      act(() => {
        mappedResult.current.parseBackendErrors(backendErrors);
      });

      expect(mappedResult.current.fieldErrors).toEqual({
        title: "Book title can't be blank",
        author: "Book author can't be blank",
      });
    });
  });
});
