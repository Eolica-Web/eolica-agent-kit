---
description: Advanced guidelines for enforcing Eolica-Web's architectural boundaries using Pest PHP Architecture Testing.
---

# Pest Architecture Testing (Eolica-Web)

Eolica-Web relies heavily on strictly enforced architectural patterns. Rather than relying solely on documentation or manual code reviews, we use **Pest PHP's Architecture Testing (`arch()`)** to automatically verify these boundaries during CI/CD.

This skill instructs agents (`qa-engineer`, `code-reviewer`) on how to implement and evaluate these automated rules for a Laravel 12 application.

## 1. The Power of `arch()`

Pest `arch()` tests must be placed in `tests/Architecture/` or as separate files like `tests/Feature/ArchitectureTest.php`. They ensure the codebase does not succumb to "architectural drift" over time.

## 2. Core Eolica-Web Architectural Checks

When setting up or expanding the test suite for an Eolica-Web project, ensure the following core rules are implemented:

### ✅ Strict Typing Enforcement
All PHP files in the application **must** declare strict types.

```php
test('strict types are used everywhere')
    ->preset()->php()
    ->expect('App')
    ->toUseStrictTypes();
```

### ✅ Security Presets
Automatically prevent the usage of insecure or legacy PHP functions.

```php
test('no insecure php functions are used')
    ->preset()->security();
```

### ✅ Clean Debugging
Ensure no debugging code accidentally reaches production.

```php
test('no debugging statements are left in code')
    ->expect(['dd', 'dump', 'var_dump', 'ray'])
    ->not->toBeUsed();
```

## 3. Layered Architecture Enforcement

Eolica-Web strictly separates MVC concerns. Enforce these barriers programmatically:

### 🛑 Controllers Must Not Touch The Database Directly
Controllers should rely on Actions, Services, or the Eloquent Models for complex logic, but they should never write raw SQL or complex business queries themselves.

```php
test('controllers do not interact with raw database facade')
    ->expect('App\Http\Controllers')
    ->not->toUse('Illuminate\Support\Facades\DB');
```

### 🛑 Models Are Isolated
Eloquent Models should not know about the HTTP layer (Requests, Controllers) or routing.

```php
test('models do not depend on http layer')
    ->expect('App\Models')
    ->not->toUse('App\Http')
    ->not->toUse('Illuminate\Http\Request');
```

## 4. Banning Anti-Patterns

If Eolica-Web rules strictly forbid certain Laravel features (like using the `Http` facade loosely instead of PSR-18 clients in core layers), you can ban them programmatically:

```php
test('core services use psr-18 and not the laravel http facade directly')
    ->expect('App\Services\Core')
    ->not->toUse('Illuminate\Support\Facades\Http');
```

## 5. General Best Practices for Agents

1.  **Iterative Rollout**: If applying this to a legacy Eolica project, start small. Use the `ignoring()` method to bypass existing technical debt while preventing *new* violations:
    ```php
    ->expect('App\Models')->not->toUse('App\Http')->ignoring('App\Models\LegacyUser');
    ```
2.  **Continuous Enforcement**: Remind the user that these tests act as executable, self-enforcing documentation for new developers joining the core team.
