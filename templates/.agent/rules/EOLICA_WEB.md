---
description: Global development rules for Eolica-Web projects. These rules apply to all websites and interactions.
---

# Eolica-Web Global Rules

When working on any Eolica-Web website, the following global rules MUST be strictly followed:

## 1. PHP Strictness & Modernity
-   **Always** declare strict types at the very top of any new or modified PHP file: `declare(strict_types=1);`
-   Use PHP 8.x features (typed properties, match expressions, readonly classes) whenever possible.
-   Ensure code complies with our `eolica/coding-standard` (via Easy Coding Standard).

## 2. Frontend & Views (Livewire, Alpine.js & Tailwind)
-   All new interactive interfaces MUST use **Livewire**, specifically **anonymous classes** (Volt-style) directly within the `.blade.php` file (`new class extends Component`).
-   Use **Alpine.js** (`x-data`, `x-show`, etc.) for lightweight client-side reactivity (modals, dropdowns, toggles) that do not require server round-trips.
-   Route to Livewire components explicitly using `Route::livewire('/url', 'component-name');`.
-   Use **Tailwind CSS v4**. Configure tokens purely in CSS (`@theme`), use Vite (`@tailwindcss/vite`), and avoid dynamic class strings that obscure names from the compiler.
-   Do NOT use external UI component libraries. Extract complex, highly-reused generic UI elements into **independent reusable Blade Components** (e.g., `<x-button>`, typically found in `ev-mallorca`), avoiding CSS `@apply`.

## 3. Backend Architecture & Validation
-   Use **Form Requests** (`php artisan make:request`) or dedicated validation rules for validating data before it hits the database, even within Livewire components.
-   We typically use **Eloquent** directly for data access. For simple CRUD, this is fine. For complex business logic, prefer extracting it into dedicated **Action** or **Service** classes to keep controllers and Livewire components thin.
-   Avoid "God classes". Keep classes small and focused (SOLID principles).
-   Rely on **Interfaces (Contracts)** for services and bind them via the Service Container (`$app->bind()`) rather than using concrete implementations directly throughout the app.

## 4. External APIs
-   Never use the Laravel `Http` Facade directly in core integration logic.
-   Use PSR-18 clients, PSR-17 factories, and `php-http/discovery` to build agnostic integrations.

## 5. Testing
-   Use **Pest** (`pestphp/pest`) for modern projects.
-   For Livewire components, use Pest's Livewire plugin (`Livewire::test()`).
-   Use Mockery for test doubles and run PHPStan for static analysis.
