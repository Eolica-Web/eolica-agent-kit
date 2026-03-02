#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

try {
    copyRecursiveSync(sourceDir, targetDir);
    console.log('COMPLETED - Eolica Agent Kit installed successfully!');
    console.log('You can now use AI agents tailored for Eolica-Web, execute our /slash workflows, and benefit from our predefined Skills.');
} catch (error) {
    console.error('ERROR - Failed to install Eolica Agent Kit:', error.message);
    process.exit(1);
}
