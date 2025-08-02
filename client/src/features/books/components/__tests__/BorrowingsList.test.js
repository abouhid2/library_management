import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BorrowingsList } from "../dashboard";

// Mock the BorrowingsTable component
jest.mock("../BorrowingsTable", () => {
  return function MockBorrowingsTable({
    borrowings,
    isLibrarian,
    onReturn,
    isSubmitting,
  }) {
    return (
      <div data-testid="borrowings-table">
        <div data-testid="borrowings-count">{borrowings.length}</div>
        <div data-testid="is-librarian">{isLibrarian.toString()}</div>
        <div data-testid="is-submitting">{isSubmitting.toString()}</div>
        {borrowings.map((borrowing, index) => (
          <div key={borrowing.id || index} data-testid={`borrowing-${index}`}>
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
      book: { id: 1, title: "Test Book 1", author: "Test Author 1" },
      user: { id: 1, name: "Test User 1", email: "user1@test.com" },
      borrowed_at: "2024-01-01T00:00:00Z",
      due_at: "2024-01-15T00:00:00Z",
      returned_at: null,
    },
    {
      id: 2,
      book: { id: 2, title: "Test Book 2", author: "Test Author 2" },
      user: { id: 2, name: "Test User 2", email: "user2@test.com" },
      borrowed_at: "2024-01-01T00:00:00Z",
      due_at: "2024-01-10T00:00:00Z",
      returned_at: null,
    },
  ];

  const mockOnReturn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with borrowings data", () => {
      render(
        <BorrowingsList
          borrowings={mockBorrowings}
          isLibrarian={true}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={false}
          overdueCount={1}
          activeBorrowingsCount={2}
        />
      );

      expect(screen.getByTestId("borrowings-table")).toBeInTheDocument();
      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("2");
      expect(screen.getByTestId("is-librarian")).toHaveTextContent("true");
      expect(screen.getByTestId("is-submitting")).toHaveTextContent("false");
    });

    it("renders with empty borrowings array", () => {
      render(
        <BorrowingsList
          borrowings={[]}
          isLibrarian={false}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={false}
          overdueCount={0}
          activeBorrowingsCount={0}
        />
      );

      expect(screen.getByTestId("borrowings-table")).toBeInTheDocument();
      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("0");
      expect(screen.getByTestId("is-librarian")).toHaveTextContent("false");
    });

    it("renders with member user type", () => {
      render(
        <BorrowingsList
          borrowings={mockBorrowings}
          isLibrarian={false}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={false}
          overdueCount={1}
          activeBorrowingsCount={2}
        />
      );

      expect(screen.getByTestId("is-librarian")).toHaveTextContent("false");
    });

    it("renders with submitting state", () => {
      render(
        <BorrowingsList
          borrowings={mockBorrowings}
          isLibrarian={true}
          onReturn={mockOnReturn}
          isSubmitting={true}
          showOverdue={false}
          overdueCount={1}
          activeBorrowingsCount={2}
        />
      );

      expect(screen.getByTestId("is-submitting")).toHaveTextContent("true");
    });
  });

  describe("Props Passing", () => {
    it("passes all required props to BorrowingsTable", () => {
      render(
        <BorrowingsList
          borrowings={mockBorrowings}
          isLibrarian={true}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={true}
          overdueCount={1}
          activeBorrowingsCount={2}
        />
      );

      // Verify that the mocked component receives the correct props
      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("2");
      expect(screen.getByTestId("is-librarian")).toHaveTextContent("true");
      expect(screen.getByTestId("is-submitting")).toHaveTextContent("false");
    });

    it("passes individual borrowing items correctly", () => {
      render(
        <BorrowingsList
          borrowings={mockBorrowings}
          isLibrarian={true}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={false}
          overdueCount={1}
          activeBorrowingsCount={2}
        />
      );

      expect(screen.getByTestId("borrowing-0")).toHaveTextContent(
        "Test Book 1"
      );
      expect(screen.getByTestId("borrowing-1")).toHaveTextContent(
        "Test Book 2"
      );
    });
  });

  describe("Container Styling", () => {
    it("applies correct container classes", () => {
      const { container } = render(
        <BorrowingsList
          borrowings={mockBorrowings}
          isLibrarian={true}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={false}
          overdueCount={1}
          activeBorrowingsCount={2}
        />
      );

      const listContainer = container.firstChild;
      expect(listContainer).toHaveClass(
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "overflow-hidden"
      );
    });
  });

  describe("Edge Cases", () => {
    it("handles borrowings with missing book data", () => {
      const incompleteBorrowings = [
        {
          id: 1,
          book: null,
          user: { id: 1, name: "Test User", email: "user@test.com" },
          borrowed_at: "2024-01-01T00:00:00Z",
          due_at: "2024-01-15T00:00:00Z",
          returned_at: null,
        },
      ];

      render(
        <BorrowingsList
          borrowings={incompleteBorrowings}
          isLibrarian={true}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={false}
          overdueCount={1}
          activeBorrowingsCount={1}
        />
      );

      expect(screen.getByTestId("borrowing-0")).toHaveTextContent(
        "Unknown Book"
      );
    });

    it("handles borrowings with missing user data", () => {
      const incompleteBorrowings = [
        {
          id: 1,
          book: { id: 1, title: "Test Book", author: "Test Author" },
          user: null,
          borrowed_at: "2024-01-01T00:00:00Z",
          due_at: "2024-01-15T00:00:00Z",
          returned_at: null,
        },
      ];

      render(
        <BorrowingsList
          borrowings={incompleteBorrowings}
          isLibrarian={true}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={false}
          overdueCount={1}
          activeBorrowingsCount={1}
        />
      );

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("1");
    });

    it("handles borrowings without IDs", () => {
      const borrowingsWithoutIds = [
        {
          book: { id: 1, title: "Test Book 1", author: "Test Author 1" },
          user: { id: 1, name: "Test User 1", email: "user1@test.com" },
          borrowed_at: "2024-01-01T00:00:00Z",
          due_at: "2024-01-15T00:00:00Z",
          returned_at: null,
        },
      ];

      render(
        <BorrowingsList
          borrowings={borrowingsWithoutIds}
          isLibrarian={true}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={false}
          overdueCount={1}
          activeBorrowingsCount={1}
        />
      );

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("1");
    });
  });

  describe("Component Structure", () => {
    it("renders as a single container with BorrowingsTable", () => {
      const { container } = render(
        <BorrowingsList
          borrowings={mockBorrowings}
          isLibrarian={true}
          onReturn={mockOnReturn}
          isSubmitting={false}
          showOverdue={false}
          overdueCount={1}
          activeBorrowingsCount={2}
        />
      );

      // Should have one main container
      expect(container.children).toHaveLength(1);
      expect(screen.getByTestId("borrowings-table")).toBeInTheDocument();
    });
  });
});
