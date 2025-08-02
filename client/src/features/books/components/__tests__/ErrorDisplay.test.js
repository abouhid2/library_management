import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorDisplay from "../ErrorDisplay";

describe("ErrorDisplay", () => {
  describe("Rendering", () => {
    it("renders error message when error is provided", () => {
      const errorMessage = "This is a test error message";
      render(<ErrorDisplay error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("renders nothing when error is null", () => {
      const { container } = render(<ErrorDisplay error={null} />);

      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when error is undefined", () => {
      const { container } = render(<ErrorDisplay error={undefined} />);

      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when error is empty string", () => {
      const { container } = render(<ErrorDisplay error="" />);

      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when error is false", () => {
      const { container } = render(<ErrorDisplay error={false} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Styling", () => {
    it("applies correct error styling classes", () => {
      const { container } = render(<ErrorDisplay error="Test error message" />);

      const errorElement = container.firstChild;
      expect(errorElement).toHaveClass(
        "bg-red-50",
        "border",
        "border-red-200",
        "text-red-700",
        "px-4",
        "py-3",
        "rounded-md"
      );
    });

    it("renders as a div element", () => {
      const { container } = render(<ErrorDisplay error="Test error message" />);

      expect(container.firstChild.tagName).toBe("DIV");
    });
  });

  describe("Content", () => {
    it("displays long error messages", () => {
      const longErrorMessage =
        "This is a very long error message that should be displayed properly even if it contains multiple sentences and goes on for quite a while to test how the component handles lengthy content.";
      render(<ErrorDisplay error={longErrorMessage} />);

      expect(screen.getByText(longErrorMessage)).toBeInTheDocument();
    });

    it("displays error messages with special characters", () => {
      const specialCharMessage =
        "Error with special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";
      render(<ErrorDisplay error={specialCharMessage} />);

      expect(screen.getByText(specialCharMessage)).toBeInTheDocument();
    });

    it("displays error messages with HTML-like content", () => {
      const htmlLikeMessage =
        "Error with <script>alert('test')</script> content";
      render(<ErrorDisplay error={htmlLikeMessage} />);

      expect(screen.getByText(htmlLikeMessage)).toBeInTheDocument();
    });

    it("displays error messages with numbers", () => {
      const numericMessage = "Error code: 404 - Page not found";
      render(<ErrorDisplay error={numericMessage} />);

      expect(screen.getByText(numericMessage)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      const { container } = render(<ErrorDisplay error="Test error message" />);

      const errorElement = container.firstChild;
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent("Test error message");
    });

    it("maintains proper contrast with error styling", () => {
      const { container } = render(<ErrorDisplay error="Test error message" />);

      const errorElement = container.firstChild;
      // Check that it has the red text color class
      expect(errorElement).toHaveClass("text-red-700");
    });
  });

  describe("Edge Cases", () => {
    it("handles error message with only whitespace", () => {
      const { container } = render(<ErrorDisplay error="   " />);

      // Should render the whitespace-only message
      expect(container.firstChild).toBeInTheDocument();
      // Check that the element contains whitespace
      expect(container.firstChild.textContent).toContain("   ");
    });

    it("handles error message with newlines", () => {
      const multilineError = "Line 1\nLine 2\nLine 3";
      render(<ErrorDisplay error={multilineError} />);

      // Use a more flexible approach to check for multiline content
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
      expect(screen.getByText(/Line 2/)).toBeInTheDocument();
      expect(screen.getByText(/Line 3/)).toBeInTheDocument();
    });

    it("handles error message with tabs", () => {
      const tabbedError = "Error\twith\ttabs";
      render(<ErrorDisplay error={tabbedError} />);

      // Use a more flexible approach to check for tabbed content
      expect(screen.getByText(/Error/)).toBeInTheDocument();
      expect(screen.getByText(/with/)).toBeInTheDocument();
      expect(screen.getByText(/tabs/)).toBeInTheDocument();
    });

    it("handles very short error messages", () => {
      render(<ErrorDisplay error="!" />);

      expect(screen.getByText("!")).toBeInTheDocument();
    });
  });

  describe("Component Behavior", () => {
    it("re-renders when error prop changes", () => {
      const { rerender } = render(<ErrorDisplay error="First error" />);

      expect(screen.getByText("First error")).toBeInTheDocument();

      rerender(<ErrorDisplay error="Second error" />);

      expect(screen.getByText("Second error")).toBeInTheDocument();
      expect(screen.queryByText("First error")).not.toBeInTheDocument();
    });

    it("disappears when error changes from truthy to falsy", () => {
      const { rerender, container } = render(
        <ErrorDisplay error="Test error" />
      );

      expect(screen.getByText("Test error")).toBeInTheDocument();

      rerender(<ErrorDisplay error={null} />);

      expect(container.firstChild).toBeNull();
    });

    it("appears when error changes from falsy to truthy", () => {
      const { rerender } = render(<ErrorDisplay error={null} />);

      expect(screen.queryByText("Test error")).not.toBeInTheDocument();

      rerender(<ErrorDisplay error="Test error" />);

      expect(screen.getByText("Test error")).toBeInTheDocument();
    });
  });
});
