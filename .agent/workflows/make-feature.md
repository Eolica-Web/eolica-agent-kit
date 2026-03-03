---
description: Scaffolds a new Livewire feature, applying Eolica-Web architectural rules.
---

# /make-feature - Scaffold Livewire Feature

$ARGUMENTS

---

## Purpose

This command creates the necessary files for a new interactive UI feature using our Livewire (anonymous classes/Volt), Blade, and Tailwind v4 stack.

## Expected Steps

When a user runs `/make-feature [FeatureName]`, execute the following actions:

1.  **Analyze Request**: Understand what component the user wants (e.g., `user-profile`, `shopping-cart`). Extract the component name as completely lowercase with hyphens (kebab-case).
2.  **Generate Livewire Component**:
    - **Path**: Ensure the view is created in `resources/views/livewire/[feature-name].blade.php` (or use `artisan make:livewire` with the `--inline` or Volt equivalent configured in the project).
    - **Content**: Pre-populate the `.blade.php` file with the anonymous PHP class block at the top, and an empty `div` wrapping the HTML shell.
3.  **Generate Test File**:
    - **Path**: Create `tests/Feature/Livewire/[FeatureName]Test.php` mapping to the new component.
    - **Content**: Pre-populate a basic Pest test asserting the component renders successfully using `Livewire::test()`.
4.  **Prompt for Route**:
    - Ask the user: "Would you like me to register a `Route::livewire()` for this new feature in `routes/web.php`? If so, what should the URL be?"

## File Templates

### 1. Livewire Component (resources/views/livewire/{feature-name}.blade.php)
```php
<?php

use Livewire\Volt\Component;

new class extends Component {
    // public string $example = '';

    // public function save() { ... }
}
?>
<div>
    {{-- Component HTML --}}
    <h2 class="text-xl font-bold">New Feature</h2>
</div>
```

### 2. Pest Test (tests/Feature/Livewire/{FeatureName}Test.php)
```php
<?php

declare(strict_types=1);

use Livewire\Livewire;

it('renders the component successfully', function () {
    Livewire::test('{feature-name}')
        ->assertStatus(200);
});
```

## After Creation

Print the generated paths to the user and suggest adding `x-data` or independent `<x-button>` components if applicable.
