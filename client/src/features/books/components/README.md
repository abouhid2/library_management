# Book Form Components

This directory contains the refactored book form components, broken down into smaller, reusable pieces for better maintainability and separation of concerns.

## Component Structure

### Core Components

- **`BookForm.js`** - Main form component that orchestrates all other components

### Form Components (`/form` folder)

- **`BookFormFields.js`** - Contains all the book-specific form fields
- **`FormField.js`** - Reusable form field component with consistent styling
- **`FormActions.js`** - Reusable form action buttons (Cancel/Submit)
- **`ImageUpload.js`** - Dedicated image upload component with drag & drop
- **`ErrorDisplay.js`** - Reusable error display component

### Custom Hooks

- **`useBookForm.js`** - Custom hook that manages form state and logic

## Usage

### Basic Usage

```jsx
import { BookForm } from "./components";
// Or import specific form components:
import { FormField, FormActions, ErrorDisplay } from "./components/form";

const MyComponent = () => {
  const handleSubmit = async (bookData) => {
    // Handle form submission
  };

  return (
    <BookForm
      onSubmit={handleSubmit}
      onCancel={() => {
        /* handle cancel */
      }}
      isSubmitting={false}
    />
  );
};
```

### Inline Form (for editing)

```jsx
<BookForm
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  editingBook={bookToEdit}
  isSubmitting={isSubmitting}
  isInline={true}
/>
```

## Component Benefits

### 1. **Separation of Concerns**

- Each component has a single responsibility
- Form logic is separated from UI components
- State management is handled by custom hooks

### 2. **Reusability**

- `FormField` can be used for any input field
- `FormActions` can be used for any form
- `ErrorDisplay` can be used throughout the app
- `ImageUpload` can be reused for other image upload needs

### 3. **Maintainability**

- Smaller components are easier to test and debug
- Changes to one component don't affect others
- Clear component boundaries

### 4. **Consistency**

- Consistent styling across all form fields
- Standardized error handling
- Uniform button styling and behavior

## Customization

### FormField Props

```jsx
<FormField
  label="Field Label"
  name="fieldName"
  type="text|number|email|password"
  value={value}
  onChange={handleChange}
  required={true}
  error={errorMessage}
  placeholder="Placeholder text"
  min={0} // for number inputs
  accept="image/*" // for file inputs
/>
```

### ImageUpload Props

```jsx
<ImageUpload
  onImageChange={(file, error) => {
    /* handle image change */
  }}
  onImageRemove={() => {
    /* handle image removal */
  }}
  imagePreview={previewUrl}
  error={imageError}
  accept="image/jpeg,image/png"
  maxSize={5 * 1024 * 1024} // 5MB
  id="custom-upload-id"
/>
```

### FormActions Props

```jsx
<FormActions
  onCancel={handleCancel}
  isSubmitting={false}
  submitText="Save"
  cancelText="Cancel"
  isInline={false}
/>
```

## File Structure

```
components/
├── BookForm.js          # Main form component
├── index.js            # Component exports
├── README.md           # This documentation
└── form/               # Form-specific components
    ├── BookFormFields.js    # Book-specific fields
    ├── FormField.js         # Reusable form field
    ├── FormActions.js       # Form action buttons
    ├── ImageUpload.js       # Image upload component
    ├── ErrorDisplay.js      # Error display component
    └── index.js            # Form component exports
```

## Best Practices

1. **Always use the custom hook** (`useBookForm`) for form state management
2. **Use FormField component** for all input fields to maintain consistency
3. **Handle errors properly** using the ErrorDisplay component
4. **Test individual components** rather than the entire form
5. **Keep components focused** on a single responsibility
