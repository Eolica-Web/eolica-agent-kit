---
description: Scans code for hardcoded strings and extracts them into Laravel language files for laravel-content-tools.
---

# /extract-translations - Extract Hardcoded Strings

$ARGUMENTS

---

## Purpose

This workflow scans Blade views, Livewire components, and PHP classes to find hardcoded user-facing text, replacing them with Laravel's `__('group.key')` or `@lang('group.key')` helper functions. This ensures compatibility with Eolica-Web's `laravel-content-tools` package.

## Process

When triggered (e.g., `/extract-translations resources/views/livewire/user-profile.blade.php`), perform the following:

1.  **Scan Targets**: Identify the files requested by the user.
2.  **Identify Strings**: Look for text outside of HTML tags or inside text-heavy attributes (like `placeholder`, `title`, or `alt`).
3.  **Generate Keys**: Create short, descriptive keys following the format `[domain].[page/component].[element]` (e.g., `auth.login.submit_button`).
4.  **Replace in Code**:
    - In Blade: `<p>Welcome, User!</p>` becomes `<p>{{ __('auth.dashboard.welcome') }}</p>`
    - In PHP: `return 'Invalid email';` becomes `return __('validation.custom.invalid_email');`
5.  **Update Language Files**:
    - Open `lang/es/[domain].php` (or `resources/lang/es/[domain].php` depending on the Laravel version setup).
    - Append the new keys and their original hardcoded values to the returning array.