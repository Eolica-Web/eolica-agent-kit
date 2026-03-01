---
name: Eolica-Web PHP Testing Stack
description: Tools and patterns for testing PHP and Laravel code at Eolica-Web.
---
# Eolica-Web PHP Testing Stack

When writing tests or doing static analysis for Eolica-Web repositories, use the following tools and guidelines:

1. **Testing Framework**:
   - For modern repositories, we use **Pest** (`pestphp/pest`). Ensure tests are written using Pest's expressive API (`test()`, `it()`).
   - For older packages or legacy codebases, we use **PHPUnit** (`phpunit/phpunit`). Always check the `composer.json` to determine which to use.

2. **Mocking**:
   - We use **Mockery** (`mockery/mockery`) for creating mock objects in tests.

3. **Livewire Testing**:
   - For interactive Livewire components (like those in `restaurant-management-system`), use Pest's Livewire plugin (`pestphp/pest-plugin-livewire`) or Livewire's built-in testing helpers `Livewire::test()`.

4. **Static Analysis**:
   - We use **PHPStan** (`phpstan/phpstan`) for static code analysis.
   - We also use the Mockery plugin for PHPStan (`phpstan/phpstan-mockery`) to ensure mocks are analyzed correctly.

5. **Laravel Package Testing**:
   - We use **Orchestra Testbench** (`orchestra/testbench`) for testing Laravel packages in isolation.
