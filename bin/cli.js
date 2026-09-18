#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.join(__dirname, '..', 'assets');

// Terminal ANSI styling
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    blue: '\x1b[34m',
};

function banner() {
    console.log(`
${colors.cyan}${colors.bold}  ___        _   _                     _ _          ___ ____  _____   ____ _____ _     
 / _ \\ _ __ | |_(_) __ _ _ __ __ ___   _(_) |_ _   _|_ _|  _ \\| ____| |  _ \\_   _| |    
| |_| | '_ \\| __| |/ _\` | '__/ _\` \\ \\ / / | __| | | || || | | |  _|   | |_) || | | |    
|  _  | | | | |_| | (_| | | | (_| |\\ V /| | |_| |_| || || |_| | |___  |  _ < | | | |___ 
|_| |_|_| |_|\\__|_|\\__, |_|  \\__,_| \\_/ |_|\\__|\\__, |___|____/|_____| |_| \\_\\|_| |_____|
                   |___/                       |___/                                    ${colors.reset}
${colors.dim}  Universal RTL & Vazirmatn Font Patcher for Antigravity IDE (Pure CSS - Zero CPU Overhead)${colors.reset}
`);
}

function printHelp() {
    console.log(`
${colors.bold}Usage:${colors.reset}
  npx antigravity-ide-rtl [options]

${colors.bold}Options:${colors.reset}
  -p, --path <path>    Specify custom path to Antigravity IDE app folder
                       (e.g., /opt/antigravity-ide/resources/app)
  -r, --restore        Restore original files and uninstall RTL patch
  -s, --status         Check whether Antigravity IDE is currently patched
  -h, --help           Show this help message
  -v, --version        Show current version

${colors.bold}Examples:${colors.reset}
  npx antigravity-ide-rtl
  sudo npx antigravity-ide-rtl
  npx antigravity-ide-rtl --restore
`);
}

function findAppPath(customPath) {
    if (customPath) {
        let resolved = path.resolve(customPath);
        if (fs.existsSync(resolved)) {
            if (fs.existsSync(path.join(resolved, 'resources', 'app'))) {
                return path.join(resolved, 'resources', 'app');
            }
            return resolved;
        }
        console.error(`${colors.red}✖ Provided path does not exist: ${customPath}${colors.reset}`);
        process.exit(1);
    }

    const platform = os.platform();
    const candidates = [];

    if (platform === 'linux') {
        candidates.push(
            '/opt/antigravity-ide/resources/app',
            '/usr/lib/antigravity-ide/resources/app',
            '/usr/share/antigravity-ide/resources/app',
            path.join(os.homedir(), '.local/share/antigravity-ide/resources/app'),
            path.join(os.homedir(), '.antigravity-ide/resources/app'),
            // Flatpak
            path.join(os.homedir(), '.var/app/com.google.antigravity-ide/resources/app'),
            '/var/lib/flatpak/app/com.google.antigravity-ide/current/active/files/antigravity-ide/resources/app'
        );
    } else if (platform === 'darwin') {
        candidates.push(
            '/Applications/Antigravity IDE.app/Contents/Resources/app',
            path.join(os.homedir(), 'Applications/Antigravity IDE.app/Contents/Resources/app')
        );
    } else if (platform === 'win32') {
        candidates.push(
            path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Antigravity IDE', 'resources', 'app'),
            path.join(process.env.PROGRAMFILES || '', 'Antigravity IDE', 'resources', 'app')
        );
    }

    for (const cand of candidates) {
        if (fs.existsSync(cand) && fs.existsSync(path.join(cand, 'out', 'vs'))) {
            return cand;
        }
    }

    return null;
}

function canWrite(targetPath) {
    try {
        if (fs.existsSync(targetPath)) {
            fs.accessSync(targetPath, fs.constants.W_OK);
            return true;
        }
        const dir = path.dirname(targetPath);
        fs.accessSync(dir, fs.constants.W_OK);
        return true;
    } catch {
        return false;
    }
}

async function main() {
    banner();

    const args = process.argv.slice(2);
    let customPath = null;
    let isRestore = false;
    let checkStatus = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '-h' || arg === '--help') {
            printHelp();
            return;
        }
        if (arg === '-v' || arg === '--version') {
            const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
            console.log(`v${pkg.version}`);
            return;
        }
        if (arg === '-r' || arg === '--restore' || arg === 'restore') {
            isRestore = true;
        } else if (arg === '-s' || arg === '--status') {
            checkStatus = true;
        } else if (arg === '-p' || arg === '--path') {
            customPath = args[++i];
        }
    }

    const appPath = findAppPath(customPath);
    if (!appPath) {
        console.error(`${colors.red}✖ Could not automatically locate Antigravity IDE installation.${colors.reset}`);
        console.log(`\nPlease specify the app path manually using:\n  ${colors.cyan}npx antigravity-ide-rtl --path /path/to/antigravity-ide/resources/app${colors.reset}\n`);
        process.exit(1);
    }

    console.log(`${colors.blue}ℹ Antigravity IDE path:${colors.reset} ${appPath}`);

    const workbenchDir = path.join(appPath, 'out', 'vs', 'workbench');
    const htmlDir = path.join(appPath, 'out', 'vs', 'code', 'electron-browser', 'workbench');
    const workbenchHtml = path.join(htmlDir, 'workbench.html');
    const workbenchCss = path.join(workbenchDir, 'workbench.desktop.main.css');

    if (!fs.existsSync(workbenchDir) || !fs.existsSync(workbenchHtml)) {
        console.error(`${colors.red}✖ Invalid Antigravity IDE directory structure. Missing workbench components.${colors.reset}`);
        process.exit(1);
    }

    // Check status
    const htmlContent = fs.readFileSync(workbenchHtml, 'utf8');
    const isPatched = htmlContent.includes('antigravity-chat-rtl.css') || 
                      (fs.existsSync(workbenchCss) && fs.readFileSync(workbenchCss, 'utf8').includes('ANTIGRAVITY-IDE RTL'));

    if (checkStatus) {
        if (isPatched) {
            console.log(`\n${colors.green}✔ Antigravity IDE is currently PATCHED with RTL & Vazirmatn support.${colors.reset}\n`);
        } else {
            console.log(`\n${colors.yellow}⚠ Antigravity IDE is currently NOT patched.${colors.reset}\n`);
        }
        return;
    }

    // RESTORE FLOW
    if (isRestore) {
        console.log(`\n${colors.yellow}↻ Restoring original Antigravity IDE files...${colors.reset}`);

        const htmlBak = workbenchHtml + '.bak';
        const cssBak = workbenchCss + '.bak';

        if (!canWrite(workbenchHtml) || !canWrite(workbenchCss)) {
            console.error(`\n${colors.red}✖ Permission denied. Please re-run with sudo:${colors.reset}\n  ${colors.cyan}sudo npx antigravity-ide-rtl --restore${colors.reset}\n`);
            process.exit(1);
        }

        if (fs.existsSync(htmlBak)) {
            fs.copyFileSync(htmlBak, workbenchHtml);
            fs.unlinkSync(htmlBak);
            console.log(`  ${colors.green}✔ Restored workbench.html${colors.reset}`);
        } else {
            let cleanHtml = htmlContent
                .replace(/\n\t<link rel="stylesheet" href="\.\.\/\.\.\/\.\.\/workbench\/antigravity-chat-rtl\.css">/g, '')
                .replace(/\n<script src="\.\.\/\.\.\/\.\.\/workbench\/antigravity-chat-rtl\.js" type="module"><\/script>/g, '');
            fs.writeFileSync(workbenchHtml, cleanHtml, 'utf8');
            console.log(`  ${colors.green}✔ Cleaned up workbench.html${colors.reset}`);
        }

        if (fs.existsSync(cssBak)) {
            fs.copyFileSync(cssBak, workbenchCss);
            fs.unlinkSync(cssBak);
            console.log(`  ${colors.green}✔ Restored workbench.desktop.main.css${colors.reset}`);
        } else {
            let cleanCss = fs.readFileSync(workbenchCss, 'utf8');
            const marker = '/* === ANTIGRAVITY-IDE RTL';
            if (cleanCss.includes(marker)) {
                cleanCss = cleanCss.split(marker)[0].trim();
                fs.writeFileSync(workbenchCss, cleanCss, 'utf8');
                console.log(`  ${colors.green}✔ Cleaned up workbench.desktop.main.css${colors.reset}`);
            }
        }

        // Clean up injected assets
        const fontDest = path.join(workbenchDir, 'Vazirmatn-Variable.woff2');
        const cssDest = path.join(workbenchDir, 'antigravity-chat-rtl.css');
        const jsDest = path.join(workbenchDir, 'antigravity-chat-rtl.js');

        if (fs.existsSync(fontDest)) fs.unlinkSync(fontDest);
        if (fs.existsSync(cssDest)) fs.unlinkSync(cssDest);
        if (fs.existsSync(jsDest)) fs.unlinkSync(jsDest);

        console.log(`\n${colors.green}${colors.bold}✨ Successfully uninstalled RTL patch. Restart Antigravity IDE to verify.${colors.reset}\n`);
        return;
    }

    // Check permissions
    if (!canWrite(workbenchHtml) || !canWrite(workbenchCss) || !canWrite(workbenchDir)) {
        console.error(`\n${colors.red}✖ Permission denied to modify ${appPath}${colors.reset}`);
        console.log(`Please run with ${colors.bold}sudo${colors.reset}:\n  ${colors.cyan}sudo npx antigravity-ide-rtl${colors.reset}\n`);
        process.exit(1);
    }

    console.log(`\n${colors.cyan}⚙ Applying pure-CSS RTL and Vazirmatn patches (Zero CPU overhead)...${colors.reset}`);

    // 1. Backups
    const htmlBak = workbenchHtml + '.bak';
    const cssBak = workbenchCss + '.bak';
    if (!fs.existsSync(htmlBak)) {
        fs.copyFileSync(workbenchHtml, htmlBak);
        console.log(`  ${colors.dim}• Created backup: workbench.html.bak${colors.reset}`);
    }
    if (!fs.existsSync(cssBak)) {
        fs.copyFileSync(workbenchCss, cssBak);
        console.log(`  ${colors.dim}• Created backup: workbench.desktop.main.css.bak${colors.reset}`);
    }

    // 2. Copy Assets
    const fontSrc = path.join(ASSETS_DIR, 'Vazirmatn-Variable.woff2');
    const cssSrc = path.join(ASSETS_DIR, 'antigravity-chat-rtl.css');

    const fontDest = path.join(workbenchDir, 'Vazirmatn-Variable.woff2');
    const cssDest = path.join(workbenchDir, 'antigravity-chat-rtl.css');

    fs.copyFileSync(fontSrc, fontDest);
    fs.copyFileSync(cssSrc, cssDest);

    // Clean up any legacy js file that caused lag in older versions
    const jsDest = path.join(workbenchDir, 'antigravity-chat-rtl.js');
    if (fs.existsSync(jsDest)) {
        fs.unlinkSync(jsDest);
    }

    console.log(`  ${colors.green}✔ Installed Vazirmatn-Variable font and pure-CSS stylesheet${colors.reset}`);

    // 3. Inject into workbench.html (pure CSS, no JS!)
    let newHtml = htmlContent;
    // Clean up legacy JS script tag if present
    newHtml = newHtml.replace(/\n<script src="\.\.\/\.\.\/\.\.\/workbench\/antigravity-chat-rtl\.js" type="module"><\/script>/g, '');
    newHtml = newHtml.replace('<script src="../../../workbench/antigravity-chat-rtl.js" type="module"></script>', '');

    if (!newHtml.includes('antigravity-chat-rtl.css')) {
        newHtml = newHtml.replace(
            '<link rel="stylesheet" href="../../../workbench/workbench.desktop.main.css">',
            '<link rel="stylesheet" href="../../../workbench/workbench.desktop.main.css">\n\t<link rel="stylesheet" href="../../../workbench/antigravity-chat-rtl.css">'
        );
    }
    fs.writeFileSync(workbenchHtml, newHtml, 'utf8');
    console.log(`  ${colors.green}✔ Injected stylesheet link into workbench.html${colors.reset}`);

    // 4. Update workbench.desktop.main.css
    let cssContent = fs.readFileSync(workbenchCss, 'utf8');
    const marker = '/* === ANTIGRAVITY-IDE RTL';
    if (cssContent.includes(marker)) {
        cssContent = cssContent.split(marker)[0].trim();
    }
    const rtlCss = fs.readFileSync(cssSrc, 'utf8');
    fs.writeFileSync(workbenchCss, cssContent + '\n\n' + rtlCss, 'utf8');
    console.log(`  ${colors.green}✔ Appended styles to workbench.desktop.main.css${colors.reset}`);

    console.log(`
${colors.green}${colors.bold}✨ Antigravity IDE RTL patch successfully applied! (Ultra-lightweight, 0% CPU overhead)${colors.reset}

${colors.bold}Next Steps:${colors.reset}
1. In Antigravity IDE, press ${colors.cyan}Ctrl + Shift + P${colors.reset}
2. Run: ${colors.cyan}Developer: Reload Window${colors.reset} (or restart the IDE)
3. Enjoy smooth, buttery-fast native RTL rendering!
`);
}

main().catch(err => {
    console.error(`\n${colors.red}✖ An unexpected error occurred:${colors.reset}`, err);
    process.exit(1);
});
