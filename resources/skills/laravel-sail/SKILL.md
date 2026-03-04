---
name: laravel-sail
description: Guidelines for using Laravel Sail as the local development environment at Eolica-Web.
---

# Laravel Sail Development Environment

At Eolica-Web, we use **Laravel Sail** for a consistent, Docker-based local development environment. This ensures that all developers and CI/CD pipelines work with the same versions of PHP, MySQL, Redis, and other services.

## 1. Core Principles

- **Environment Isolation**: Always run project-related commands (Artisan, Composer, PHP, Node) inside the Sail containers to avoid version mismatches with the host machine.
- **Consistency**: If a project provides a `docker-compose.yml` file, Sail is the mandatory way to develop locally.

## 2. Basic Commands

Instead of running commands directly on your machine, prefix them with `sail` (usually `./vendor/bin/sail`):

| Task                         | Command                                              |
| :--------------------------- | :--------------------------------------------------- |
| **Start Environment**        | `./vendor/bin/sail up -d`                            |
| **Stop Environment**         | `./vendor/bin/sail stop`                             |
| **Down (Remove Containers)** | `./vendor/bin/sail down`                             |
| **Laravel Artisan**          | `./vendor/bin/sail artisan <command>`                |
| **Composer**                 | `./vendor/bin/sail composer <command>`               |
| **PHP Binary**               | `./vendor/bin/sail php <command>`                    |
| **Testing (Pest/PHPUnit)**   | `./vendor/bin/sail test` or `./vendor/bin/sail pest` |
| **Node / NPM**               | `./vendor/bin/sail npm <command>`                    |
| **Vite Dev Server**          | `./vendor/bin/sail npx vite`                         |

## 3. Configuration & Services

- **Services**: Common services included in `docker-compose.yml` are `mysql`, `redis`, `meilisearch`, `mailpit`, and `selenium`.
- **Environment Variables**: Sail uses the `.env` file for configuration. Key variables include:
  - `DB_HOST=mysql`
  - `REDIS_HOST=redis`
  - `MEMCACHED_HOST=memcached`
  - `MEILISEARCH_HOST=meilisearch`
- **Port Mapping**: If a port is already in use on the host, change it in `.env` (e.g., `APP_PORT=8080`, `FORWARD_DB_PORT=33060`).

## 4. Best Practices

- **Aliases**: It is highly recommended to alias `sail` in your shell: `alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'`.
- **Database Migrations**: Always run migrations via Sail: `sail artisan migrate`.
- **Logs**: View real-time logs with `sail logs -f`.
- **Shell Access**: To enter the container shell, use `sail shell` or `sail root-shell`.
