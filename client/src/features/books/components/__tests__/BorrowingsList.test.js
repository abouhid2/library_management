import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BorrowingsList from "../dashboard/BorrowingsList";

// Mock the SearchBar component
jest.mock("../../../../components/SearchBar", () => {
  return function MockSearchBar({ searchQuery, onSearchChange, placeholder }) {
    return (
      <div data-testid="search-bar">
        <input
          data-testid="search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };
});

// Mock the SortControl component
jest.mock("../../../../components/SortControl", () => {
  return function MockSortControl({
    sortField,
    sortDirection,
    onSortChange,
    sortOptions,
  }) {
    return (
      <div data-testid="sort-control">
        <div data-testid="sort-field">{sortField}</div>
        <div data-testid="sort-direction">{sortDirection}</div>
        {sortOptions.map((option) => (
          <button
            key={option.value}
            data-testid={`sort-option-${option.value}`}
            onClick={() => onSortChange(option.value, "asc")}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };
});

// Mock the useSorting hook
jest.mock("../../../../hooks/useSorting", () => {
  return function useSorting(items, defaultSortField, defaultSortDirection) {
    return {
      sortedItems: items,
      sortField: defaultSortField || "borrowed_at",
      sortDirection: defaultSortDirection || "desc",
      handleSortChange: jest.fn(),
    };
  };
});

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
    it("renders search bar, sort control, and borrowings table", () => {
      render(<BorrowingsList {...mockProps} />);

      expect(screen.getByTestId("search-bar")).toBeInTheDocument();
      expect(screen.getByTestId("sort-control")).toBeInTheDocument();
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

    it("displays all borrowings initially", () => {
      render(<BorrowingsList {...mockProps} />);

      expect(screen.getByTestId("borrowing-0")).toHaveTextContent(
        "Test Book 1"
      );
      expect(screen.getByTestId("borrowing-1")).toHaveTextContent(
        "Test Book 2"
      );
    });

    it("renders search bar with correct placeholder", () => {
      render(<BorrowingsList {...mockProps} />);

      const searchInput = screen.getByTestId("search-input");
      expect(searchInput).toHaveAttribute(
        "placeholder",
        "Search by book title, author, user name or email"
      );
    });

    it("renders sort control with correct options", () => {
      render(<BorrowingsList {...mockProps} />);

      expect(screen.getByTestId("sort-option-book.title")).toBeInTheDocument();
      expect(screen.getByTestId("sort-option-book.author")).toBeInTheDocument();
      expect(screen.getByTestId("sort-option-user.name")).toBeInTheDocument();
      expect(screen.getByTestId("sort-option-borrowed_at")).toBeInTheDocument();
      expect(screen.getByTestId("sort-option-due_at")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("filters borrowings by book title", () => {
      render(<BorrowingsList {...mockProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Test Book 1" } });

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("1");
      expect(screen.getByTestId("borrowing-0")).toHaveTextContent(
        "Test Book 1"
      );
      expect(screen.queryByTestId("borrowing-1")).not.toBeInTheDocument();
    });

    it("filters borrowings by author", () => {
      render(<BorrowingsList {...mockProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Test Author 2" } });

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("1");
      expect(screen.getByTestId("borrowing-0")).toHaveTextContent(
        "Test Book 2"
      );
    });

    it("filters borrowings by user name", () => {
      render(<BorrowingsList {...mockProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Test User 1" } });

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("1");
      expect(screen.getByTestId("borrowing-0")).toHaveTextContent(
        "Test Book 1"
      );
    });

    it("filters borrowings by user email", () => {
      render(<BorrowingsList {...mockProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "test2@example.com" } });

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("1");
      expect(screen.getByTestId("borrowing-0")).toHaveTextContent(
        "Test Book 2"
      );
    });

    it("shows all borrowings when search is cleared", () => {
      render(<BorrowingsList {...mockProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Test Book 1" } });
      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("1");

      fireEvent.change(searchInput, { target: { value: "" } });
      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("2");
    });

    it("handles case-insensitive search", () => {
      render(<BorrowingsList {...mockProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "test book 1" } });

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("1");
      expect(screen.getByTestId("borrowing-0")).toHaveTextContent(
        "Test Book 1"
      );
    });
  });

  describe("Sorting Functionality", () => {
    it("renders sort control with default sort field", () => {
      render(<BorrowingsList {...mockProps} />);

      expect(screen.getByTestId("sort-field")).toHaveTextContent("borrowed_at");
      expect(screen.getByTestId("sort-direction")).toHaveTextContent("desc");
    });

    it("allows clicking on sort options", () => {
      render(<BorrowingsList {...mockProps} />);

      const titleSortButton = screen.getByTestId("sort-option-book.title");
      fireEvent.click(titleSortButton);

      // The mock will call the handler, but we can't easily test the result
      // since the hook is mocked. In a real scenario, this would trigger sorting.
      expect(titleSortButton).toBeInTheDocument();
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

  describe("Return Functionality", () => {
    it("passes onReturn function to table", () => {
      const mockReturn = jest.fn();
      render(<BorrowingsList {...mockProps} onReturn={mockReturn} />);

      // The actual return button would be in BorrowingsTable component
      expect(screen.getByTestId("borrowings-table")).toBeInTheDocument();
    });

    it("handles undefined onReturn function", () => {
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
        {
          id: 2,
          book: { title: "Test Book", author: null },
          user: null,
          borrowed_date: "2023-12-31",
          due_date: "2024-01-09",
          status: "overdue",
        },
      ];

      render(
        <BorrowingsList {...mockProps} borrowings={incompleteBorrowings} />
      );

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("2");
    });

    it("handles search with incomplete data", () => {
      const incompleteBorrowings = [
        {
          id: 1,
          book: { title: "Test Book", author: null },
          user: { name: "Test User", email: null },
          borrowed_date: "2023-12-31",
          due_date: "2024-01-14",
          status: "overdue",
        },
      ];

      render(
        <BorrowingsList {...mockProps} borrowings={incompleteBorrowings} />
      );

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Test Book" } });

      expect(screen.getByTestId("borrowings-count")).toHaveTextContent("1");
    });
  });
});
