import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SortControl from "../SortControl";

describe("SortControl", () => {
  const mockOnSortChange = jest.fn();
  const mockSortOptions = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" },
    { value: "date", label: "Date" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders sort options correctly", () => {
      render(
        <SortControl
          sortField="title"
          sortDirection="asc"
          onSortChange={mockOnSortChange}
          sortOptions={mockSortOptions}
        />
      );

      expect(screen.getByText("Sort by:")).toBeInTheDocument();
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Author")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <SortControl
          sortField="title"
          sortDirection="asc"
          onSortChange={mockOnSortChange}
          sortOptions={mockSortOptions}
          className="custom-class"
        />
      );

      const container = screen.getByText("Sort by:").closest("div");
      expect(container).toHaveClass("custom-class");
    });
  });

  describe("Sort Button States", () => {
    it("highlights active sort field", () => {
      render(
        <SortControl
          sortField="title"
          sortDirection="asc"
          onSortChange={mockOnSortChange}
          sortOptions={mockSortOptions}
        />
      );

      const titleButton = screen.getByTestId("sort-title");
      const authorButton = screen.getByTestId("sort-author");

      expect(titleButton).toHaveClass("bg-blue-100", "text-blue-700");
      expect(authorButton).toHaveClass("bg-gray-100", "text-gray-600");
    });

    it("shows correct sort direction icons", () => {
      render(
        <SortControl
          sortField="title"
          sortDirection="asc"
          onSortChange={mockOnSortChange}
          sortOptions={mockSortOptions}
        />
      );

      const titleButton = screen.getByTestId("sort-title");
      expect(titleButton).toBeInTheDocument();
    });
  });

  describe("User Interaction", () => {
    it("calls onSortChange with new field when clicking different field", () => {
      render(
        <SortControl
          sortField="title"
          sortDirection="asc"
          onSortChange={mockOnSortChange}
          sortOptions={mockSortOptions}
        />
      );

      const authorButton = screen.getByTestId("sort-author");
      fireEvent.click(authorButton);

      expect(mockOnSortChange).toHaveBeenCalledWith("author", "asc");
    });

    it("toggles sort direction when clicking same field", () => {
      render(
        <SortControl
          sortField="title"
          sortDirection="asc"
          onSortChange={mockOnSortChange}
          sortOptions={mockSortOptions}
        />
      );

      const titleButton = screen.getByTestId("sort-title");
      fireEvent.click(titleButton);

      expect(mockOnSortChange).toHaveBeenCalledWith("title", "desc");
    });

    it("changes direction from desc to asc when clicking same field", () => {
      render(
        <SortControl
          sortField="title"
          sortDirection="desc"
          onSortChange={mockOnSortChange}
          sortOptions={mockSortOptions}
        />
      );

      const titleButton = screen.getByTestId("sort-title");
      fireEvent.click(titleButton);

      expect(mockOnSortChange).toHaveBeenCalledWith("title", "asc");
    });
  });

  describe("Accessibility", () => {
    it("has proper test IDs for sort buttons", () => {
      render(
        <SortControl
          sortField="title"
          sortDirection="asc"
          onSortChange={mockOnSortChange}
          sortOptions={mockSortOptions}
        />
      );

      expect(screen.getByTestId("sort-title")).toBeInTheDocument();
      expect(screen.getByTestId("sort-author")).toBeInTheDocument();
      expect(screen.getByTestId("sort-date")).toBeInTheDocument();
    });
  });
}); 