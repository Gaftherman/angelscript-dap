#!/usr/bin/env node
// Records VS Code attaching to a script that the AngelScript CLI runs in Command Prompt, as an animated GIF.
//
//   node record-cli-debugger.mjs --client <angelscript-lsp/client> --cli <angelscript.exe> \
//        --examples <angelscript-cli/examples> --out <output dir> [--modules <dir with node_modules>]
//
// The client folder must be a built extension (`npm run bundle`). playwright-core and
// @vscode/test-electron must be installed in it, or in the folder given with --modules. ffmpeg and ffprobe must be on PATH. The workspace is created in a
// neutral folder so no personal path appears in the capture.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const option = name => {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? path.resolve(process.argv[index + 1]) : undefined;
};
const clientRoot = option('client');
const cliBinary = option('cli');
const examplesDir = option('examples');
const outDir = option('out') ?? path.resolve(here, '../../docs/images');
if (!clientRoot || !cliBinary || !examplesDir) {
  console.error('Usage: record-cli-debugger.mjs --client <dir> --cli <exe> --examples <dir> [--out <dir>]');
  process.exit(2);
}

const modulesRoot = option('modules') ?? clientRoot;
const require = createRequire(path.join(modulesRoot, 'package.json'));
const { _electron: electron } = require('playwright-core');
const { downloadAndUnzipVSCode } = require('@vscode/test-electron');

const workspace = 'C:\\demo\\dap-cli';
const binDir = 'C:\\demo\\dap-bin';
const reviewDir = path.join(outDir, '_review');
const videoDir = path.join(outDir, '_video');
for (const dir of [workspace, binDir, reviewDir, videoDir]) fs.rmSync(dir, { recursive: true, force: true });
for (const dir of [workspace, binDir, path.join(workspace, '.vscode'), reviewDir, videoDir]) fs.mkdirSync(dir, { recursive: true });

fs.copyFileSync(cliBinary, path.join(binDir, 'asc.exe'));
for (const name of ['angelscript-cli.as.predefined', 'angelscript.rules.json']) {
  fs.copyFileSync(path.join(examplesDir, name), path.join(workspace, name));
}
fs.copyFileSync(path.join(here, 'workspace', 'debug-demo.as'), path.join(workspace, 'debug-demo.as'));
fs.copyFileSync(path.join(here, 'workspace', 'launch.json'), path.join(workspace, '.vscode', 'launch.json'));

const settings = JSON.parse(fs.readFileSync(path.join(clientRoot, 'scripts/demos/user-settings.json'), 'utf8'));
const userDataDir = fs.mkdtempSync(path.join(clientRoot, '.vscode-test', 'dap-user-data-'));
fs.mkdirSync(path.join(userDataDir, 'User'));
fs.writeFileSync(path.join(userDataDir, 'User', 'settings.json'), JSON.stringify({
  ...settings,
  'terminal.integrated.defaultProfile.windows': 'Command Prompt',
  'terminal.integrated.fontSize': 15,
  'terminal.integrated.gpuAcceleration': 'off',
  'editor.fontSize': 19,
  'editor.lineHeight': 26,
  'editor.padding.top': 10,
  'editor.padding.bottom': 10,
  'editor.codeLens': false,
  'editor.inlayHints.enabled': 'off',
  'editor.glyphMargin': true,
  'editor.hover.enabled': false,
  'editor.renderValidationDecorations': 'off',
  'debug.internalConsoleOptions': 'neverOpen',
  'debug.toolBarLocation': 'docked',
  'workbench.activityBar.location': 'default',
  'workbench.secondarySideBar.defaultVisibility': 'hidden',
  'window.title': '${activeEditorShort}${separator}${rootName}',
}, null, 2));

const vscodePath = await downloadAndUnzipVSCode('1.146.0');
const emptyExt = path.join(clientRoot, '.vscode-test', 'empty-extensions');
fs.mkdirSync(emptyExt, { recursive: true });

const app = await electron.launch({
  executablePath: vscodePath,
  recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } },
  env: { ...process.env, PATH: `${binDir};${process.env.PATH}`, PROMPT: '$P$G' },
  args: [
    '--window-size=1280,720', '--force-device-scale-factor=1', workspace,
    '--extensionDevelopmentPath=' + clientRoot,
    '--extensions-dir=' + emptyExt, '--user-data-dir=' + userDataDir,
    '--locale=en', '--no-sandbox', '--disable-gpu-sandbox', '--disable-updates',
    '--disable-telemetry', '--disable-workspace-trust', '--skip-welcome', '--skip-release-notes',
    path.join(workspace, 'debug-demo.as'),
  ],
});

const trace = [];
const note = message => { trace.push(message); console.log(message); };
let failure;
let sceneStart = 0;
let sceneEnd = 0;
try {
  const win = await app.firstWindow();
  await win.waitForSelector('.monaco-workbench', { timeout: 30000 });
  try {
    const bw = await app.browserWindow(win);
    await bw.evaluate(b => { b.setContentSize(1280, 720); b.center(); });
  } catch { /* the window keeps its size */ }

  const wait = (locator, timeout = 8000) => locator.waitFor({ timeout });
  const gone = (locator, timeout = 8000) => locator.waitFor({ state: 'hidden', timeout });
  const editor = win.locator('.part.editor .monaco-editor:visible').first();
  const terminalText = async () => (await win.locator('.xterm-rows').first().innerText()).replace(/\u00a0/g, ' ');
  const waitTerminal = async (pattern, timeout = 8000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (pattern.test(await terminalText())) return;
      await win.waitForTimeout(150);
    }
    throw new Error(`The terminal never showed ${pattern}.\n${await terminalText()}`);
  };
  const variables = win.locator('.debug-variables .expression');
  const value = name => variables.filter({ hasText: new RegExp(`\\b${name}\\b`) }).locator('.value');
  const highlight = editor.locator('.debug-top-stack-frame-line').first();
  const breakpoint = editor.locator('.glyph-margin-widgets .codicon-debug-breakpoint').first();
  const gutter = async () => {
    const line = await editor.locator('.view-line').filter({ hasText: /total\s*\+=\s*bonus/ }).boundingBox({ timeout: 5000 });
    const margin = await editor.locator('.glyph-margin').boundingBox({ timeout: 5000 });
    if (!line || !margin) throw new Error('Could not find the breakpoint line in the gutter.');
    return { x: margin.x + margin.width / 2, y: line.y + line.height / 2 };
  };

  // The extension needs a moment to start the language server before the first frame is steady.
  await win.waitForTimeout(12000);
  await win.keyboard.press('Control+Shift+P');
  await win.waitForTimeout(300);
  await win.keyboard.type('View: Close Primary Side Bar');
  await win.keyboard.press('Enter');
  await win.waitForTimeout(500);
  await win.keyboard.press('Control+`');
  await wait(win.locator('.xterm-rows').first(), 10000);
  await waitTerminal(/>\s*$/, 10000);
  await win.keyboard.type('cls');
  await win.keyboard.press('Enter');
  await win.waitForTimeout(600);

  sceneStart = Date.now();
  await win.keyboard.type('asc --dap-port 9002 debug-demo.as', { delay: 70 });
  await win.waitForTimeout(700);
  await win.keyboard.press('Enter');
  await waitTerminal(/DAP listening on 127\.0\.0\.1:9002/);
  note('The CLI waits for a debugger on port 9002.');
  await win.waitForTimeout(1500);

  const point = await gutter();
  await win.mouse.move(point.x, point.y, { steps: 6 });
  await win.mouse.click(point.x, point.y);
  await wait(breakpoint);
  note('Breakpoint set on the addBonus line.');
  await win.waitForTimeout(900);

  await win.keyboard.press('Control+Shift+d');
  await wait(win.locator('.part.sidebar').getByText('Variables', { exact: true }));
  await win.locator('.part.editor .view-line:visible').first().click({ position: { x: 4, y: 11 } });
  await win.waitForTimeout(600);
  await win.keyboard.press('F5');
  await wait(highlight, 12000);
  await wait(value('total').filter({ hasText: /^\s*5\s*$/ }));
  note('Attached: paused in addBonus with total = 5.');
  await win.waitForTimeout(2600);

  await win.keyboard.press('F10');
  await wait(value('total').filter({ hasText: /^\s*7\s*$/ }));
  note('Step Over: total = 7.');
  await win.waitForTimeout(2200);

  await win.keyboard.press('F5');
  await wait(value('total').filter({ hasText: /^\s*7\s*$/ }));
  await wait(value('bonus').filter({ hasText: /^\s*3\s*$/ }));
  note('Continue: paused again in the second call with bonus = 3.');
  await win.waitForTimeout(2200);

  const second = await gutter();
  await win.mouse.click(second.x, second.y);
  await gone(breakpoint);
  await win.keyboard.press('F5');
  await waitTerminal(/Total: 10/, 10000);
  note('Continue: the script finished and Command Prompt shows its output.');
  await win.waitForTimeout(2500);
  sceneEnd = Date.now();

  const pageText = await win.evaluate(() => document.body.innerText);
  for (const secret of [os.userInfo().username, os.homedir(), os.hostname()]) {
    if (secret && pageText.toLowerCase().includes(secret.toLowerCase())) throw new Error('The page contains a private value.');
  }
  await win.screenshot({ path: path.join(reviewDir, 'final-frame.png') });
} catch (error) {
  failure = error;
}

const video = app.windows()[0]?.video();
await app.close();
fs.rmSync(userDataDir, { recursive: true, force: true });
if (failure) {
  console.error(failure.message);
  process.exit(1);
}
const videoPath = await video.path();
fs.writeFileSync(path.join(reviewDir, 'trace.txt'), trace.join('\n') + '\n');

const ffmpeg = args => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'pipe' });
const duration = file => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'default=noprint_wrappers=1:nokey=1', file], { encoding: 'utf8' }).trim());
const scene = (sceneEnd - sceneStart) / 1000;
const start = Math.max(0, duration(videoPath) - scene - 0.3);
const gif = path.join(outDir, 'debugger-cli.gif');
const palette = path.join(reviewDir, 'palette.png');
const limit = 5_000_000;
for (const { width, fps, colors } of [
  { width: 960, fps: 12, colors: 128 }, { width: 960, fps: 10, colors: 96 },
  { width: 960, fps: 8, colors: 64 }, { width: 800, fps: 8, colors: 48 },
]) {
  const input = ['-ss', start.toFixed(3), '-t', scene.toFixed(3), '-i', videoPath];
  const filter = `scale=${width}:-2:flags=lanczos,fps=${fps}`;
  ffmpeg([...input, '-vf', `${filter},palettegen=stats_mode=diff:max_colors=${colors}`, '-frames:v', '1', '-update', '1', palette]);
  ffmpeg([...input, '-i', palette, '-filter_complex', `[0:v]${filter}[s];[s][1:v]paletteuse=dither=none:diff_mode=rectangle`, '-loop', '0', gif]);
  if (fs.statSync(gif).size <= limit) break;
}
if (fs.statSync(gif).size > limit) throw new Error('The GIF is larger than 5 MB.');
const length = duration(gif);
ffmpeg(['-i', gif, '-vf', `fps=12/${length}:round=up,scale=480:-1,tile=3x4`, '-frames:v', '1', '-update', '1',
  path.join(reviewDir, 'contact-sheet.png')]);
fs.rmSync(videoDir, { recursive: true, force: true });
fs.rmSync(palette);
console.log(`debugger-cli.gif: ${(fs.statSync(gif).size / 1024).toFixed(0)} KiB, ${length.toFixed(1)} s`);
