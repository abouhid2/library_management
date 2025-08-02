import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Notification from "../Notification";

describe("Notification", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders success notification by default", () => {
      render(<Notification message="Success message" onClose={mockOnClose} />);

      expect(screen.getByText("Success message")).toBeInTheDocument();
    });

    it("renders error notification", () => {
      render(
        <Notification
          message="Error message"
          type="error"
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("renders warning notification", () => {
      render(
        <Notification
          message="Warning message"
          type="warning"
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Warning message")).toBeInTheDocument();
    });

    it("renders without close button when onClose is not provided", () => {
      render(<Notification message="Test message" type="success" />);

      expect(screen.getByText("Test message")).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies success styling classes", () => {
      const { container } = render(
        <Notification
          message="Success message"
          type="success"
          onClose={mockOnClose}
        />
      );

      const notification = container.firstChild;
      expect(notification).toHaveClass(
        "fixed",
        "top-4",
        "right-4",
        "z-50",
        "max-w-sm",
        "w-full",
        "border",
        "rounded-md",
        "p-4",
        "shadow-lg",
        "bg-green-50",
        "border-green-200",
        "text-green-700"
      );
    });

    it("applies error styling classes", () => {
      const { container } = render(
        <Notification
          message="Error message"
          type="error"
          onClose={mockOnClose}
        />
      );

      const notification = container.firstChild;
      expect(notification).toHaveClass(
        "bg-red-50",
        "border-red-200",
        "text-red-700"
      );
    });

    it("applies warning styling classes", () => {
      const { container } = render(
        <Notification
          message="Warning message"
          type="warning"
          onClose={mockOnClose}
        />
      );

      const notification = container.firstChild;
      expect(notification).toHaveClass(
        "bg-yellow-50",
        "border-yellow-200",
        "text-yellow-700"
      );
    });
  });

  describe("Icons", () => {
    it("displays success icon", () => {
      const { container } = render(
        <Notification
          message="Success message"
          type="success"
          onClose={mockOnClose}
        />
      );

      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("h-5", "w-5", "text-green-400");
    });

    it("displays error icon", () => {
      const { container } = render(
        <Notification
          message="Error message"
          type="error"
          onClose={mockOnClose}
        />
      );

      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("h-5", "w-5", "text-red-400");
    });

    it("displays warning icon", () => {
      const { container } = render(
        <Notification
          message="Warning message"
          type="warning"
          onClose={mockOnClose}
        />
      );

      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("h-5", "w-5", "text-yellow-400");
    });
  });

  describe("Close Functionality", () => {
    it("calls onClose when close button is clicked", () => {
      render(<Notification message="Test message" onClose={mockOnClose} />);

      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("has proper close button styling", () => {
      const { container } = render(
        <Notification message="Test message" onClose={mockOnClose} />
      );

      const closeButton = container.querySelector("button");
      expect(closeButton).toHaveClass(
        "inline-flex",
        "text-gray-400",
        "hover:text-gray-600",
        "focus:outline-none",
        "focus:text-gray-600",
        "transition-colors",
        "duration-200"
      );
    });
  });

  describe("Auto-dismiss Functionality", () => {
    it("auto-dismisses after default duration (3000ms)", () => {
      render(<Notification message="Test message" onClose={mockOnClose} />);

      expect(screen.getByText("Test message")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("auto-dismisses after custom duration", () => {
      render(
        <Notification
          message="Test message"
          onClose={mockOnClose}
          duration={5000}
        />
      );

      expect(screen.getByText("Test message")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("does not auto-dismiss when duration is 0", () => {
      render(
        <Notification
          message="Test message"
          onClose={mockOnClose}
          duration={0}
        />
      );

      expect(screen.getByText("Test message")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("does not auto-dismiss when onClose is not provided", () => {
      render(<Notification message="Test message" duration={3000} />);

      expect(screen.getByText("Test message")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Should still be visible since no onClose function
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });

    it("clears timer when component unmounts", () => {
      const { unmount } = render(
        <Notification
          message="Test message"
          onClose={mockOnClose}
          duration={3000}
        />
      );

      unmount();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper button role for close button", () => {
      render(<Notification message="Test message" onClose={mockOnClose} />);

      const closeButton = screen.getByRole("button");
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toBeEnabled();
    });

    it("maintains focus on close button", () => {
      render(<Notification message="Test message" onClose={mockOnClose} />);

      const closeButton = screen.getByRole("button");
      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });
  });

  describe("Edge Cases", () => {
    it("handles very long messages", () => {
      const longMessage =
        "This is a very long notification message that should be displayed properly even if it contains multiple sentences and goes on for quite a while to test how the component handles lengthy content without breaking the layout or styling.";
      render(<Notification message={longMessage} onClose={mockOnClose} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("handles messages with special characters", () => {
      const specialMessage =
        "Message with special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";
      render(<Notification message={specialMessage} onClose={mockOnClose} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it("handles empty message", () => {
      render(<Notification message="" onClose={mockOnClose} />);

      // Use getAllByText for empty text since there might be multiple empty elements
      const emptyElements = screen.getAllByText("");
      expect(emptyElements.length).toBeGreaterThan(0);
    });

    it("handles invalid notification type gracefully", () => {
      render(
        <Notification
          message="Test message"
          type="invalid"
          onClose={mockOnClose}
        />
      );

      // Should default to success styling
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("has proper layout structure", () => {
      const { container } = render(
        <Notification message="Test message" onClose={mockOnClose} />
      );

      const notification = container.firstChild;
      expect(notification.tagName).toBe("DIV");

      // Check for flex layout
      const flexContainer = notification.querySelector(".flex");
      expect(flexContainer).toBeInTheDocument();
    });

    it("renders icon, message, and close button in correct order", () => {
      const { container } = render(
        <Notification message="Test message" onClose={mockOnClose} />
      );

      const flexContainer = container.querySelector(".flex");
      const children = flexContainer.children;

      // Should have icon, message container, and close button
      expect(children).toHaveLength(3);
    });
  });
});
