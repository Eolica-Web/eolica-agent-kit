---
name: Eolica-Web Laravel Architecture
description: Architectural guidelines and design patterns for Laravel applications and packages at Eolica-Web.
---
# Eolica-Web Laravel Architecture

When working on Laravel applications or packages for Eolica-Web, follow these architectural principles:

1. **Development Environment**:
   - At Eolica-Web, we use **Laravel Sail** for local development to ensure environment consistency across all teammates. Refer to the [Laravel Sail Development Environment](file:///home/mramonell/Code/eolica-agent-kit/templates/.agent/skills/laravel-sail/SKILL.md) skill for detailed usage.

2. **Dependency Injection & Interfaces**:
   - Rely heavily on Interfaces (Contracts) rather than concrete implementations (e.g., `PermissionHandler`, `TranslationRepository`).
   - Use Laravel's Service Container to bind interfaces to their concrete implementations within Service Providers (e.g., `$this->app->bind()`, `$this->app->bindIf()`).

3. **SOLID Principles & Small Classes**:
   - Avoid "God classes". Break down complex logic into small, focused, and reusable classes.
   - Use design patterns where appropriate. For example, the **Composite Pattern** (`CompositePermissionHandler`) is used to combine multiple small handler classes instead of writing a single large one.

4. **Blade Components**:
   - Encapsulate reusable UI elements into Blade Components (e.g., `<x-content-tools-translation>`).
   - Use component attributes to pass required data and allow forwarding of extra HTML attributes (like `class`) when rendering components.

5. **Livewire & Views (e.g., in restaurant-management-system)**:
   - For interactive frontend views, use **Livewire** (specifically Volt-style or anonymous classes).
   - Views should be anonymous classes defined directly within a `.blade.php` file (`new class extends Component`).
   - For routing to these components, use the explicit generic route method: `Route::livewire('/uri', 'component-name');`.

6. **Security & Extensibility**:
   - Provide secure default implementations (e.g., `AuthGuardCheckPermissionHandler`) but allow developers to override them using `$app->bindIf()`.
   - Ensure features intended ONLY for local development are isolated from production using environment checks (`$app->isLocal()`).
