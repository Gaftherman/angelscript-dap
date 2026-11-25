cmake_minimum_required(VERSION 3.21)
project(angelscript_dap VERSION 1.5.0 LANGUAGES CXX)

# Host-agnostic Debug Adapter Protocol core for AngelScript. Embed it with add_subdirectory() after the
# AngelScript target exists, or point ASDEBUGGER_ANGELSCRIPT_TARGET at a target that only supplies headers.
option(ASDEBUGGER_STD_ADAPTER "Build the vanilla AngelScript add-on adapter" OFF)
option(ASDEBUGGER_BUILD_TESTS "Build the core tests" OFF)
set(ASDEBUGGER_ANGELSCRIPT_TARGET "" CACHE STRING "AngelScript target supplied by the embedding project")
set(ASDEBUGGER_STD_ADDON_DIR "" CACHE PATH "AngelScript sdk/add_on directory for the standard adapter")
set(ASDEBUGGER_CORE_COMPILE_OPTIONS "" CACHE STRING "Extra private compile options supplied by the embedding project")

if(ASDEBUGGER_ANGELSCRIPT_TARGET)
    set(dap_angelscript "${ASDEBUGGER_ANGELSCRIPT_TARGET}")
elseif(TARGET angelscript)
    set(dap_angelscript angelscript)
else()
    message(FATAL_ERROR "Add an AngelScript target before angelscript-dap or set ASDEBUGGER_ANGELSCRIPT_TARGET.")
endif()
if(NOT TARGET "${dap_angelscript}")
    message(FATAL_ERROR "AngelScript target '${dap_angelscript}' does not exist.")
endif()

include(FetchContent)
FetchContent_Declare(
    cppdap
    GIT_REPOSITORY https://github.com/google/cppdap.git
    GIT_TAG main
    GIT_SUBMODULES "third_party/json"
    GIT_SHALLOW TRUE
)
set(CPPDAP_BUILD_TESTS OFF)
FetchContent_MakeAvailable(cppdap)
FetchContent_GetProperties(cppdap SOURCE_DIR cppdap_source)

find_package(Python3 COMPONENTS Interpreter REQUIRED)
execute_process(
    COMMAND "${Python3_EXECUTABLE}" "${CMAKE_CURRENT_SOURCE_DIR}/scripts/patch_cppdap.py" "${cppdap_source}"
    COMMAND_ERROR_IS_FATAL ANY
)
find_package(Threads REQUIRED)

function(asdebugger_add_core target angelscript_target)
    add_library(${target} STATIC
        src/as_debugger.cpp
        src/as_debugger_dap.cpp
        src/as_debugger_host.cpp
        src/as_helpers.cpp
    )
    set_target_properties(${target} PROPERTIES POSITION_INDEPENDENT_CODE ON)
    target_compile_features(${target} PUBLIC cxx_std_20)
    target_include_directories(${target} PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/src")
    target_link_libraries(${target} PUBLIC "${angelscript_target}" cppdap PRIVATE Threads::Threads)
    if(WIN32)
        target_link_libraries(${target} PRIVATE ws2_32)
    endif()
    if(ASDEBUGGER_CORE_COMPILE_OPTIONS)
        target_compile_options(${target} PRIVATE ${ASDEBUGGER_CORE_COMPILE_OPTIONS})
    endif()
endfunction()

# asdebugger_core is the real target, so embedders can still add options to it; angelscript_dap is its alias.
asdebugger_add_core(asdebugger_core "${dap_angelscript}")
add_library(angelscript_dap ALIAS asdebugger_core)

if(ASDEBUGGER_STD_ADAPTER)
    if(NOT EXISTS "${ASDEBUGGER_STD_ADDON_DIR}/scriptarray/scriptarray.h"
       OR NOT EXISTS "${ASDEBUGGER_STD_ADDON_DIR}/scriptdictionary/scriptdictionary.h")
        message(FATAL_ERROR "Set ASDEBUGGER_STD_ADDON_DIR to the vanilla AngelScript sdk/add_on directory.")
    endif()
    target_sources(asdebugger_core PRIVATE src/adapters/std_host_adapter.cpp)
    target_include_directories(asdebugger_core PRIVATE
        "${ASDEBUGGER_STD_ADDON_DIR}/scriptarray"
        "${ASDEBUGGER_STD_ADDON_DIR}/scriptdictionary"
    )
endif()

if(ASDEBUGGER_BUILD_TESTS)
    enable_testing()
    add_executable(host-adapter-test tests/host_adapter.cpp)
    target_link_libraries(host-adapter-test PRIVATE asdebugger_core)
    add_test(NAME host-adapter-test COMMAND host-adapter-test)
    add_test(NAME cppdap-patch-test
        COMMAND "${Python3_EXECUTABLE}" -m unittest discover -s scripts/tests -p "test_*.py"
        WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}")
endif()
