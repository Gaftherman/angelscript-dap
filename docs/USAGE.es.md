# Uso

**[English](USAGE.md)** | **[Español](USAGE.es.md)**

Añade AngelScript y este repositorio a tu proyecto de CMake. Se necesitan un compilador C++20, CMake 3.21+, Git y Python 3 (para el parche de cppdap).

| Variable | Función |
| --- | --- |
| `ASDEBUGGER_STD_ADAPTER` | Compila el adaptador de los add-ons de AngelScript (`ASDEBUGGER_STD_ADDON_DIR` debe apuntar a `sdk/add_on`). Déjalo desactivado para implementar `asIDBHostAdapter` tú mismo. |
| `ASDEBUGGER_ANGELSCRIPT_TARGET` | Nombre de tu destino de AngelScript si no es `angelscript`, o un destino que solo aporta cabeceras. |
| `ASDEBUGGER_CORE_COMPILE_OPTIONS` | Opciones de compilación privadas adicionales, por ejemplo `-m32` para una aplicación de 32 bits. |
| `ASDEBUGGER_BUILD_TESTS` | Compila las pruebas del núcleo. |

El destino es `angelscript_dap`; `asdebugger_core` es la misma biblioteca con su nombre anterior.

## Versiones admitidas

El depurador necesita AngelScript 2.36.0 o posterior. Las versiones anteriores ejecutan scripts, pero no tienen la introspección del contexto necesaria para depurar; consulta la [matriz de versiones](https://github.com/Gaftherman/angelscript-engine/blob/main/docs/ENGINE_VERSIONS.md).

## Aplicaciones

El [proyecto de ejemplo](https://github.com/Gaftherman/angelscript-debugger-example) muestra una aplicación completa y la configuración de VS Code. La [CLI de AngelScript](https://github.com/Gaftherman/angelscript-cli) es una aplicación lista para usar: `angelscript --dap-port 9002 script.as`.
