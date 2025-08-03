import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardHeader from "../dashboard/DashboardHeader";

describe("DashboardHeader", () => {
  const mockProps = {
    isLibrarian: false,
    overdueCount: 5,
    showOverdue: false,
    onToggleOverdue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders member dashboard header correctly", () => {
      render(<DashboardHeader {...mockProps} />);

      expect(screen.getByText("My Dashboard")).toBeInTheDocument();
      expect(
        screen.getByText("Track your borrowed books and due dates")
      ).toBeInTheDocument();
      expect(screen.getByText("Show Overdue (5)")).toBeInTheDocument();
    });

    it("renders librarian dashboard header correctly", () => {
      render(<DashboardHeader {...mockProps} isLibrarian={true} />);

      expect(screen.getByText("Librarian Dashboard")).toBeInTheDocument();
      expect(
        screen.getByText("Monitor library operations and manage borrowings")
      ).toBeInTheDocument();
      expect(screen.getByText("Show Overdue (5)")).toBeInTheDocument();
    });

    it("displays correct overdue count", () => {
      render(<DashboardHeader {...mockProps} overdueCount={3} />);

      expect(screen.getByText("Show Overdue (3)")).toBeInTheDocument();
    });

    it("shows 'Show All' when showOverdue is true", () => {
      render(<DashboardHeader {...mockProps} showOverdue={true} />);

      expect(screen.getByText("Show All")).toBeInTheDocument();
    });
  });

  describe("Interaction", () => {
    it("calls onToggleOverdue when button is clicked", async () => {
      render(<DashboardHeader {...mockProps} />);

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(mockProps.onToggleOverdue).toHaveBeenCalledTimes(1);
    });

    it("calls onToggleOverdue with event object", async () => {
      render(<DashboardHeader {...mockProps} />);

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(mockProps.onToggleOverdue).toHaveBeenCalledWith(
        expect.any(Object)
      );
    });
  });

  describe("Button Styling", () => {
    it("applies correct styling when showing overdue", () => {
      const { container } = render(
        <DashboardHeader {...mockProps} showOverdue={true} />
      );

      const button = container.querySelector("button");
      expect(button).toHaveClass(
        "bg-neutral",
        "hover:bg-secondary",
        "text-primary"
      );
    });

    it("applies correct styling when not showing overdue", () => {
      const { container } = render(
        <DashboardHeader {...mockProps} showOverdue={false} />
      );

      const button = container.querySelector("button");
      expect(button).toHaveClass(
        "bg-warning",
        "hover:bg-warning/80",
        "text-white"
      );
    });
  });

  describe("Accessibility", () => {
    it("has accessible button with proper role", () => {
      render(<DashboardHeader {...mockProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has proper heading structure", () => {
      render(<DashboardHeader {...mockProps} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("My Dashboard");
    });
  });
});
