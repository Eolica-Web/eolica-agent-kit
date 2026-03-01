---
description: Deployment command for Eolica-Web production releases to Laravel Forge. Includes pre-flight checks (ECS, PHPStan, Pest).
---

# /deploy - Production Deployment

$ARGUMENTS

---

## Purpose

This command handles the safe deployment of an Eolica-Web application to **Laravel Forge**. It ensures quality standards are met before executing the actual deployment trigger or pushing tags.

## Pre-Deployment Checklist

Before triggering a deployment, run these checks to ensure code quality and stability:

```markdown
## 🚀 Pre-Deploy Checklist (Eolica-Web)

### Code Style & Quality
- [ ] Format and lint code (`./vendor/bin/ecs check`)
- [ ] Run static analysis (`./vendor/bin/phpstan analyse`)

### Testing
- [ ] Run the complete test suite (`./vendor/bin/pest` or `./vendor/bin/phpunit`)

### Ready to deploy? (y/n)
```

## Deployment Script Execution

If the user has `// turbo` enabled in their prompt or confirms the checklist, execute the following sequentially:

1. **ECS Formatting**
```bash
./vendor/bin/ecs check
```

2. **PHPStan Static Analysis**
```bash
./vendor/bin/phpstan analyse
```

3. **Pest Tests**
```bash
./vendor/bin/pest
```

4. **Forge Trigger**
Determine how the Forge deployment is triggered.
- Option A: Push to the `main` or `production` branch (Forge auto-deploys).
- Option B: Hit the Forge Deployment trigger URL using `curl`.

Ask the user: "Do you want me to commit and push these changes to branch `main`, or hit a specific Forge Webhook URL?"

## Output Format

### Successful Deploy

```markdown
## 🚀 Deployment Successful

### Summary
- **Checks Passed:** ECS, PHPStan, Pest
- **Status:** Deployed via Push/Webhook to Laravel Forge.

### Health Check
✅ All automated checks are green.
```
