import { renderHook, act, waitFor } from "@testing-library/react";
import { useDashboard } from "../useDashboard";
import { dashboardAPI } from "../../../../services/api";

// Mock the API module
jest.mock("../../../../services/api", () => ({
  dashboardAPI: {
    getLibrarianStats: jest.fn(),
    getMemberStats: jest.fn(),
  },
}));

describe("useDashboard", () => {
  const mockLibrarianStats = {
    total_books: 100,
    total_borrowed: 25,
    books_due_today: 5,
    overdue_count: 3,
    overdue_borrowings: [
      {
        id: 1,
        book: { id: 1, title: "Overdue Book 1" },
        user: { id: 1, name: "User 1" },
        due_at: "2024-01-01T00:00:00Z",
      },
    ],
  };

  const mockMemberStats = {
    total_books: 100,
    my_borrowed: 2,
    books_due_today: 1,
    overdue_count: 1,
    my_overdue_borrowings: [
      {
        id: 1,
        book: { id: 1, title: "My Overdue Book" },
        due_at: "2024-01-01T00:00:00Z",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial State", () => {
    it("initializes with default values", () => {
      const { result } = renderHook(() => useDashboard(false));

      expect(result.current.stats).toEqual({
        total_books: 0,
        total_borrowed: 0,
        books_due_today: 0,
        overdue_count: 0,
        overdue_borrowings: [],
        my_borrowings: [],
        my_overdue_borrowings: [],
      });
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
    });
  });

  describe("Librarian Dashboard", () => {
    it("fetches librarian stats successfully", async () => {
      dashboardAPI.getLibrarianStats.mockResolvedValue({
        data: mockLibrarianStats,
      });

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(mockLibrarianStats);
      expect(result.current.error).toBe(null);
      expect(dashboardAPI.getLibrarianStats).toHaveBeenCalledTimes(1);
      expect(dashboardAPI.getMemberStats).not.toHaveBeenCalled();
    });

    it("handles librarian stats fetch error", async () => {
      dashboardAPI.getLibrarianStats.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual({
        total_books: 0,
        total_borrowed: 0,
        books_due_today: 0,
        overdue_count: 0,
        overdue_borrowings: [],
        my_borrowings: [],
        my_overdue_borrowings: [],
      });
      expect(result.current.error).toBe("Failed to fetch dashboard statistics");
    });

    it("sets loading state correctly during librarian stats fetch", async () => {
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      dashboardAPI.getLibrarianStats.mockReturnValue(promise);

      const { result } = renderHook(() => useDashboard(true));

      expect(result.current.loading).toBe(true);

      act(() => {
        resolvePromise({ data: mockLibrarianStats });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("Member Dashboard", () => {
    it("fetches member stats successfully", async () => {
      dashboardAPI.getMemberStats.mockResolvedValue({ data: mockMemberStats });

      const { result } = renderHook(() => useDashboard(false));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(mockMemberStats);
      expect(result.current.error).toBe(null);
      expect(dashboardAPI.getMemberStats).toHaveBeenCalledTimes(1);
      expect(dashboardAPI.getLibrarianStats).not.toHaveBeenCalled();
    });

    it("handles member stats fetch error", async () => {
      dashboardAPI.getMemberStats.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useDashboard(false));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual({
        total_books: 0,
        total_borrowed: 0,
        books_due_today: 0,
        overdue_count: 0,
        overdue_borrowings: [],
        my_borrowings: [],
        my_overdue_borrowings: [],
      });
      expect(result.current.error).toBe("Failed to fetch dashboard statistics");
    });
  });

  describe("refreshStats", () => {
    it("refreshes librarian stats", async () => {
      dashboardAPI.getLibrarianStats.mockResolvedValue({
        data: mockLibrarianStats,
      });

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Change the mock to return different data
      const newStats = { ...mockLibrarianStats, total_books: 150 };
      dashboardAPI.getLibrarianStats.mockResolvedValue({ data: newStats });

      await act(async () => {
        await result.current.refreshStats();
      });

      expect(result.current.stats).toEqual(newStats);
      expect(dashboardAPI.getLibrarianStats).toHaveBeenCalledTimes(2);
    });

    it("refreshes member stats", async () => {
      dashboardAPI.getMemberStats.mockResolvedValue({ data: mockMemberStats });

      const { result } = renderHook(() => useDashboard(false));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Change the mock to return different data
      const newStats = { ...mockMemberStats, my_borrowed: 3 };
      dashboardAPI.getMemberStats.mockResolvedValue({ data: newStats });

      await act(async () => {
        await result.current.refreshStats();
      });

      expect(result.current.stats).toEqual(newStats);
      expect(dashboardAPI.getMemberStats).toHaveBeenCalledTimes(2);
    });

    it("handles refresh error for librarian", async () => {
      dashboardAPI.getLibrarianStats.mockResolvedValue({
        data: mockLibrarianStats,
      });

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Mock error on refresh
      dashboardAPI.getLibrarianStats.mockRejectedValue(
        new Error("Refresh error")
      );

      await act(async () => {
        await result.current.refreshStats();
      });

      expect(result.current.error).toBe("Failed to fetch dashboard statistics");
      expect(result.current.stats).toEqual(mockLibrarianStats); // Should keep previous data
    });

    it("handles refresh error for member", async () => {
      dashboardAPI.getMemberStats.mockResolvedValue({ data: mockMemberStats });

      const { result } = renderHook(() => useDashboard(false));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Mock error on refresh
      dashboardAPI.getMemberStats.mockRejectedValue(new Error("Refresh error"));

      await act(async () => {
        await result.current.refreshStats();
      });

      expect(result.current.error).toBe("Failed to fetch dashboard statistics");
      expect(result.current.stats).toEqual(mockMemberStats); // Should keep previous data
    });
  });

  describe("Hook Re-initialization", () => {
    it("switches from librarian to member stats", async () => {
      dashboardAPI.getLibrarianStats.mockResolvedValue({
        data: mockLibrarianStats,
      });
      dashboardAPI.getMemberStats.mockResolvedValue({ data: mockMemberStats });

      const { result, rerender } = renderHook(
        (isLibrarian) => useDashboard(isLibrarian),
        {
          initialProps: true,
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(mockLibrarianStats);

      // Switch to member
      rerender(false);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(mockMemberStats);
      expect(dashboardAPI.getLibrarianStats).toHaveBeenCalledTimes(1);
      expect(dashboardAPI.getMemberStats).toHaveBeenCalledTimes(1);
    });

    it("switches from member to librarian stats", async () => {
      dashboardAPI.getLibrarianStats.mockResolvedValue({
        data: mockLibrarianStats,
      });
      dashboardAPI.getMemberStats.mockResolvedValue({ data: mockMemberStats });

      const { result, rerender } = renderHook(
        (isLibrarian) => useDashboard(isLibrarian),
        {
          initialProps: false,
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(mockMemberStats);

      // Switch to librarian
      rerender(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(mockLibrarianStats);
      expect(dashboardAPI.getMemberStats).toHaveBeenCalledTimes(1);
      expect(dashboardAPI.getLibrarianStats).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Handling", () => {
    it("handles network errors gracefully", async () => {
      dashboardAPI.getLibrarianStats.mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch dashboard statistics");
      expect(result.current.stats).toEqual({
        total_books: 0,
        total_borrowed: 0,
        books_due_today: 0,
        overdue_count: 0,
        overdue_borrowings: [],
        my_borrowings: [],
        my_overdue_borrowings: [],
      });
    });

    it("handles API errors with custom messages", async () => {
      const errorResponse = {
        response: { data: { error: "Custom API error" } },
      };
      dashboardAPI.getLibrarianStats.mockRejectedValue(errorResponse);

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch dashboard statistics");
    });

    it("clears error on successful refresh", async () => {
      dashboardAPI.getLibrarianStats.mockRejectedValueOnce(
        new Error("Initial error")
      );
      dashboardAPI.getLibrarianStats.mockResolvedValueOnce({
        data: mockLibrarianStats,
      });

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch dashboard statistics");

      await act(async () => {
        await result.current.refreshStats();
      });

      expect(result.current.error).toBe(null);
      expect(result.current.stats).toEqual(mockLibrarianStats);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty stats response", async () => {
      const emptyStats = {
        total_books: 0,
        total_borrowed: 0,
        books_due_today: 0,
        overdue_count: 0,
        overdue_borrowings: [],
        my_borrowings: [],
        my_overdue_borrowings: [],
      };
      dashboardAPI.getLibrarianStats.mockResolvedValue({ data: emptyStats });

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(emptyStats);
      expect(result.current.error).toBe(null);
    });

    it("handles partial stats response", async () => {
      const partialStats = {
        total_books: 50,
        // Missing other fields
      };
      dashboardAPI.getLibrarianStats.mockResolvedValue({ data: partialStats });

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(partialStats);
      expect(result.current.error).toBe(null);
    });

    it("handles very large numbers in stats", async () => {
      const largeStats = {
        total_books: 999999,
        total_borrowed: 888888,
        books_due_today: 777777,
        overdue_count: 666666,
        overdue_borrowings: [],
        my_borrowings: [],
        my_overdue_borrowings: [],
      };
      dashboardAPI.getLibrarianStats.mockResolvedValue({ data: largeStats });

      const { result } = renderHook(() => useDashboard(true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(largeStats);
    });
  });

  describe("Performance", () => {
    it("does not make unnecessary API calls on re-render with same isLibrarian value", async () => {
      dashboardAPI.getLibrarianStats.mockResolvedValue({
        data: mockLibrarianStats,
      });

      const { result, rerender } = renderHook(
        (isLibrarian) => useDashboard(isLibrarian),
        {
          initialProps: true,
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Re-render with same props
      rerender(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should only call API once (on mount)
      expect(dashboardAPI.getLibrarianStats).toHaveBeenCalledTimes(1);
    });
  });
});
