# Support

**[English](SUPPORT.md)** | **[Español](SUPPORT.es.md)**

## Where to ask

| Question | Where |
| --- | --- |
| The debugger core does not attach, stops on the wrong line or shows wrong values | [angelscript-dap issues](https://github.com/angelscript-tools/angelscript-dap/issues) |
| Running or checking scripts from the terminal | [angelscript-cli issues](https://github.com/angelscript-tools/angelscript-cli/issues) |
| Diagnostics, hover, completion or the VS Code extension | [angelscript-lsp issues](https://github.com/angelscript-tools/angelscript-lsp/issues) |
| The Sven Co-op plugin | [asdebugger issues](https://github.com/Gaftherman/svencoop-asdebugger/issues) |

## What to include

- The AngelScript version your host embeds (`ANGELSCRIPT_VERSION_STRING`) and whether it is an official release.
- Your operating system and compiler.
- The adapter in use: the standard add-on adapter or your own `asIDBHostAdapter`.
- The `launch.json` configuration and the DAP trace if you have it (VS Code: `"trace": true`).
- A script of a few lines that reproduces the problem.

## Supported versions

The debugger supports AngelScript 2.36.0 and later. The latest release, 2.39.0, is the reference. Older releases run scripts but cannot be debugged.
