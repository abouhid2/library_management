import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders search input with default placeholder", () => {
      render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByRole("searchbox");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("placeholder", "Search...");
    });

    it("renders search input with custom placeholder", () => {
      const customPlaceholder = "Search by title, author or genre";
      render(
        <SearchBar
          searchQuery=""
          onSearchChange={mockOnSearchChange}
          placeholder={customPlaceholder}
        />
      );

      const searchInput = screen.getByRole("searchbox");
      expect(searchInput).toHaveAttribute("placeholder", customPlaceholder);
    });

    it("displays the search query value", () => {
      const searchQuery = "test search";
      render(
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={mockOnSearchChange}
        />
      );

      const searchInput = screen.getByRole("searchbox");
      expect(searchInput).toHaveValue(searchQuery);
    });

    it("renders search icon", () => {
      render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />);

      const searchIcon = screen.getByTestId("search-icon");
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe("User Interaction", () => {
    it("calls onSearchChange when user types", () => {
      render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByRole("searchbox");
      fireEvent.change(searchInput, { target: { value: "new search" } });

      expect(mockOnSearchChange).toHaveBeenCalledWith("new search");
    });

    it("calls onSearchChange with empty string when user clears input", () => {
      render(
        <SearchBar searchQuery="existing" onSearchChange={mockOnSearchChange} />
      );

      const searchInput = screen.getByRole("searchbox");
      fireEvent.change(searchInput, { target: { value: "" } });

      expect(mockOnSearchChange).toHaveBeenCalledWith("");
    });
  });

  describe("Accessibility", () => {
    it("has proper label for screen readers", () => {
      render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />);

      const label = screen.getByText("Search");
      expect(label).toHaveAttribute("class", "sr-only");
    });

    it("has proper input attributes", () => {
      render(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByRole("searchbox");
      expect(searchInput).toHaveAttribute("type", "search");
      expect(searchInput).toHaveAttribute("id", "search");
      expect(searchInput).toHaveAttribute("name", "search");
    });
  });
});
