# Books 2 Go Design System

## Color Palette

The color palette is extracted from the Books 2 Go logo and provides a warm, professional aesthetic perfect for a library management system.

### Primary Colors

- **Primary**: `#f0ebdb` - Warm cream background
- **Secondary**: `#301d0c` - Deep brown for text and primary actions
- **Accent**: `#a99b84` - Warm taupe for secondary elements
- **Neutral**: `#786650` - Muted brown for borders and subtle elements
- **Highlight**: `#87775f` - Golden brown for call-to-action buttons

### Usage Guidelines

#### CSS Variables

Use CSS custom properties for consistent theming:

```css
background-color: var(--color-primary);
color: var(--color-text-primary);
```

#### Tailwind Classes

Use Tailwind utility classes for quick styling:

```jsx
<div className="bg-primary text-secondary">
<button className="bg-highlight hover:bg-accent text-secondary">
```

#### Semantic Colors

- **Success**: `#10b981` - Green for positive actions
- **Warning**: `#f59e0b` - Orange for warnings
- **Error**: `#ef4444` - Red for errors
- **Info**: `#3b82f6` - Blue for informational content

### Typography

- **Primary Font**: Inter (sans-serif)
- **Serif Font**: Georgia (for headings)
- **Monospace**: JetBrains Mono (for code)

### Spacing

Consistent spacing scale using CSS custom properties:

- `--spacing-xs`: 0.25rem
- `--spacing-sm`: 0.5rem
- `--spacing-md`: 1rem
- `--spacing-lg`: 1.5rem
- `--spacing-xl`: 2rem
- `--spacing-2xl`: 3rem

### Shadows

Custom shadow with brand colors:

- `--shadow-sm`: Subtle shadows
- `--shadow-md`: Medium shadows
- `--shadow-lg`: Large shadows
- `--shadow-xl`: Extra large shadows
- `shadow-brand`: Brand-specific shadow

### Border Radius

- `--radius-sm`: 0.25rem
- `--radius-md`: 0.375rem
- `--radius-lg`: 0.5rem
- `--radius-xl`: 0.75rem

## Implementation

1. Import the color system in your CSS:

```css
@import "./assets/colors.css";
```

2. Use Tailwind classes with custom colors:

```jsx
<div className="bg-primary text-secondary p-4 rounded-lg shadow-brand">
```

3. Use CSS variables for custom styling:

```css
.my-component {
  background-color: var(--color-primary);
  border: 1px solid var(--color-neutral);
}
```

## Dark Mode Support

The color system includes dark mode support that automatically switches colors based on user preference. Dark mode colors are defined in the CSS variables and will be applied when `prefers-color-scheme: dark` is detected.
