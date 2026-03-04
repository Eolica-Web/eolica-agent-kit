#!/usr/bin/env node

import { existsSync, statSync, mkdirSync, readdirSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { isCancel, log, multiselect } from "@clack/prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, "..", "resources");

const agents = {
  antigravity: {
    name: "antigravity",
    displayName: "Antigravity",
    globalRulesPath: "GEMINI.md",
    agentsPath: ".agent/agents",
    commandsPath: ".agent/workflows",
    rulesPath: ".agent/rules",
    skillsPath: ".agent/skills",
    transformAgent: (filename) => filename,
    transformCommand: (filename) => filename,
    transformRule: (filename) => filename,
    transformSkill: (filename) => filename,
  },
  "github-copilot": {
    name: "github-copilot",
    displayName: "GitHub Copilot",
    globalRulesPath: "AGENTS.md",
    agentsPath: ".github/agents",
    commandsPath: ".github/prompts",
    rulesPath: ".github/instructions",
    skillsPath: ".github/skills",
    transformAgent: (filename) => filename,
    transformCommand: (filename) => filename.replace(/\.md$/, ".prompt.md"),
    transformRule: (filename) => filename.replace(/\.md$/, ".instruction.md"),
    transformSkill: (filename) => filename,
  },
};

const args = process.argv.slice(2);
const agentArgs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--agent" && args[i + 1]) {
    agentArgs.push(args[++i]);
  }
}

log.info("Installing Eolica Agent Kit...");

function copyRecursiveSync(src, dest, transform = (name) => name) {
  const exists = existsSync(src);
  const stats = exists && statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName), transform);
    });
  } else {
    copyFileSync(src, join(dirname(dest), transform(dest.split("/").pop())));
  }
}

async function main() {
  try {
    let selectedAgents;

    if (agentArgs.length > 0) {
      const unknown = agentArgs.filter((name) => !agents[name]);
      if (unknown.length > 0) {
        log.error(
          `Unknown agent(s): ${unknown.join(", ")}. Valid options: ${Object.keys(agents).join(", ")}`,
        );
        process.exit(1);
      }
      selectedAgents = agentArgs.map((name) => agents[name]);
    } else {
      const selected = await multiselect({
        message: "Which AI Agents are you using?",
        options: Object.values(agents).map((agent) => ({
          value: agent.name,
          label: agent.displayName,
        })),
      });

      if (isCancel(selected)) {
        process.exit(0);
      }

      selectedAgents = selected.map((agentName) => agents[agentName]);
    }

    for (const agent of selectedAgents) {
      copyFileSync(join(sourceDir, "GLOBAL.md"), join(process.cwd(), agent.globalRulesPath));

      copyRecursiveSync(
        join(sourceDir, "agents"),
        join(process.cwd(), agent.agentsPath),
        agent.transformAgent,
      );

      copyRecursiveSync(
        join(sourceDir, "commands"),
        join(process.cwd(), agent.commandsPath),
        agent.transformCommand,
      );

      copyRecursiveSync(
        join(sourceDir, "rules"),
        join(process.cwd(), agent.rulesPath),
        agent.transformRule,
      );

      copyRecursiveSync(
        join(sourceDir, "skills"),
        join(process.cwd(), agent.skillsPath),
        agent.transformSkill,
      );
    }

    log.success("COMPLETED - Eolica Agent Kit installed successfully!");

    log.info(
      "You can now use AI agents tailored for Eolica-Web, execute our /slash commands, and benefit from our predefined Skills.",
    );
  } catch (error) {
    if (error.name === "ExitPromptError") {
      log.info("\nSetup aborted by user.");
      process.exit(0);
    }

    log.error("ERROR - Failed to install Eolica Agent Kit:", error.message);
    process.exit(1);
  }
}

main();
