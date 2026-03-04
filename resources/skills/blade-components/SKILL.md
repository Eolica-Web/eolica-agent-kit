---
name: blade-components
description: Guidelines on how Eolica-Web builds frontend UIs purely through anonymous Blade components, Tailwind v4, and Alpine.js, avoiding third-party UI libraries.
---

# Eolica-Web Blade Components UX Strategy

At Eolica-Web, we rely on a custom, highly scalable UI element library built directly into our projects using **Anonymous Blade Components**. We strictly avoid installing generic UI libraries (like Flowbite, Bootstrap, or Tailwind UI) to maintain total control over our design tokens.

When an AI agent (such as `ux-engineer` or `livewire-expert`) builds a frontend interface for Eolica-Web, they must follow this internal architecture.

## 1. Defining Component Variants (The "Eolica Pattern")

Instead of concatenating scattered Tailwind classes or using generic utility functions, our components use structured PHP arrays to handle variants (colors, sizes, styles), combining them cleanly using Blade's `@class()` directive.

### Example: A Standard Button (`resources/views/components/button.blade.php`)

```blade
@props(['color' => 'red', 'size' => 'base'])

<?php
// 1. Define Visual Variants
$colorClasses = [
    'red' => 'bg-red-3 text-white border border-red-1 hover:bg-red-2 hover:border-red-2',
    'transparent' => 'bg-transparent text-black-1 border border-black-1 hover:bg-black-2 hover:text-white',
    'gray' => 'bg-gray-1 text-white border border-gray-1 hover:bg-gray-2',
];

// 2. Define Size Variants
$sizeClasses = [
    'xs' => 'px-2 py-1 text-xs',
    'sm' => 'px-3 py-2 text-sm leading-4',
    'base' => 'px-4 py-2 text-sm',
    'lg' => 'px-4 py-2 text-base',
    'full' => 'px-6 py-3 text-base w-full',
];

// 3. Dynamic Tag Handling (Optional but common)
$tag = $attributes->has('href') ? 'a' : 'button';
?>

<!-- 4. The Rendered Component -->
<{{ $tag }}
    @class([
        'group text-nowrap rounded-sm shadow-md hover:shadow-xl inline-flex justify-center items-center transition-all duration-150 ease-linear disabled:opacity-25 focus-visible:outline-red-1 focus-visible:outline-offset-4', // Base classes
        $colorClasses[$color] ?? $colorClasses['red'], // Applied Variant
        $sizeClasses[$size] ?? $sizeClasses['base'],   // Applied Variant
    ])
    {{ $attributes }}
>
    {{ $slot }}
</{{ $tag }}>
```

## 2. Using `$attributes` System

Always append `{{ $attributes }}` in the primary HTML element of a component. This allows the developer using your component to append additional `data-` attributes, `wire:click`, `href`, or extra formatting (`class="mt-4"`) seamlessly. Note that Laravel's `@class` blends beautifully with `$attributes` class merging.

## 3. The Role of Livewire vs. Static Layouts

- **Layouts remain static:** Wrapper files (like `layouts.app`, sidebars, topbars, or generic SEO containers) should be pure Blade. Do NOT inject Livewire logic into layouts unless absolutely strictly necessary. This saves performance overhead.
- **Component-Scoped interactivity:** Use `<livewire:component-name />` deeper in the view tree, specifically on elements that require heavy backend state (e.g., `<livewire:app.components.create-reservation />`).
- **Alpine.js for visual state:** Use Alpine (`x-data`, `@click`) to handle dropdowns, modals, and tabs instead of relying on a server roundtrip via Livewire.
