# Soporte

**[English](SUPPORT.md)** | **[Español](SUPPORT.es.md)**

## Dónde preguntar

| Pregunta | Dónde |
| --- | --- |
| El núcleo del depurador no se conecta, se detiene en la línea equivocada o muestra valores incorrectos | [incidencias de angelscript-dap](https://github.com/Gaftherman/angelscript-dap/issues) |
| Ejecutar o comprobar scripts desde la terminal | [incidencias de angelscript-cli](https://github.com/Gaftherman/angelscript-cli/issues) |
| Diagnósticos, hover, autocompletado o la extensión de VS Code | [incidencias de angelscript-lsp](https://github.com/Gaftherman/angelscript-lsp/issues) |
| El complemento de Sven Co-op | [incidencias de asdebugger](https://github.com/Gaftherman/asdebugger/issues) |

## Qué incluir

- La versión de AngelScript que usa tu aplicación (`ANGELSCRIPT_VERSION_STRING`) y si es una versión oficial.
- Tu sistema operativo y compilador.
- El adaptador usado: el de los add-ons estándar o tu propio `asIDBHostAdapter`.
- La configuración de `launch.json` y la traza del DAP si la tienes (VS Code: `"trace": true`).
- Un script de pocas líneas que reproduzca el problema.

## Versiones admitidas

El depurador admite AngelScript 2.36.0 y posteriores. La última versión, 2.39.0, es la de referencia. Las versiones anteriores ejecutan scripts, pero no se pueden depurar.
