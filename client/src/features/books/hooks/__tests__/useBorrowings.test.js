import { renderHook, act, waitFor } from "@testing-library/react";
import { useBorrowings } from "../useBorrowings";
import { borrowingsAPI } from "../../../../services/api";

// Mock the API module
jest.mock("../../../../services/api", () => ({
  borrowingsAPI: {
    getAll: jest.fn(),
    borrowBook: jest.fn(),
    returnBook: jest.fn(),
    getMyOverdue: jest.fn(),
    getOverdue: jest.fn(),
  },
}));

describe("useBorrowings", () => {
  const mockBorrowings = [
    {
      id: 1,
      book_id: 1,
      book: { id: 1, title: "Test Book 1", author: "Test Author 1" },
      user: { id: 1, name: "Test User 1", email: "user1@test.com" },
      borrowed_at: "2024-01-01T00:00:00Z",
      due_at: "2024-01-15T00:00:00Z",
      returned_at: null,
    },
    {
      id: 2,
      book_id: 2,
      book: { id: 2, title: "Test Book 2", author: "Test Author 2" },
      user: { id: 2, name: "Test User 2", email: "user2@test.com" },
      borrowed_at: "2024-01-01T00:00:00Z",
      due_at: "2024-01-10T00:00:00Z",
      returned_at: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial State", () => {
    it("initializes with default values", () => {
      const { result } = renderHook(() => useBorrowings());

      expect(result.current.borrowings).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("fetchBorrowings", () => {
    it("fetches borrowings successfully", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.borrowings).toEqual(mockBorrowings);
      expect(result.current.error).toBe(null);
      expect(borrowingsAPI.getAll).toHaveBeenCalledTimes(1);
    });

    it("handles fetch error", async () => {
      const errorMessage = "Failed to fetch borrowings";
      borrowingsAPI.getAll.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.borrowings).toEqual([]);
      expect(result.current.error).toBe("Failed to fetch borrowings");
    });

    it("sets loading state correctly during fetch", async () => {
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      borrowingsAPI.getAll.mockReturnValue(promise);

      const { result } = renderHook(() => useBorrowings());

      expect(result.current.loading).toBe(true);

      act(() => {
        resolvePromise({ data: mockBorrowings });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("borrowBook", () => {
    it("borrows a book successfully", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });
      borrowingsAPI.borrowBook.mockResolvedValue({ data: mockBorrowings[0] });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.borrowBook(1);
      });

      expect(borrowingsAPI.borrowBook).toHaveBeenCalledWith(1);
      expect(borrowingsAPI.getAll).toHaveBeenCalledTimes(2); // Initial + refresh
    });

    it("handles borrow error", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });
      const errorResponse = {
        response: { data: { error: "Book is not available" } },
      };
      borrowingsAPI.borrowBook.mockRejectedValue(errorResponse);

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.borrowBook(1);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe("Book is not available");
      expect(result.current.isSubmitting).toBe(false);
    });

    it("sets isSubmitting state correctly", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });
      let resolveBorrow;
      const borrowPromise = new Promise((resolve) => {
        resolveBorrow = resolve;
      });
      borrowingsAPI.borrowBook.mockReturnValue(borrowPromise);

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.borrowBook(1);
      });

      expect(result.current.isSubmitting).toBe(true);

      act(() => {
        resolveBorrow({ data: mockBorrowings[0] });
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(false);
      });
    });
  });

  describe("returnBook", () => {
    it("returns a book successfully", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });
      borrowingsAPI.returnBook.mockResolvedValue({ data: mockBorrowings[0] });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.returnBook(1);
      });

      expect(borrowingsAPI.returnBook).toHaveBeenCalledWith(1);
      expect(borrowingsAPI.getAll).toHaveBeenCalledTimes(2); // Initial + refresh
    });

    it("handles return error", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });
      const errorResponse = {
        response: { data: { error: "Borrowing not found" } },
      };
      borrowingsAPI.returnBook.mockRejectedValue(errorResponse);

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.returnBook(1);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe("Borrowing not found");
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("getMyOverdue", () => {
    it("fetches my overdue borrowings successfully", async () => {
      const overdueBorrowings = [mockBorrowings[0]];
      borrowingsAPI.getMyOverdue.mockResolvedValue({ data: overdueBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const overdue = await act(async () => {
        return await result.current.getMyOverdue();
      });

      expect(overdue).toEqual(overdueBorrowings);
      expect(borrowingsAPI.getMyOverdue).toHaveBeenCalledTimes(1);
    });

    it("handles getMyOverdue error gracefully", async () => {
      borrowingsAPI.getMyOverdue.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const overdue = await act(async () => {
        return await result.current.getMyOverdue();
      });

      expect(overdue).toEqual([]);
    });
  });

  describe("getOverdue", () => {
    it("fetches all overdue borrowings successfully", async () => {
      const overdueBorrowings = [mockBorrowings[0]];
      borrowingsAPI.getOverdue.mockResolvedValue({ data: overdueBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const overdue = await act(async () => {
        return await result.current.getOverdue();
      });

      expect(overdue).toEqual(overdueBorrowings);
      expect(borrowingsAPI.getOverdue).toHaveBeenCalledTimes(1);
    });

    it("handles getOverdue error gracefully", async () => {
      borrowingsAPI.getOverdue.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const overdue = await act(async () => {
        return await result.current.getOverdue();
      });

      expect(overdue).toEqual([]);
    });
  });

  describe("hasBorrowedBook", () => {
    it("returns true when user has borrowed a book", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hasBorrowedBook(1)).toBe(true);
      expect(result.current.hasBorrowedBook(2)).toBe(true);
    });

    it("returns false when user has not borrowed a book", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hasBorrowedBook(999)).toBe(false);
    });

    it("returns false for returned books", async () => {
      const returnedBorrowings = [
        {
          ...mockBorrowings[0],
          returned_at: "2024-01-10T00:00:00Z",
        },
      ];
      borrowingsAPI.getAll.mockResolvedValue({ data: returnedBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hasBorrowedBook(1)).toBe(false);
    });
  });

  describe("getBorrowingForBook", () => {
    it("returns borrowing for a specific book", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const borrowing = result.current.getBorrowingForBook(1);
      expect(borrowing).toEqual(mockBorrowings[0]);
    });

    it("returns undefined for non-borrowed book", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const borrowing = result.current.getBorrowingForBook(999);
      expect(borrowing).toBeUndefined();
    });
  });

  describe("setError", () => {
    it("sets error state", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setError("Custom error message");
      });

      expect(result.current.error).toBe("Custom error message");
    });
  });

  describe("refreshBorrowings", () => {
    it("refreshes borrowings data", async () => {
      borrowingsAPI.getAll.mockResolvedValue({ data: mockBorrowings });

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Change the mock to return different data
      const newBorrowings = [mockBorrowings[0]];
      borrowingsAPI.getAll.mockResolvedValue({ data: newBorrowings });

      await act(async () => {
        await result.current.refreshBorrowings();
      });

      expect(result.current.borrowings).toEqual(newBorrowings);
      expect(borrowingsAPI.getAll).toHaveBeenCalledTimes(2);
    });
  });

  describe("Error Handling", () => {
    it("handles network errors gracefully", async () => {
      borrowingsAPI.getAll.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch borrowings");
      expect(result.current.borrowings).toEqual([]);
    });

    it("handles API errors with custom messages", async () => {
      const errorResponse = {
        response: { data: { error: "Custom API error" } },
      };
      borrowingsAPI.getAll.mockRejectedValue(errorResponse);

      const { result } = renderHook(() => useBorrowings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch borrowings");
    });
  });
});
