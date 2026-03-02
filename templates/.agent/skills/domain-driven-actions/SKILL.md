---
description: Guidelines for implementing Action classes, Data Transfer Objects (DTOs), and Command Query Responsibility Segregation (CQRS) within a Domain-Driven folder structure.
---

# Domain-Driven Actions & CQRS (Eolica-Web)

For complex Eolica-Web applications (typically beyond a simple CRUD), the standard MVC folder structure (`app/Models`, `app/Http/Controllers`) quickly becomes unmanageable.

To maintain scalability and a clean architecture within Laravel 12, we prefer a **Domain-Driven Design (DDD)** approach combined with **CQRS (Command Query Responsibility Segregation)**, grouped by business domains.

## 1. Domain-Driven Folder Structure

Instead of organizing code by technical type (all models together, all actions together), organize code by its **business purpose** (the "Domain").

A typical domain structure located in `app/Domains/` looks like this:

```text
app/
└── Domains/
    └── Billing/
        ├── Actions/          (Write Operations / Commands)
        ├── DTOs/             (Data Transfer Objects)
        ├── Enums/            (States, Types)
        ├── Events/           (Domain Events)
        ├── Listeners/        (Event Reactions)
        ├── Models/           (Eloquent Models for this domain)
        ├── Queries/          (Read Operations)
        └── Repositories/     (Data Access Abstraction)
```

*(Note: In Laravel 11/12, you may need to map these namespaces in `composer.json` or ensure PSR-4 autoloading covers `App\Domains\*`).*

## 2. The Action Pattern (CQRS 'Commands')

An **Action** class represents a single, highly specific operation that mutates state (a Command in CQRS).

**Rules for Actions:**
*   **Single Responsibility**: An action does exactly one thing (e.g., `ChargeUserAction`, `RefundInvoiceAction`).
*   **Naming**: Must end in `Action` and consist of a Verb + Noun.
*   **Method signature**: Expose a single public method. Prefer exactly `execute()` or `handle()`.
*   **Dependency Injection**: Resolve dependencies via the Constructor.

```php
<?php

declare(strict_types=1);

namespace App\Domains\Billing\Actions;

use App\Domains\Billing\Models\User;
use App\Domains\Billing\DTOs\ChargeData;
use Illuminate\Support\Facades\DB;

readonly class ChargeUserAction
{
    public function __construct(
        private PaymentGatewayInterface $gateway
    ) {}

    public function execute(User $user, ChargeData $data): void
    {
        DB::transaction(function () use ($user, $data) {
            // 1. Process via gateway
            $this->gateway->charge($user->stripe_id, $data->amount);

            // 2. Mutate Local State
            $user->invoices()->create([
                'amount' => $data->amount,
                'currency' => $data->currency->value,
            ]);
        });
    }
}
```

## 3. Data Transfer Objects (DTOs) & Enums

Never pass generic arrays (like `$request->all()`) into Actions or Services. This breaks type safety and obscures the data structure. Instead, use **Strictly Typed DTOs** and **PHP 8.1+ Enums**.

```php
<?php

declare(strict_types=1);

namespace App\Domains\Billing\DTOs;

use App\Domains\Billing\Enums\Currency;

readonly class ChargeData
{
    public function __construct(
        public int $amount, // Amount in cents
        public Currency $currency,
    ) {}

    // Factory method from a Form Request
    public static function fromRequest(ChargeRequest $request): self
    {
        return new self(
            amount: (int) $request->validated('amount'),
            currency: Currency::from($request->validated('currency'))
        );
    }
}
```

## 4. CQRS 'Queries' (Read Operations)

While Actions handle writes (state mutation), complex read operations (e.g., an intricate reporting dashboard) should not clutter Eloquent Models or Controllers.

Extract them into dedicated Query classes inside the `Queries/` folder.

```php
<?php

declare(strict_types=1);

namespace App\Domains\Billing\Queries;

class MonthlyRevenueQuery
{
    public function get(int $year, int $month): float
    {
        // Complex joins, groupings, and caching logic here.
    }
}
```

## 5. Slim Controllers Integration

By moving business logic into Domain Actions and Queries, HTTP Controllers simply become lightweight traffic hubs that convert HTTP Requests into DTOs, pass them to Actions/Queries, and return formatted Responses (or Livewire views).

```php
public function store(ChargeRequest $request, ChargeUserAction $action)
{
    $dto = ChargeData::fromRequest($request);
    
    $action->execute($request->user(), $dto);

    return redirect()->route('dashboard')->with('success', 'Charged successfully.');
}
```
