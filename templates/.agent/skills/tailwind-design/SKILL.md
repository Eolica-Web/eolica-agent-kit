---
name: Eolica-Web Tailwind 4 Design
description: Guidelines for frontend design and using Tailwind CSS v4 at Eolica-Web.
---
# Eolica-Web Tailwind 4 Design

When working on frontend design for Eolica-Web applications, follow these guidelines for using Tailwind CSS v4:

1. **CSS First Configuration**:
   - Tailwind v4 uses a CSS-only configuration model. Configuration (like colors, fonts, spacing) is defined directly in your main CSS file (usually `resources/css/app.css` or similar) using the `@theme` directive, replacing the old `tailwind.config.js`.
   ```css
   @import "tailwindcss";

   @theme {
     --color-primary-500: #0ea5e9;
     --font-display: "Inter", sans-serif;
   }
   ```

2. **Vite Integration**:
   - We bundle assets via Vite (`vite.config.js`). Ensure Vite is configured to process the `@tailwindcss/vite` plugin instead of the older PostCSS setup.

3. **Component Extraction & Reusability**:
   - Avoid long, repetitive class lists in your HTML/Blade templates.
   - For highly reused, complex generic components (e.g., buttons, inputs), abstract the logic into Blade components (`<x-button>`) instead of using CSS `@apply`, keeping the utility classes visible inside the component files where possible.

4. **Dynamic Classes**:
   - Be careful with string interpolation when building class names dynamically in PHP or JS, as the Tailwind scanner won't pick them up. Always use the full class name (e.g., `bg-blue-500` instead of `bg-{$color}-500`).
   - Use Laravel's `@class([])` Blade directive to cleanly conditionally apply Tailwind classes based on logic.

5. **Design Aesthetics**:
   - Emphasize modern web design, using consistent palettes (defined in `@theme`), proper spacing hierarchies, and subtle hover/focus effects (`hover:`, `focus:` classes).
