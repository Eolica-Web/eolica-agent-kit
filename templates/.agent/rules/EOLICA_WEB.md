---
description: Global development rules for Eolica-Web projects. These rules apply to all websites and interactions.
---

# Eolica-Web Global Rules

When working on any Eolica-Web website, the following global rules MUST be strictly followed:

## 1. PHP Strictness & Modernity
-   **Always** declare strict types at the very top of any new or modified PHP file: `declare(strict_types=1);`
-   Use PHP 8.4+ features (typed properties, match expressions, readonly classes) whenever possible.
-   **Data Structures**: Use native PHP **Enums** over magic numbers or constant strings. Use strictly typed **Data Transfer Objects (DTOs)** for passing complex data between layers.
-   Assume the project is running **Laravel 12+**.
-   Ensure code complies with our `eolica/coding-standard` (via Easy Coding Standard).

## 2. Frontend & Views (Livewire 4, Alpine.js & Tailwind 4)
- **Public Web Frontends**: All new interactive interfaces MUST use **Livewire 4**, specifically **anonymous classes** (Volt-style) directly within the `.blade.php` file (`new class extends Component`).
- **The "Eolica Pattern" for UI**: Build generic UI elements (Buttons, Badges, etc.) as **Anonymous Blade Components**. Use structured PHP Arrays for styling variants merged via Blade's `@class()` directive. **Never use third-party UI libraries** (Flowbite, Tailwind UI, etc.) or CSS `@apply`.
- **Backoffices & Dashboards**: Use **Filament PHP v5** for all internal administrative panels. Do not build custom admin panels from scratch.
- **Interactivity Separation**: Use **Alpine.js** (`x-data`, `@click`) for visual state (modals, dropdowns) to prevent server roundtrips. Keep core layouts (like `app.blade.php`) as static Blade, injecting `<livewire:component />` only where backend state is strictly needed.
- Use **Tailwind CSS v4**. Configure tokens purely in CSS (`@theme`), use Vite (`@tailwindcss/vite`), and avoid dynamic class strings that obscure names from the compiler. Always prefer **logical properties** (`ms-`, `pe-`, `ps-`, `me-`) over physical/directional ones (`ml-`, `pr-`, `pl-`, `mr-`) for effortless RTL support.

## 3. Backend Architecture & Validation
- **Strict Data Validation**: Use **Form Requests** (`php artisan make:request`) or dedicated validation rules before data hits the database, even within Livewire components.
- **Thin Controllers & Livewire**: For complex business logic, extract code into dedicated **Action** or **Service** classes. Keep controllers and Livewire components extremely thin.
- **Database Safety**: Always wrap multi-model inserts, updates, or deletes within database transactions (`DB::transaction()`) to guarantee data integrity. Avoid N+1 query problems by eagerly loading relationships (`with()`).
- **Service Container & Interfaces**: Rely heavily on **Interfaces (Contracts)** and bind them via Laravel's Service Container (`$app->bind()`) rather than injecting concrete implementations directly.
- **Asynchronous Processing**: Offload heavy tasks (emails, integrations, complex calculations) to **Queues and Jobs**. Use Laravel Events/Listeners for pub/sub decouple logic.
- **SOLID Design**: Avoid "God classes". Use design patterns (like the Composite pattern for handlers) to break down complex logic into small, focused, and reusable classes.

## 4. External APIs
- Never use the Laravel `Http` Facade directly in core API integration logic.
- Build framework-agnostic clients relying on PSR standards (`psr/http-client`, `psr/http-factory`) and use `php-http/discovery` to instantiate them.
- Abstract raw API responses behind strictly typed Data Transfer Objects (DTOs).

## 5. Testing & QA
- Use **Pest** (`pestphp/pest`) as the primary testing framework.
- For Livewire components, strictly test using Pest's Livewire plugin (`Livewire::test()`).
- Never hit external API endpoints in tests; use `php-http/mock-client` or fake HTTP responses to ensure isolated tests.
- Use **Mockery** for test doubles and run **PHPStan** for static analysis checks.

## 6. Clean Code & Readability
- **Self-Documenting Code**: Do **not** use comments to explain what the code does. Code must be self-explanatory. Variables, functions, events, and class names must be highly descriptive and convey their exact purpose.
- **No Emojis**: Do **not** use emojis anywhere in the codebase (including commit messages, comments, or output strings) unless strictly required by a specific business feature. Keep the environment professional and clean.
