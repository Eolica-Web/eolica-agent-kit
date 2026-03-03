---
description: Orchestrates an end-to-end task by delegating completely isolated subtasks to specialized agents to keep context clean and save tokens.
---

# /orchestrate - Clean Task Orchestration

$ARGUMENTS

---

## Purpose

When given a complex objective, this workflow guides the primary agent to break the objective into atomic, isolated steps. Each step is assigned to a specific AI profile (`livewire-expert`, `database-architect`, `qa-engineer`, etc.). Crucially, to save tokens and avoid hallucinations, the primary agent MUST clear out the context (close unrelated files) before executing each subtask.

## Expected Steps

When the user runs `/orchestrate [Complex Task Description]`, execute the following strict sequence:

### 1. Planning & Breakdown (No Code Yet)
- Analyze the `$ARGUMENTS`.
- Create a `task.md` outlining the atomic steps required.
- **For each step**, explicitly state what specialized agent profile should be impersonated (e.g., "Step 1: Create DB migration -> `database-architect.md`").
- Do not make any code changes during this phase.

### 2. Execution (Token-Saving Loop)
For **each** step in the plan, perform the following in isolation:
1. **Context Cleanup**: **CLOSE ALL FILES** that are not strictly necessary for this specific step. Drop any accumulated conversational context in your thought process. 
2. **Impersonation**: Read the assigned `.agent/agents/[specialist].md` file to adopt their rules.
3. **Execution**: Perform the precise task (e.g., generate a Livewire component).
4. **Verification**: Verify the change works (e.g., run tests or PHPStan).
5. **Mark Done**: Update `task.md` as complete for this step.
6. **Stop**: Do not proceed to the next step immediately. Start a new clean context for the next step by repeating the loop.

### 3. Final Review (Code Reviewer)
- Once all execution steps are complete, read `.agent/agents/code-reviewer.md`.
- Review the entire diff to ensure cohesiveness and that architectural guidelines were respected.
- Summarize the completion for the user.

## Golden Rules for Orquestration
- **Never open more than 3-4 files at once** unless absolutely necessary.
- **Do not plan and code in the same step.**
- **If a step fails**, debug it under the same specialized persona before moving on.
