#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { select } = require('@inquirer/prompts');

const targetDir = path.join(process.cwd(), '.agent');
const sourceDir = path.join(__dirname, '..', 'templates', '.agent');

const forceUpdate = process.argv.includes('--force') || process.argv.includes('--update');

console.log('Installing Eolica Agent Kit...');

if (fs.existsSync(targetDir) && !forceUpdate) {
    console.error('ERROR - The .agent directory already exists in this project.');
    console.error('To update, please use the --force or --update flag.');
    process.exit(1);
}

if (fs.existsSync(targetDir) && forceUpdate) {
    console.log('Update flag detected. Overwriting existing .agent directory...');
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

async function run() {
    try {
        copyRecursiveSync(sourceDir, targetDir);
        console.log('COMPLETED - Eolica Agent Kit installed successfully!');

        const ide = await select({
            message: 'Which AI Assistant are you using? We will generate the configuration file for it:',
            choices: [
                { value: 'cursor', name: 'Cursor (.cursorrules)' },
                { value: 'windsurf', name: 'Windsurf (.windsurfrules)' },
                { value: 'github', name: 'GitHub Copilot (.github/copilot-instructions.md)' },
                { value: 'roo', name: 'Roo Code / Cline (.clinerules)' },
                { value: 'none', name: 'None / Skip' }
            ]
        });

        if (ide !== 'none') {
            const rulesContent = fs.readFileSync(path.join(sourceDir, 'rules', 'EOLICA_WEB.md'), 'utf8');
            const intro = 'You are an AI assistant in an Eolica-Web repository. Please adhere to the following global rules:\n\n';
            const extra = '\n\nAdditionally, explore the `.agent/` directory for specialized Agent profiles (`.agent/agents/`), automated workflows (`.agent/workflows/`), and specific coding skills (`.agent/skills/`) when relevant to your task.';

            const finalContent = intro + rulesContent + extra;

            let destFile = '';
            if (ide === 'cursor') destFile = '.cursorrules';
            else if (ide === 'windsurf') destFile = '.windsurfrules';
            else if (ide === 'github') {
                const githubDir = path.join(process.cwd(), '.github');
                if (!fs.existsSync(githubDir)) {
                    fs.mkdirSync(githubDir, { recursive: true });
                }
                destFile = path.join('.github', 'copilot-instructions.md');
            } else if (ide === 'roo') destFile = '.clinerules';

            fs.writeFileSync(path.join(process.cwd(), destFile), finalContent);
            console.log(`Generated ${destFile} successfully!`);
        }

        console.log('You can now use AI agents tailored for Eolica-Web, execute our /slash workflows, and benefit from our predefined Skills.');
    } catch (error) {
        if (error.name === 'ExitPromptError') {
            console.log('\nSetup aborted by user.');
            process.exit(0);
        }
        console.error('ERROR - Failed to install Eolica Agent Kit:', error.message);
        process.exit(1);
    }
}

run();
