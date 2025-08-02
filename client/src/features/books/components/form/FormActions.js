import React from "react";

const FormActions = ({
  onCancel,
  isSubmitting,
  submitText = "Save",
  cancelText = "Cancel",
  isInline = false,
}) => {
  const buttonSize = isInline ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm";
  const containerSpacing = isInline ? "space-x-2" : "space-x-3";

  return (
    <div className={`flex justify-end ${containerSpacing}`}>
      <button
        type="button"
        onClick={onCancel}
        className={`${buttonSize} text-neutral bg-primary hover:bg-primary-hover rounded-md font-medium transition-colors duration-200`}
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${buttonSize} bg-highlight hover:bg-accent disabled:bg-neutral text-secondary rounded-md font-medium transition-colors duration-200`}
      >
        {isSubmitting ? "Saving..." : submitText}
      </button>
    </div>
  );
};

export default FormActions;
