# AngelScript DAP

**[English](../README.md)** | **[Español](README.es.md)**

Un servidor del Debug Adapter Protocol (DAP) para AngelScript, independiente de la aplicación. Insértalo en una aplicación C++, conecta VS Code y depura scripts con puntos de interrupción, ejecución paso a paso, pila de llamadas y variables.

<p align="center"><img src="images/debugger-cli.gif" alt="VS Code conectado a un script que se ejecuta en el Símbolo del sistema" width="720"></p>

## Funciones

- Puntos de interrupción, paso por encima, paso al interior, paso al exterior, continuar y pausar.
- Pila de llamadas, variables locales, parámetros y globales, con objetos, arreglos, diccionarios y cadenas expandidos.
- Un servidor DAP por TCP (puerto `9002` por defecto) para `attach` y `launch` de VS Code.
- Una interfaz pequeña para la aplicación (`asIDBHostAdapter`) y un adaptador listo para los add-ons `string`, `array` y `dictionary`.
- AngelScript **2.36.0 y posteriores**.

## Cómo usarlo

~~~cmake
add_subdirectory("${ANGELSCRIPT_SDK}/angelscript/projects/cmake" angelscript)
set(ASDEBUGGER_STD_ADAPTER ON)
set(ASDEBUGGER_STD_ADDON_DIR "${ANGELSCRIPT_SDK}/add_on")
add_subdirectory(external/angelscript-dap)

add_executable(my_host main.cpp)
target_link_libraries(my_host PRIVATE angelscript_dap)
~~~

Las opciones y los requisitos están en [USAGE.es.md](USAGE.es.md). Para una aplicación lista para usar, ejecuta `angelscript --dap-port 9002 script.as` con la [CLI de AngelScript](https://github.com/Gaftherman/angelscript-cli).

## Compilar desde el código fuente

El núcleo enlaza con un destino de AngelScript que aporta el proyecto padre, así que se compila y prueba mediante el [proyecto de ejemplo](https://github.com/Gaftherman/angelscript-debugger-example). Consulta [CONTRIBUTING.es.md](CONTRIBUTING.es.md).

## Documentación

- [Uso](USAGE.es.md) — opciones de CMake y requisitos.
- [Soporte](SUPPORT.es.md) — dónde preguntar y qué incluir.
- [Grabar las demostraciones](DEMOS.md) — cómo se genera `debugger-cli.gif`.
- [CHANGELOG.md](../CHANGELOG.md) — historial de versiones.

## Hoja de ruta

- Soporte del depurador con el [JIT](https://github.com/Gaftherman/angelscript-jit) activo.
- Más adaptadores de aplicación listos para usar.

## Soporte

Abre una [incidencia](https://github.com/Gaftherman/angelscript-dap/issues) para el núcleo del depurador. [SUPPORT.es.md](SUPPORT.es.md) indica qué incluir y a qué proyecto va cada tipo de problema.

## Relacionados

| Proyecto | Uso |
| --- | --- |
| [angelscript-cli](https://github.com/Gaftherman/angelscript-cli) | Ejecuta, comprueba y depura scripts desde la terminal |
| [angelscript-lsp](https://github.com/Gaftherman/angelscript-lsp) | Soporte del editor para VS Code |
| [angelscript-debugger-example](https://github.com/Gaftherman/angelscript-debugger-example) | Una aplicación que muestra cómo usar el depurador |
| [angelscript-jit](https://github.com/Gaftherman/angelscript-jit) | Compilador JIT opcional |
| [angelscript-engine](https://github.com/Gaftherman/angelscript-engine) | Soporte de versiones antiguas de AngelScript |
| [asdebugger](https://github.com/Gaftherman/asdebugger) | El complemento de Sven Co-op construido sobre este núcleo |

## Créditos

Los avisos de terceros están en [THIRD_PARTY.md](THIRD_PARTY.md).

| Proyecto | Licencia | Uso |
| --- | --- | --- |
| [AngelScript](https://github.com/anjo76/angelscript) by Andreas Jönsson | zlib | El lenguaje y su motor de ejecución |
| [cppdap](https://github.com/google/cppdap) | Apache-2.0 | Biblioteca del Debug Adapter Protocol |
| [nlohmann/json](https://github.com/nlohmann/json) | MIT | JSON, a través de cppdap |

## Licencia

Este repositorio está bajo la [licencia MIT](../LICENSE).
