import { useState, useCallback } from "react";

/**
 * Custom hook for handling form validation errors
 * @param {Object} fieldMapping - Maps backend field names to frontend field names
 * @returns {Object} - Error state and handlers
 */
export const useFormErrors = (fieldMapping = {}) => {
  const [fieldErrors, setFieldErrors] = useState({});

  const clearErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const setFieldError = useCallback((field, error) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Parse backend validation errors and map them to form fields
   * @param {Array|string|Object} backendErrors - Error messages from backend
   * @param {Object} customMapping - Additional field mappings
   */
  const parseBackendErrors = useCallback(
    (backendErrors, customMapping = {}) => {
      const newFieldErrors = {};
      const allMappings = { ...fieldMapping, ...customMapping };

      // Common field name variations
      const variations = {
        "total copies": "total_copies",
        "available copies": "available_copies",
        "book title": "title",
        "book author": "author",
        "book genre": "genre",
        title: "title",
        author: "author",
        genre: "genre",
        isbn: "isbn",
        email: "email",
        password: "password",
        "password confirmation": "password_confirmation",
      };

      // Handle different input types
      let errorsArray = [];

      if (Array.isArray(backendErrors)) {
        errorsArray = backendErrors;
      } else if (typeof backendErrors === "string") {
        errorsArray = [backendErrors];
      } else if (backendErrors && typeof backendErrors === "object") {
        // If it's an object, try to extract error messages
        if (backendErrors.errors && Array.isArray(backendErrors.errors)) {
          errorsArray = backendErrors.errors;
        } else if (backendErrors.error) {
          errorsArray = [backendErrors.error];
        } else {
          // If we can't extract errors, treat the whole object as a general error
          errorsArray = [JSON.stringify(backendErrors)];
        }
      } else if (backendErrors === null || backendErrors === undefined) {
        errorsArray = [];
      } else {
        // Fallback for any other type
        errorsArray = [String(backendErrors)];
      }

      errorsArray.forEach((errorMessage) => {
        if (!errorMessage || typeof errorMessage !== "string") {
          return; // Skip invalid error messages
        }

        let matchedField = null;

        // First, try exact field name matching (case insensitive)
        for (const [backendField, frontendField] of Object.entries(
          allMappings
        )) {
          if (errorMessage.toLowerCase().includes(backendField.toLowerCase())) {
            matchedField = frontendField;
            break;
          }
        }

        // If no direct match, try variations
        if (!matchedField) {
          for (const [variation, field] of Object.entries(variations)) {
            if (errorMessage.toLowerCase().includes(variation.toLowerCase())) {
              matchedField = field;
              break;
            }
          }
        }

        // Assign error to matched field or to general errors
        if (matchedField) {
          newFieldErrors[matchedField] = errorMessage;
        } else {
          // Handle unmatched errors as general form errors
          if (!newFieldErrors.general) {
            newFieldErrors.general = [];
          }
          newFieldErrors.general.push(errorMessage);
        }
      });

      setFieldErrors(newFieldErrors);
    },
    [fieldMapping]
  );

  /**
   * Handle API errors and parse validation errors
   * @param {Error} error - The caught error
   * @param {Object} customMapping - Additional field mappings
   */
  const handleApiError = useCallback(
    (error, customMapping = {}) => {
      if (error.response?.data?.errors) {
        // Backend validation errors
        parseBackendErrors(error.response.data.errors, customMapping);
      } else if (error.response?.data?.error) {
        // Single error message
        setFieldErrors({ general: [error.response.data.error] });
      } else {
        // Network or unexpected errors
        setFieldErrors({
          general: [error.message || "An unexpected error occurred"],
        });
      }
    },
    [parseBackendErrors]
  );

  return {
    fieldErrors,
    clearErrors,
    setFieldError,
    clearFieldError,
    parseBackendErrors,
    handleApiError,
  };
};
