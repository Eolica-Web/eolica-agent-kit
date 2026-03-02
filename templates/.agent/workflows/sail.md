---
description: Manage the Laravel Sail development environment and run commands inside containers.
---

# /sail - Manage Development Environment

$ARGUMENTS

---

## Purpose

This command provides a quick way to manage the **Laravel Sail** environment and execute common tasks without needing to remember the full `./vendor/bin/sail` paths.

## Available Actions

When a user runs `/sail [action]`, execute the following:

### 1. `up`
Starts the Docker containers in the background.
```bash
./vendor/bin/sail up -d
```
*Wait for containers to be healthy before proceeding.*

### 2. `stop` / `down`
Stops the containers.
- Use `stop` to keep containers (faster restart).
- Use `down` to remove containers and networks (cleaner).
```bash
./vendor/bin/sail stop
# OR
./vendor/bin/sail down
```

### 3. `artisan [command]`
Runs a Laravel Artisan command inside the Sail container.
```bash
./vendor/bin/sail artisan [command]
```

### 4. `test` / `pest`
Runs the test suite using the internal PHP environment.
```bash
./vendor/bin/sail test
# OR
./vendor/bin/sail pest
```

### 5. `npm [command]`
Runs NPM commands (e.g., `install`, `run dev`).
```bash
./vendor/bin/sail npm [command]
```

### 6. `shell`
Opens an interactive shell session inside the `laravel.test` container.
```bash
./vendor/bin/sail shell
```

## Environment Check

Before running any Sail command, check if the `docker-compose.yml` file exists in the root directory. If it doesn't, inform the user:
> "It looks like Laravel Sail is not configured in this project. Would you like me to run `composer require laravel/sail --dev` and `php artisan sail:install` for you?"

## Best Practices
- Always check if Docker is running before attempting to start Sail.
- If a command fails due to port conflicts, suggest the user to update the `FORWARD_DB_PORT` or `APP_PORT` in their `.env` file.
