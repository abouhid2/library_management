import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorDisplay from "../form/ErrorDisplay";

describe("ErrorDisplay", () => {
  describe("Rendering", () => {
    it("renders error message when errors is provided", () => {
      const errorMessage = "This is an error message";
      render(<ErrorDisplay errors={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("renders array of error messages", () => {
      const errorMessages = ["Error 1", "Error 2", "Error 3"];
      render(<ErrorDisplay errors={errorMessages} />);

      expect(screen.getByText("Error 1")).toBeInTheDocument();
      expect(screen.getByText("Error 2")).toBeInTheDocument();
      expect(screen.getByText("Error 3")).toBeInTheDocument();
    });

    it("does not render when errors is null", () => {
      const { container } = render(<ErrorDisplay errors={null} />);

      expect(container.firstChild).toBeNull();
    });

    it("does not render when errors is undefined", () => {
      const { container } = render(<ErrorDisplay errors={undefined} />);

      expect(container.firstChild).toBeNull();
    });

    it("does not render when errors is empty string", () => {
      const { container } = render(<ErrorDisplay errors="" />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Styling", () => {
    it("applies error styling classes", () => {
      const errorMessage = "Test error";
      const { container } = render(<ErrorDisplay errors={errorMessage} />);

      const errorElement = container.firstChild;
      expect(errorElement).toHaveClass("bg-red-50", "border", "border-red-200", "rounded-md", "p-4");
    });
  });

  describe("Title", () => {
    it("renders default title", () => {
      const errorMessage = "Test error";
      render(<ErrorDisplay errors={errorMessage} />);

      expect(screen.getByText("There were errors with your submission")).toBeInTheDocument();
    });

    it("renders custom title", () => {
      const errorMessage = "Test error";
      const customTitle = "Custom Error Title";
      render(<ErrorDisplay errors={errorMessage} title={customTitle} />);

      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      const errorMessage = "Accessibility test error";
      render(<ErrorDisplay errors={errorMessage} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("There were errors with your submission");
    });
  });

  describe("Edge Cases", () => {
    it("handles very long error messages", () => {
      const longError = "A".repeat(1000);
      render(<ErrorDisplay errors={longError} />);

      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it("handles error messages with special characters", () => {
      const specialError = "Error with special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";
      render(<ErrorDisplay errors={specialError} />);

      expect(screen.getByText(specialError)).toBeInTheDocument();
    });

    it("handles error messages with HTML-like content", () => {
      const htmlError = "Error with <script>alert('xss')</script> content";
      render(<ErrorDisplay errors={htmlError} />);

      expect(screen.getByText(htmlError)).toBeInTheDocument();
    });
  });
});
