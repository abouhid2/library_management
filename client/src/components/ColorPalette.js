import React from "react";

const ColorPalette = () => {
  const colors = [
    { name: "Primary", class: "bg-primary", text: "text-secondary" },
    { name: "Secondary", class: "bg-secondary", text: "text-primary" },
    { name: "Accent", class: "bg-accent", text: "text-secondary" },
    { name: "Neutral", class: "bg-neutral", text: "text-primary" },
    { name: "Highlight", class: "bg-highlight", text: "text-secondary" },
    { name: "Success", class: "bg-success", text: "text-white" },
    { name: "Warning", class: "bg-warning", text: "text-white" },
    { name: "Error", class: "bg-error", text: "text-white" },
    { name: "Info", class: "bg-info", text: "text-white" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-brand">
      <h2 className="text-2xl font-semibold text-secondary mb-4">
        Books 2 Go Color Palette
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {colors.map((color) => (
          <div key={color.name} className="text-center">
            <div
              className={`w-full h-20 rounded-lg ${color.class} flex items-center justify-center ${color.text} font-medium mb-2`}
            >
              {color.name}
            </div>
            <p className="text-sm text-neutral">{color.name}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-primary rounded-lg">
        <h3 className="text-lg font-medium text-secondary mb-2">
          Usage Guidelines
        </h3>
        <ul className="text-sm text-neutral space-y-1">
          <li>• Primary: Main background and surfaces</li>
          <li>• Secondary: Text, buttons, and primary actions</li>
          <li>• Accent: Secondary elements and hover states</li>
          <li>• Neutral: Borders and subtle text</li>
          <li>• Highlight: Call-to-action buttons and important elements</li>
        </ul>
      </div>
    </div>
  );
};

export default ColorPalette;
