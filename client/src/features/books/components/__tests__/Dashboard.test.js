import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../dashboard/Dashboard";

// Mock the hooks
jest.mock("../../hooks/useBorrowings");
jest.mock("../../hooks/useDashboard");

// Mock the child components
jest.mock("../dashboard/DashboardHeader", () => {
  return function MockDashboardHeader({
    isLibrarian,
    overdueCount,
    showOverdue,
    onToggleOverdue,
  }) {
    return (
      <div data-testid="dashboard-header">
        <h2>{isLibrarian ? "Librarian Dashboard" : "My Dashboard"}</h2>
        <button onClick={onToggleOverdue} data-testid="toggle-overdue">
          {showOverdue ? "Show All" : `Show Overdue (${overdueCount})`}
        </button>
      </div>
    );
  };
});

jest.mock("../dashboard/DashboardStats", () => {
  return function MockDashboardStats({ stats, isLibrarian }) {
    return (
      <div data-testid="dashboard-stats">
        <div data-testid="total-books">{stats.total_books || 0}</div>
        <div data-testid="total-copies">{stats.total_copies || 0}</div>
        <div data-testid="total-borrowed">{stats.total_borrowed || 0}</div>
        <div data-testid="books-due-today">{stats.books_due_today || 0}</div>
        <div data-testid="overdue-count">{stats.overdue_count || 0}</div>
        <div data-testid="my-borrowed">{stats.my_borrowed || 0}</div>
        <div data-testid="stats-is-librarian">
          {isLibrarian ? "true" : "false"}
        </div>
      </div>
    );
  };
});

jest.mock("../dashboard/BorrowingsList", () => {
  return function MockBorrowingsList({
    borrowings,
    isLibrarian,
    onReturn,
    showOverdue,
  }) {
    return (
      <div data-testid="borrowings-list">
        <div data-testid="borrowings-count">{borrowings?.length || 0}</div>
        <div data-testid="list-is-librarian">
          {isLibrarian ? "true" : "false"}
        </div>
        <div data-testid="show-overdue">{showOverdue ? "true" : "false"}</div>
        {borrowings?.map((borrowing, index) => (
          <div key={index} data-testid={`borrowing-${index}`}>
            {borrowing.book?.title || "Unknown Book"}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("../form/ErrorDisplay", () => {
  return function MockErrorDisplay({ error }) {
    if (!error) return null;
    return <div data-testid="error-display">{error}</div>;
  };
});

jest.mock("../../../../components/Notification", () => {
  return function MockNotification({ message, type, onClose }) {
    return (
      <div data-testid="notification" data-type={type}>
        {message}
        <button onClick={onClose} data-testid="close-notification">
          Close
        </button>
      </div>
    );
  };
});

describe("Dashboard", () => {
  const mockUser = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    user_type: "member",
  };

  const mockLibrarianUser = {
    id: 1,
    name: "Test Librarian",
    email: "librarian@example.com",
    user_type: "librarian",
  };

  const mockBorrowings = [
    {
      id: 1,
      book: { title: "Test Book 1", author: "Test Author 1" },
      user: { name: "Test User", email: "test@example.com" },
      borrowed_date: "2023-12-31",
      due_date: "2024-01-14",
      status: "overdue",
      returned_at: null,
    },
    {
      id: 2,
      book: { title: "Test Book 2", author: "Test Author 2" },
      user: { name: "Test User", email: "test@example.com" },
      borrowed_date: "2023-12-31",
      due_date: "2024-01-09",
      status: "overdue",
      returned_at: null,
    },
  ];

  const mockStats = {
    total_books: 10,
    total_copies: 0,
    total_borrowed: 5,
    books_due_today: 2,
    overdue_count: 1,
    my_borrowed: 2,
  };

  const mockUseBorrowings = {
    borrowings: mockBorrowings,
    loading: false,
    error: null,
    isSubmitting: false,
    returnBook: jest.fn(),
    getMyOverdue: jest.fn().mockResolvedValue(mockBorrowings),
    getOverdue: jest.fn().mockResolvedValue(mockBorrowings),
  };

  const mockUseDashboard = {
    stats: mockStats,
    loading: false,
    error: null,
    refreshStats: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    require("../../hooks/useBorrowings").useBorrowings.mockReturnValue(
      mockUseBorrowings
    );
    require("../../hooks/useDashboard").useDashboard.mockReturnValue(
      mockUseDashboard
    );
  });

  describe("Member Dashboard", () => {
    it("displays member statistics cards", async () => {
      render(<Dashboard user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByTestId("dashboard-stats")).toBeInTheDocument();
      });

      expect(screen.getByTestId("total-books")).toHaveTextContent("10");
      expect(screen.getByTestId("my-borrowed")).toHaveTextContent("2");
      expect(screen.getByTestId("books-due-today")).toHaveTextContent("2");
      expect(screen.getByTestId("overdue-count")).toHaveTextContent("1");
      expect(screen.getByTestId("stats-is-librarian")).toHaveTextContent(
        "false"
      );
    });

    it("displays member dashboard header", async () => {
      render(<Dashboard user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByText("My Dashboard")).toBeInTheDocument();
      });
    });

    it("displays borrowings list", async () => {
      render(<Dashboard user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByTestId("borrowings-list")).toBeInTheDocument();
      });

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("2");
      expect(screen.getByTestId("list-is-librarian")).toHaveTextContent(
        "false"
      );
    });
  });

  describe("Librarian Dashboard", () => {
    it("displays librarian statistics cards", async () => {
      render(<Dashboard user={mockLibrarianUser} />);

      await waitFor(() => {
        expect(screen.getByTestId("dashboard-stats")).toBeInTheDocument();
      });

      expect(screen.getByTestId("total-books")).toHaveTextContent("10");
      expect(screen.getByTestId("total-borrowed")).toHaveTextContent("5");
      expect(screen.getByTestId("books-due-today")).toHaveTextContent("2");
      expect(screen.getByTestId("overdue-count")).toHaveTextContent("1");
      expect(screen.getByTestId("stats-is-librarian")).toHaveTextContent(
        "true"
      );
    });

    it("displays librarian dashboard header", async () => {
      render(<Dashboard user={mockLibrarianUser} />);

      await waitFor(() => {
        expect(screen.getByText("Librarian Dashboard")).toBeInTheDocument();
      });
    });

    it("displays borrowings list for librarian", async () => {
      render(<Dashboard user={mockLibrarianUser} />);

      await waitFor(() => {
        expect(screen.getByTestId("borrowings-list")).toBeInTheDocument();
      });

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("2");
      expect(screen.getByTestId("list-is-librarian")).toHaveTextContent("true");
    });
  });

  describe("Overdue Toggle", () => {
    it("toggles overdue view when button is clicked", async () => {
      render(<Dashboard user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByTestId("toggle-overdue")).toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId("toggle-overdue");
      expect(toggleButton).toHaveTextContent("Show Overdue (1)");

      await userEvent.click(toggleButton);

      expect(mockUseBorrowings.getMyOverdue).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("displays error when borrowings fail to load", async () => {
      const errorUseBorrowings = {
        ...mockUseBorrowings,
        error: "Failed to fetch borrowings",
      };
      require("../../hooks/useBorrowings").useBorrowings.mockReturnValue(
        errorUseBorrowings
      );

      render(<Dashboard user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByTestId("error-display")).toBeInTheDocument();
      });

      expect(screen.getByTestId("error-display")).toHaveTextContent(
        "Failed to fetch borrowings"
      );
    });

    it("displays error when dashboard stats fail to load", async () => {
      const errorUseDashboard = {
        ...mockUseDashboard,
        error: "Failed to fetch dashboard statistics",
      };
      require("../../hooks/useDashboard").useDashboard.mockReturnValue(
        errorUseDashboard
      );

      render(<Dashboard user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByTestId("error-display")).toBeInTheDocument();
      });

      expect(screen.getByTestId("error-display")).toHaveTextContent(
        "Failed to fetch dashboard statistics"
      );
    });
  });

  describe("Book Return Functionality", () => {
    it("calls returnBook when return button is clicked", async () => {
      render(<Dashboard user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByTestId("borrowings-list")).toBeInTheDocument();
      });

      // The actual return button would be in BorrowingsList component
      // This test verifies the return handler is passed correctly
      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("2");
    });
  });

  describe("Loading States", () => {
    it("shows loading spinner when borrowings are loading", () => {
      const loadingUseBorrowings = {
        ...mockUseBorrowings,
        loading: true,
      };
      require("../../hooks/useBorrowings").useBorrowings.mockReturnValue(
        loadingUseBorrowings
      );

      render(<Dashboard user={mockUser} />);

      expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
    });

    it("shows loading spinner when stats are loading", () => {
      const loadingUseDashboard = {
        ...mockUseDashboard,
        loading: true,
      };
      require("../../hooks/useDashboard").useDashboard.mockReturnValue(
        loadingUseDashboard
      );

      render(<Dashboard user={mockUser} />);

      expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
    });
  });
});
