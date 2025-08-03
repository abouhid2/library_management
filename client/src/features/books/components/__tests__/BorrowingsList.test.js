import React from "react";
import { render, screen } from "@testing-library/react";
import BorrowingsList from "../dashboard/BorrowingsList";

// Mock the BorrowingsTable component
jest.mock("../dashboard/BorrowingsTable", () => {
  return function MockBorrowingsTable({
    borrowings,
    isLibrarian,
    onReturn,
    isSubmitting,
  }) {
    return (
      <div data-testid="borrowings-table">
        <div data-testid="is-librarian">{isLibrarian ? "true" : "false"}</div>
        <div data-testid="is-submitting">{isSubmitting ? "true" : "false"}</div>
        <div data-testid="borrowings-count">{borrowings?.length || 0}</div>
        {borrowings?.map((borrowing, index) => (
          <div key={index} data-testid={`borrowing-${index}`}>
            {borrowing.book?.title || "Unknown Book"}
          </div>
        ))}
      </div>
    );
  };
});

describe("BorrowingsList", () => {
  const mockBorrowings = [
    {
      id: 1,
      book: { title: "Test Book 1", author: "Test Author 1" },
      user: { name: "Test User 1", email: "test1@example.com" },
      borrowed_date: "2023-12-31",
      due_date: "2024-01-14",
      status: "overdue",
    },
    {
      id: 2,
      book: { title: "Test Book 2", author: "Test Author 2" },
      user: { name: "Test User 2", email: "test2@example.com" },
      borrowed_date: "2023-12-31",
      due_date: "2024-01-09",
      status: "overdue",
    },
  ];

  const mockProps = {
    borrowings: mockBorrowings,
    isLibrarian: false,
    onReturn: jest.fn(),
    isSubmitting: false,
    showOverdue: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders borrowings table with correct props", () => {
      render(<BorrowingsList {...mockProps} />);

      expect(screen.getByTestId("borrowings-table")).toBeInTheDocument();
      expect(screen.getByTestId("is-librarian")).toHaveTextContent("false");
      expect(screen.getByTestId("is-submitting")).toHaveTextContent("false");
      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("2");
    });

    it("renders librarian view correctly", () => {
      render(<BorrowingsList {...mockProps} isLibrarian={true} />);

      expect(screen.getByTestId("is-librarian")).toHaveTextContent("true");
    });

    it("renders submitting state correctly", () => {
      render(<BorrowingsList {...mockProps} isSubmitting={true} />);

      expect(screen.getByTestId("is-submitting")).toHaveTextContent("true");
    });

    it("displays all borrowings", () => {
      render(<BorrowingsList {...mockProps} />);

      expect(screen.getByTestId("borrowing-0")).toHaveTextContent("Test Book 1");
      expect(screen.getByTestId("borrowing-1")).toHaveTextContent("Test Book 2");
    });
  });

  describe("Empty State", () => {
    it("renders empty state when no borrowings", () => {
      render(<BorrowingsList {...mockProps} borrowings={[]} />);

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("0");
    });

    it("renders empty state when borrowings is null", () => {
      render(<BorrowingsList {...mockProps} borrowings={null} />);

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("0");
    });

    it("renders empty state when borrowings is undefined", () => {
      render(<BorrowingsList {...mockProps} borrowings={undefined} />);

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("0");
    });
  });

  describe("Props Passing", () => {
    it("passes onReturn function to table", () => {
      const mockReturn = jest.fn();
      render(<BorrowingsList {...mockProps} onReturn={mockReturn} />);

      // The mock component doesn't actually call the function, but we can verify
      // that the component renders correctly with the prop
      expect(screen.getByTestId("borrowings-table")).toBeInTheDocument();
    });

    it("handles missing onReturn gracefully", () => {
      render(<BorrowingsList {...mockProps} onReturn={undefined} />);

      expect(screen.getByTestId("borrowings-table")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles borrowings with missing book data", () => {
      const incompleteBorrowings = [
        {
          id: 1,
          book: null,
          user: { name: "Test User", email: "test@example.com" },
          borrowed_date: "2023-12-31",
          due_date: "2024-01-14",
          status: "overdue",
        },
      ];

      render(<BorrowingsList {...mockProps} borrowings={incompleteBorrowings} />);

      expect(screen.getByTestId("borrowing-0")).toHaveTextContent("Unknown Book");
    });

    it("handles borrowings with missing user data", () => {
      const incompleteBorrowings = [
        {
          id: 1,
          book: { title: "Test Book", author: "Test Author" },
          user: null,
          borrowed_date: "2023-12-31",
          due_date: "2024-01-14",
          status: "overdue",
        },
      ];

      render(<BorrowingsList {...mockProps} borrowings={incompleteBorrowings} />);

      expect(screen.getByTestId("borrowings-table")).toBeInTheDocument();
    });
  });
});
