import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardStats from "../dashboard/DashboardStats";

describe("DashboardStats", () => {
  const mockStats = {
    total_books: 10,
    total_copies: 0,
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
      expect(screen.getByText("10 (0)")).toBeInTheDocument();

      expect(screen.getByText("Currently Borrowed")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();

      expect(screen.getByText("Due Today")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();

      expect(screen.getByText("Overdue")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("displays correct descriptions for librarian", () => {
      render(<DashboardStats stats={mockStats} isLibrarian={true} />);

      expect(
        screen.getByText("Books in library (total copies)")
      ).toBeInTheDocument();
      expect(screen.getByText("Books checked out")).toBeInTheDocument();
      expect(screen.getByText("Books due today")).toBeInTheDocument();
      expect(screen.getByText("Overdue books")).toBeInTheDocument();
    });
  });

  describe("Member Dashboard Stats", () => {
    it("renders member statistics cards correctly", () => {
      render(<DashboardStats stats={mockStats} isLibrarian={false} />);

      expect(screen.getByText("Total Books")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();

      expect(screen.getByText("My Borrowed Books")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();

      expect(screen.getByText("Due Today")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();

      expect(screen.getByText("My Overdue")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("displays correct descriptions for member", () => {
      render(<DashboardStats stats={mockStats} isLibrarian={false} />);

      expect(screen.getByText("Books in library")).toBeInTheDocument();
      // Member cards don't have descriptions for borrowed, due today, and overdue
    });
  });

  describe("Edge Cases", () => {
    it("handles zero values correctly", () => {
      const zeroStats = {
        total_books: 0,
        total_copies: 0,
        total_borrowed: 0,
        books_due_today: 0,
        overdue_count: 0,
        my_borrowed: 0,
      };

      render(<DashboardStats stats={zeroStats} isLibrarian={true} />);

      // Use getAllByText instead of getByText for multiple elements
      const zeroElements = screen.getAllByText("0");
      expect(zeroElements).toHaveLength(3); // Only 3 cards show "0" for librarian view
    });

    it("handles missing stats gracefully", () => {
      const incompleteStats = {
        total_books: 5,
        // Missing other stats
      };

      render(<DashboardStats stats={incompleteStats} isLibrarian={true} />);

      expect(screen.getByText("5 (0)")).toBeInTheDocument();
      expect(screen.getAllByText("0")).toHaveLength(3); // Default values for missing stats
    });

    it("handles null or undefined stats", () => {
      render(<DashboardStats stats={null} isLibrarian={true} />);

      // Should render with default values
      expect(screen.getAllByText("0")).toHaveLength(3);
    });
  });

  describe("Color Coding", () => {
    it("applies correct color classes to stat cards", () => {
      const { container } = render(
        <DashboardStats stats={mockStats} isLibrarian={true} />
      );

      // Check for color classes
      expect(container.querySelector(".bg-highlight")).toBeInTheDocument();
      expect(container.querySelector(".bg-warning")).toBeInTheDocument();
      expect(container.querySelector(".bg-error")).toBeInTheDocument();
    });
  });
});
