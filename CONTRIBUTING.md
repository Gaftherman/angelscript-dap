# Contributing to AngelScript DAP

**[English](CONTRIBUTING.md)** | **[Español](docs/CONTRIBUTING.es.md)**

Thank you for helping. Bug reports, fixes, documentation and examples are all welcome.

## Report a problem

Open an [issue](https://github.com/angelscript-tools/angelscript-dap/issues) with the version you use, your operating system, the steps to reproduce it and the output you saw. A script of a few lines that reproduces the problem helps most.

## Propose a change

1. Fork the repository and create a branch from `main`.
2. Keep each change small and focused, with tests when behaviour changes.
3. Write commit messages as `type(scope): short imperative description` without a trailing period. Types: `feat`, `fix`, `test`, `perf`, `refactor`, `style`, `docs`, `chore`.
4. Open a pull request that says what changed and how you checked it.

## Build and test

The core links against an AngelScript target that the parent project supplies, so build and test it through the example project:

~~~sh
git clone --recursive https://github.com/angelscript-tools/angelscript-debugger-example.git
cd angelscript-debugger-example
cmake -S . -B build -G Ninja -DASDEBUGGER_DIR=<path to this checkout>
cmake --build build
ctest --test-dir build
~~~

## Style

C++20 with RAII and smart pointers. Follow `.editorconfig` (4 spaces, LF). Format Python with `ruff format`.

## License

By contributing you agree that your work is released under the [MIT License](LICENSE).

## Related projects

| Project | Use |
| --- | --- |
| [angelscript-dap](https://github.com/angelscript-tools/angelscript-dap) | The debugger core |
| [angelscript-debugger-example](https://github.com/angelscript-tools/angelscript-debugger-example) | A host that shows how to use the debugger |
| [angelscript-cli](https://github.com/angelscript-tools/angelscript-cli) | Run, check and debug scripts from the terminal |
| [angelscript-lsp](https://github.com/angelscript-tools/angelscript-lsp) | Editor support for VS Code |
