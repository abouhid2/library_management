import React from "react";

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  min,
  accept,
  error,
  className = "",
  placeholder,
  id,
}) => {
  const getFieldClassName = () => {
    return `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
      error
        ? "border-red-300 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    } ${className}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        accept={accept}
        placeholder={placeholder}
        className={getFieldClassName()}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
