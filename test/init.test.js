const test = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

test('eolica-agent-kit init script', async (t) => {
    let tempDir;

    t.beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eolica-test-'));
    });

    t.afterEach(() => {
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    await t.test('should copy .agent folder to the current working directory', () => {
        const initScriptPath = path.resolve(__dirname, '../bin/init.js');

        execSync(`node ${initScriptPath}`, { cwd: tempDir, stdio: 'pipe' });

        const targetAgentDir = path.join(tempDir, '.agent');
        assert.strictEqual(fs.existsSync(targetAgentDir), true, '.agent directory should exist');

        const agentsDir = path.join(targetAgentDir, 'agents');
        assert.strictEqual(fs.existsSync(agentsDir), true, '.agent/agents directory should exist');

        const uxEngineerFile = path.join(agentsDir, 'ux-engineer.md');
        assert.strictEqual(fs.existsSync(uxEngineerFile), true, 'ux-engineer.md should exist');
    });

    await t.test('should overwrite .agent folder if --force is used', () => {
        const initScriptPath = path.resolve(__dirname, '../bin/init.js');
        const targetAgentDir = path.join(tempDir, '.agent');
        const dummyFilePath = path.join(targetAgentDir, 'dummy.txt');

        fs.mkdirSync(targetAgentDir);
        fs.writeFileSync(dummyFilePath, 'test-dummy-content');

        execSync(`node ${initScriptPath} --force`, { cwd: tempDir, stdio: 'pipe' });

        const agentsDir = path.join(targetAgentDir, 'agents');
        assert.strictEqual(fs.existsSync(agentsDir), true, 'Templates should be copied overriding the dummy folder');
        assert.strictEqual(fs.existsSync(dummyFilePath), true, 'Dummy file should still exist');
    });

    await t.test('should fail if .agent exists and no --force flag is provided', () => {
        const initScriptPath = path.resolve(__dirname, '../bin/init.js');
        const targetAgentDir = path.join(tempDir, '.agent');

        fs.mkdirSync(targetAgentDir);

        assert.throws(() => {
            execSync(`node ${initScriptPath}`, { cwd: tempDir, stdio: 'pipe' });
        }, /Command failed/);
    });
});
