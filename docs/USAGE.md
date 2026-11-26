# Usage

**[English](USAGE.md)** | **[Español](USAGE.es.md)**

Add AngelScript and this repository to your CMake project. A C++20 compiler, CMake 3.21+, Git and Python 3 (for the cppdap patch) are required.

| Variable | Purpose |
| --- | --- |
| `ASDEBUGGER_STD_ADAPTER` | Build the adapter for the vanilla add-ons (`ASDEBUGGER_STD_ADDON_DIR` must point to `sdk/add_on`). Leave it off to implement `asIDBHostAdapter` yourself. |
| `ASDEBUGGER_ANGELSCRIPT_TARGET` | Name of your AngelScript target when it is not `angelscript`, or a headers-only target. |
| `ASDEBUGGER_CORE_COMPILE_OPTIONS` | Extra private compile options, for example `-m32` for a 32-bit host. |
| `ASDEBUGGER_BUILD_TESTS` | Build the core tests. |

The target is `angelscript_dap`; `asdebugger_core` is the same library under its earlier name.

## Supported versions

The debugger needs AngelScript 2.36.0 or later. Older releases run scripts but have no context introspection for debugging; see the [engine matrix](https://github.com/Gaftherman/angelscript-engine/blob/main/docs/ENGINE_VERSIONS.md).

## Hosts

The [example project](https://github.com/Gaftherman/angelscript-debugger-example) shows a complete host and a VS Code setup. The [AngelScript CLI](https://github.com/Gaftherman/angelscript-cli) is a ready-made host: `angelscript --dap-port 9002 script.as`.
