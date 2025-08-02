import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DashboardHeader } from "../dashboard";

describe("DashboardHeader", () => {
  const mockOnToggleOverdue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Librarian Dashboard Header", () => {
    it("renders librarian dashboard title and description", () => {
      render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={3}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      expect(screen.getByText("Librarian Dashboard")).toBeInTheDocument();
      expect(
        screen.getByText("Monitor library operations and manage borrowings")
      ).toBeInTheDocument();
    });

    it("shows overdue toggle button with correct count", () => {
      render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={5}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      expect(screen.getByText("Show Overdue (5)")).toBeInTheDocument();
    });

    it("shows 'Show All' button when overdue view is active", () => {
      render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={5}
          showOverdue={true}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      expect(screen.getByText("Show All")).toBeInTheDocument();
    });

    it("calls onToggleOverdue when button is clicked", () => {
      render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={3}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      const toggleButton = screen.getByText("Show Overdue (3)");
      fireEvent.click(toggleButton);

      expect(mockOnToggleOverdue).toHaveBeenCalledTimes(1);
    });
  });

  describe("Member Dashboard Header", () => {
    it("renders member dashboard title and description", () => {
      render(
        <DashboardHeader
          isLibrarian={false}
          overdueCount={1}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      expect(screen.getByText("My Dashboard")).toBeInTheDocument();
      expect(
        screen.getByText("Track your borrowed books and due dates")
      ).toBeInTheDocument();
    });

    it("shows overdue toggle button with correct count for member", () => {
      render(
        <DashboardHeader
          isLibrarian={false}
          overdueCount={2}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      expect(screen.getByText("Show Overdue (2)")).toBeInTheDocument();
    });
  });

  describe("Button Styling", () => {
    it("applies correct styling when showing overdue", () => {
      const { container } = render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={3}
          showOverdue={true}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      const button = container.querySelector("button");
      expect(button).toHaveClass(
        "bg-gray-600",
        "hover:bg-gray-700",
        "text-white"
      );
    });

    it("applies correct styling when not showing overdue", () => {
      const { container } = render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={3}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      const button = container.querySelector("button");
      expect(button).toHaveClass(
        "bg-yellow-600",
        "hover:bg-yellow-700",
        "text-white"
      );
    });
  });

  describe("Edge Cases", () => {
    it("handles zero overdue count", () => {
      render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={0}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      expect(screen.getByText("Show Overdue (0)")).toBeInTheDocument();
    });

    it("handles large overdue count", () => {
      render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={999}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      expect(screen.getByText("Show Overdue (999)")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper button role and clickability", () => {
      render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={3}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it("maintains focus and keyboard navigation", () => {
      render(
        <DashboardHeader
          isLibrarian={true}
          overdueCount={3}
          showOverdue={false}
          onToggleOverdue={mockOnToggleOverdue}
        />
      );

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
