import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardStats from "../DashboardStats";

describe("DashboardStats", () => {
  const mockStats = {
    total_books: 10,
    total_borrowed: 5,
    books_due_today: 2,
    overdue_count: 1,
    my_borrowed: 3,
  };

  describe("Librarian Dashboard Stats", () => {
    it("renders librarian statistics cards correctly", () => {
      render(<DashboardStats stats={mockStats} isLibrarian={true} />);

      // Check all four stat cards are present
      expect(screen.getByText("Total Books")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();

      expect(screen.getByText("Currently Borrowed")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();

      expect(screen.getByText("Due Today")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();

      expect(screen.getByText("Overdue")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("displays correct descriptions for librarian", () => {
      render(<DashboardStats stats={mockStats} isLibrarian={true} />);

      expect(screen.getByText("Books in library")).toBeInTheDocument();
      expect(screen.getByText("Books checked out")).toBeInTheDocument();
      expect(screen.getByText("Books due today")).toBeInTheDocument();
      expect(screen.getByText("Overdue books")).toBeInTheDocument();
    });

    it("shows correct icons for librarian stats", () => {
      render(<DashboardStats stats={mockStats} isLibrarian={true} />);

      // Check that icons are present (they're emoji characters)
      const cards = screen.getAllByRole("generic");
      expect(cards.some((card) => card.textContent.includes("📚"))).toBe(true);
      expect(cards.some((card) => card.textContent.includes("📖"))).toBe(true);
      expect(cards.some((card) => card.textContent.includes("📅"))).toBe(true);
      expect(cards.some((card) => card.textContent.includes("⚠️"))).toBe(true);
    });
  });

  describe("Member Dashboard Stats", () => {
    it("renders member statistics cards correctly", () => {
      render(<DashboardStats stats={mockStats} isLibrarian={false} />);

      // Check all four stat cards are present
      expect(screen.getByText("Total Books")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();

      expect(screen.getByText("My Borrowed")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();

      expect(screen.getByText("Due Today")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();

      expect(screen.getByText("My Overdue")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("displays correct descriptions for member", () => {
      render(<DashboardStats stats={mockStats} isLibrarian={false} />);

      expect(screen.getByText("Books in library")).toBeInTheDocument();
      expect(screen.getByText("Books I've borrowed")).toBeInTheDocument();
      expect(screen.getByText("My books due today")).toBeInTheDocument();
      expect(screen.getByText("My overdue books")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles zero values correctly", () => {
      const zeroStats = {
        total_books: 0,
        total_borrowed: 0,
        books_due_today: 0,
        overdue_count: 0,
        my_borrowed: 0,
      };

      render(<DashboardStats stats={zeroStats} isLibrarian={true} />);

      // Use getAllByText instead of getByText for multiple elements
      const zeroElements = screen.getAllByText("0");
      expect(zeroElements).toHaveLength(4);
    });

    it("handles missing stats gracefully", () => {
      const incompleteStats = {
        total_books: 5,
        // Missing other stats
      };

      render(<DashboardStats stats={incompleteStats} isLibrarian={true} />);

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getAllByText("0")).toHaveLength(3); // Default values for missing stats
    });

    it("handles null or undefined stats", () => {
      render(<DashboardStats stats={{}} isLibrarian={true} />);

      // Should render with default values
      expect(screen.getAllByText("0")).toHaveLength(4);
    });
  });

  describe("Responsive Design", () => {
    it("renders with correct CSS classes for responsive grid", () => {
      const { container } = render(
        <DashboardStats stats={mockStats} isLibrarian={true} />
      );

      const gridContainer = container.firstChild;
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-4"
      );
    });

    it("renders stat cards with correct styling classes", () => {
      const { container } = render(
        <DashboardStats stats={mockStats} isLibrarian={true} />
      );

      const cards = container.querySelectorAll(
        ".bg-white.rounded-lg.shadow-md"
      );
      expect(cards).toHaveLength(4);
    });
  });

  describe("Color Coding", () => {
    it("applies correct color classes to stat cards", () => {
      const { container } = render(
        <DashboardStats stats={mockStats} isLibrarian={true} />
      );

      // Check for color classes
      expect(container.querySelector(".bg-blue-500")).toBeInTheDocument();
      expect(container.querySelector(".bg-green-500")).toBeInTheDocument();
      expect(container.querySelector(".bg-orange-500")).toBeInTheDocument();
      expect(container.querySelector(".bg-red-500")).toBeInTheDocument();
    });
  });
});
