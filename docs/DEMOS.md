# Recording the demos

`docs/images/debugger-cli.gif` is recorded by a script, so it can be reproduced after any change. It shows Command Prompt running `asc --dap-port 9002 debug-demo.as` in the VS Code terminal, VS Code attaching to it, a breakpoint, Step Over, Continue and the script's output.

## Requirements

- Node.js 20, `ffmpeg` and `ffprobe` on PATH.
- A built AngelScript extension (`npm run bundle` in `angelscript-lsp/client`).
- `playwright-core` and `@vscode/test-electron` (`npm install` in `scripts/demos/`, or any folder you pass with `--modules`).
- A build of [angelscript-cli](https://github.com/angelscript-tools/angelscript-cli) and its `examples/` folder.

## Record

~~~text
> cd angelscript-lsp\client
> node ..\..\angelscript-dap\scripts\demos\record-cli-debugger.mjs ^
    --client . --cli ..\..\angelscript-cli\build\windows-x64\bin\angelscript.exe ^
    --examples ..\..\angelscript-cli\examples --out ..\..\angelscript-dap\docs\images
~~~

Run it from the client folder so VS Code is downloaded once into its `.vscode-test`. The workspace is created in `C:\demo\dap-cli` and the prompt is `C:\demo\dap-cli>`, so no personal path appears.

The script asserts every step from the page itself (the terminal text, the breakpoint, the paused line and the `total` and `bonus` values) and stops if one is missing. It also fails if the page contains the user name, the home folder or the computer name.

## Review

The recorder writes `docs/images/_review/` (ignored by Git) with `contact-sheet.png` (12 frames), `final-frame.png` and `trace.txt`. [`scripts/demos/review-prompt.txt`](../scripts/demos/review-prompt.txt) is the checklist given to an image-reading model (`agy -p ... --model "Gemini 4 Hydrogen (High)"` from that folder). Its answer is an opinion: open the GIF yourself before publishing it.
