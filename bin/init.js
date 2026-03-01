#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), '.agent');
const sourceDir = path.join(__dirname, '..', 'templates', '.agent');

console.log('Installing Eolica Agent Kit...');

if (fs.existsSync(targetDir)) {
    console.error('ERROR - The .agent directory already exists in this project.');
    console.error('To update, please remove it manually first or use a force flag (not yet implemented).');
    process.exit(1);
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest);
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
