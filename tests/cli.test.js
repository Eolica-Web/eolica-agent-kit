import { test, describe, beforeEach, afterEach } from "vitest";
import { strictEqual, throws } from "node:assert";
import { execSync } from "child_process";
import { mkdtempSync, existsSync, rmSync } from "fs";
import { join, resolve, dirname } from "path";
import { tmpdir } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const initScriptPath = resolve(__dirname, "../bin/cli.mjs");

let tempDir;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), "eolica-test-"));
});

afterEach(() => {
  if (tempDir && existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

function runCli(agentNames = []) {
  const flags = agentNames.map((name) => `--agent ${name}`).join(" ");
  execSync(`node ${initScriptPath} ${flags}`.trim(), { cwd: tempDir, stdio: "pipe" });
}

// ---------------------------------------------------------------------------
// Antigravity
// ---------------------------------------------------------------------------

describe("antigravity agent", () => {
  test("copies global rules to GEMINI.md", () => {
    runCli(["antigravity"]);
    strictEqual(existsSync(join(tempDir, "GEMINI.md")), true, "GEMINI.md should exist");
  });

  test("copies all agents to .agent/agents with original filenames", () => {
    runCli(["antigravity"]);
    const agentsDir = join(tempDir, ".agent", "agents");
    strictEqual(existsSync(agentsDir), true, ".agent/agents should exist");

    const expectedAgents = [
      "code-reviewer.md",
      "database-architect.md",
      "filament-expert.md",
      "laravel-backend-engineer.md",
      "livewire-expert.md",
      "qa-engineer.md",
      "ux-engineer.md",
    ];
    for (const file of expectedAgents) {
      strictEqual(existsSync(join(agentsDir, file)), true, `${file} should exist`);
    }
  });

  test("copies all commands to .agent/workflows with original filenames", () => {
    runCli(["antigravity"]);
    const workflowsDir = join(tempDir, ".agent", "workflows");
    strictEqual(existsSync(workflowsDir), true, ".agent/workflows should exist");

    const expectedCommands = ["extract-translations.md", "make-feature.md", "orchestrate.md"];
    for (const file of expectedCommands) {
      strictEqual(existsSync(join(workflowsDir, file)), true, `${file} should exist`);
    }
  });

  test("creates .agent/rules directory for rules", () => {
    runCli(["antigravity"]);
    strictEqual(existsSync(join(tempDir, ".agent", "rules")), true, ".agent/rules should exist");
  });

  test("copies all skills to .agent/skills preserving subdirectory structure", () => {
    runCli(["antigravity"]);
    const skillsDir = join(tempDir, ".agent", "skills");
    strictEqual(existsSync(skillsDir), true, ".agent/skills should exist");

    const expectedSkills = [
      "blade-components/SKILL.md",
      "domain-driven-actions/SKILL.md",
      "laravel-sail/SKILL.md",
      "pest-architecture/SKILL.md",
    ];
    for (const file of expectedSkills) {
      strictEqual(existsSync(join(skillsDir, file)), true, `${file} should exist`);
    }
  });
});

// ---------------------------------------------------------------------------
// GitHub Copilot
// ---------------------------------------------------------------------------

describe("github-copilot agent", () => {
  test("copies global rules to AGENTS.md", () => {
    runCli(["github-copilot"]);
    strictEqual(existsSync(join(tempDir, "AGENTS.md")), true, "AGENTS.md should exist");
  });

  test("copies all agents to .github/agents with original filenames", () => {
    runCli(["github-copilot"]);
    const agentsDir = join(tempDir, ".github", "agents");
    strictEqual(existsSync(agentsDir), true, ".github/agents should exist");

    const expectedAgents = [
      "code-reviewer.md",
      "database-architect.md",
      "filament-expert.md",
      "laravel-backend-engineer.md",
      "livewire-expert.md",
      "qa-engineer.md",
      "ux-engineer.md",
    ];
    for (const file of expectedAgents) {
      strictEqual(existsSync(join(agentsDir, file)), true, `${file} should exist`);
    }
  });

  test("copies commands to .github/prompts with .prompt.md extension", () => {
    runCli(["github-copilot"]);
    const promptsDir = join(tempDir, ".github", "prompts");
    strictEqual(existsSync(promptsDir), true, ".github/prompts should exist");

    const expectedCommands = [
      "extract-translations.prompt.md",
      "make-feature.prompt.md",
      "orchestrate.prompt.md",
    ];
    for (const file of expectedCommands) {
      strictEqual(existsSync(join(promptsDir, file)), true, `${file} should exist`);
    }
  });

  test("does not keep .md extension without .prompt for commands", () => {
    runCli(["github-copilot"]);
    const promptsDir = join(tempDir, ".github", "prompts");

    const unexpectedCommands = ["extract-translations.md", "make-feature.md", "orchestrate.md"];
    for (const file of unexpectedCommands) {
      strictEqual(existsSync(join(promptsDir, file)), false, `${file} must NOT exist`);
    }
  });

  test("creates .github/instructions directory for rules", () => {
    runCli(["github-copilot"]);
    strictEqual(
      existsSync(join(tempDir, ".github", "instructions")),
      true,
      ".github/instructions should exist",
    );
  });

  test("copies all skills to .github/skills preserving subdirectory structure", () => {
    runCli(["github-copilot"]);
    const skillsDir = join(tempDir, ".github", "skills");
    strictEqual(existsSync(skillsDir), true, ".github/skills should exist");

    const expectedSkills = [
      "blade-components/SKILL.md",
      "domain-driven-actions/SKILL.md",
      "laravel-sail/SKILL.md",
      "pest-architecture/SKILL.md",
    ];
    for (const file of expectedSkills) {
      strictEqual(existsSync(join(skillsDir, file)), true, `${file} should exist`);
    }
  });
});

// ---------------------------------------------------------------------------
// Multiple agents
// ---------------------------------------------------------------------------

test("installs multiple agents in a single run", () => {
  runCli(["antigravity", "github-copilot"]);

  strictEqual(existsSync(join(tempDir, ".agent", "agents")), true);
  strictEqual(existsSync(join(tempDir, ".github", "agents")), true);
  strictEqual(existsSync(join(tempDir, "GEMINI.md")), true, "antigravity writes GEMINI.md");
  strictEqual(existsSync(join(tempDir, "AGENTS.md")), true, "github-copilot writes AGENTS.md");
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

test("exits with non-zero code for an unknown agent name", () => {
  throws(() => runCli(["nonexistent-agent"]), /Command failed/, "should fail for unknown agent");
});
