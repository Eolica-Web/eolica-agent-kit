---
name: Eolica-Web API Integration
description: Guidelines for building HTTP API clients and integrations at Eolica-Web.
---
# Eolica-Web API Integration

When building integrations with external HTTP APIs (like HubSpot, Stripe, etc.) for Eolica-Web, follow these architectural guidelines to ensure reusability and testability:

1. **Framework Agnostic (PSR Standards)**:
   - Build API clients as standalone PHP packages, independent of Laravel.
   - Do NOT use Guzzle directly or Laravel's `Http` Facade inside the core client logic.
   - Depend on PSR standards:
     - `psr/http-client` (PSR-18) for sending requests.
     - `psr/http-factory` (PSR-17) for creating requests and streams.
     - `psr/http-message` (PSR-7) for request/response interfaces.

2. **HTTP Discovery**:
   - Use `php-http/discovery` to automatically find and instantiate an available HTTP Client and HTTP Factory in the host project. This allows the consumer application (which might be Laravel, Symfony, or vanilla PHP) to provide its preferred HTTP implementation (like Guzzle or Symfony HTTP Client).

3. **Package Structure**:
   - Separate the API client into logical domains/resources (e.g., `Contacts`, `Deals`, `Companies`).
   - Use Data Transfer Objects (DTOs) or strictly typed arrays for requests and responses, shielding the consumer from the raw PSR-7 Response objects unless necessary.

4. **Testing Integrations**:
   - Use `php-http/mock-client` to mock HTTP responses in your package tests.
   - Do not make actual HTTP requests to external APIs during unit tests.

5. **Laravel Wrappers**:
   - If the client needs to be used in a Laravel project, build a separate Laravel Service Provider (either in the same package or a dedicated bridge package) that binds the client into the Service Container using Laravel's own HTTP implementation or discovered factories, and optionally provides a Facade.
