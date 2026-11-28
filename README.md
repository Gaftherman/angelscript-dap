# AngelScript DAP

**[English](README.md)** | **[Español](docs/README.es.md)**

A host-agnostic Debug Adapter Protocol (DAP) server for AngelScript. Embed it in a C++ application, attach VS Code, and debug scripts with breakpoints, stepping, call stack and variables.

<p align="center"><img src="docs/images/debugger-cli.gif" alt="VS Code attached to a script running in Command Prompt" width="720"></p>

## Features

- Breakpoints, step over, step in, step out, continue and pause.
- Call stack, locals, parameters and globals, with objects, arrays, dictionaries and strings expanded.
- A TCP DAP server (port `9002` by default) for VS Code `attach` and `launch`.
- A small host interface (`asIDBHostAdapter`) and a ready adapter for the vanilla `string`, `array` and `dictionary` add-ons.
- AngelScript **2.36.0 and later**.

## Use it

~~~cmake
add_subdirectory("${ANGELSCRIPT_SDK}/angelscript/projects/cmake" angelscript)
set(ASDEBUGGER_STD_ADAPTER ON)
set(ASDEBUGGER_STD_ADDON_DIR "${ANGELSCRIPT_SDK}/add_on")
add_subdirectory(external/angelscript-dap)

add_executable(my_host main.cpp)
target_link_libraries(my_host PRIVATE angelscript_dap)
~~~

Options and requirements are in [docs/USAGE.md](docs/USAGE.md). For a ready-made host, run `angelscript --dap-port 9002 script.as` with the [AngelScript CLI](https://github.com/angelscript-tools/angelscript-cli).

## Building from source

The core links against an AngelScript target supplied by the parent project, so it is built and tested through the [example project](https://github.com/angelscript-tools/angelscript-debugger-example). See [CONTRIBUTING.md](CONTRIBUTING.md).

## Documentation

- [Usage](docs/USAGE.md) — CMake options and requirements.
- [Support](docs/SUPPORT.md) — where to ask and what to include.
- [Recording the demos](docs/DEMOS.md) — how `debugger-cli.gif` is made.
- [CHANGELOG.md](CHANGELOG.md) — release history.

## Roadmap

- Debugger support while the [JIT](https://github.com/angelscript-tools/angelscript-jit) is active.
- More ready-made host adapters.

## Support

Open an [issue](https://github.com/angelscript-tools/angelscript-dap/issues) for the debugger core. [docs/SUPPORT.md](docs/SUPPORT.md) says what to include and where the other projects take their issues.

## Related

| Project | Use |
| --- | --- |
| [angelscript-cli](https://github.com/angelscript-tools/angelscript-cli) | Run, check and debug scripts from the terminal |
| [angelscript-lsp](https://github.com/angelscript-tools/angelscript-lsp) | Editor support for VS Code |
| [angelscript-debugger-example](https://github.com/angelscript-tools/angelscript-debugger-example) | A host that shows how to use the debugger |
| [angelscript-jit](https://github.com/angelscript-tools/angelscript-jit) | Optional JIT compiler |
| [angelscript-engine](https://github.com/angelscript-tools/angelscript-engine) | Support for older AngelScript releases |
| [asdebugger](https://github.com/Gaftherman/svencoop-asdebugger) | The Sven Co-op plugin built on this core |

## Credits

Third-party notices are in [docs/THIRD_PARTY.md](docs/THIRD_PARTY.md).

| Project | License | Use |
| --- | --- | --- |
| [AngelScript](https://github.com/anjo76/angelscript) by Andreas Jönsson | zlib | The language and its runtime |
| [cppdap](https://github.com/google/cppdap) | Apache-2.0 | Debug Adapter Protocol library |
| [nlohmann/json](https://github.com/nlohmann/json) | MIT | JSON, through cppdap |

## License

This repository is licensed under the [MIT License](LICENSE).
