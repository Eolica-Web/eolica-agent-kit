---
name: Eolica-Web PHP Coding Standard
description: Guidelines for PHP coding standards and code styling at Eolica-Web.
---
# Eolica-Web PHP Coding Standard

When writing or modifying PHP code for Eolica-Web repositories, you MUST adhere to the following coding standards:

1. **Easy Coding Standard (ECS)**:
   - We use `easy-coding-standard` for linting and formatting PHP code.
   - The configuration is typically found in `ecs.php` and uses our custom package `eolica/coding-standard`.
   - Command to check code style: `./vendor/bin/ecs check`
   - Command to fix code style: `./vendor/bin/ecs check --fix`

2. **Strict Types**:
   - Always declare strict types at the top of every PHP file: `declare(strict_types=1);`

3. **Modern PHP Features**:
   - Use PHP 8.x features (typed properties, named arguments, match expressions, readonly classes/properties, etc.) where applicable. Our modern repositories (like `php-hubspot-api-client`) require PHP `^8.4`.

4. **Refactoring**:
   - We use `rector/rector` for automated refactoring and upgrades.

5. **Clean Code (No Comments, No Emojis)**:
   - **Self-Explanatory**: Do not use inline comments. Write code that explains itself using highly descriptive variable, method, and event names.
   - **No Emojis**: Emojis are strictly forbidden in the codebase, preventing unprofessional and inconsistent formatting.
