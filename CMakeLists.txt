cmake_minimum_required(VERSION 3.12)
project(whisper_js)

set(CMAKE_CXX_STANDARD 11)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/whisper.cpp/cmake/")

# Set the path to the whisper.cpp folder
set(WHISPER_CPP_DIR ${CMAKE_CURRENT_SOURCE_DIR}/whisper.cpp)

# Include directories for whisper.cpp
include_directories(
        ${CMAKE_JS_INC}
        ${WHISPER_CPP_DIR}
        ${WHISPER_CPP_DIR}/examples
)

# on APPLE
if (APPLE)
    # include Accelerate framework
    if (NOT WHISPER_NO_ACCELERATE)
        find_library(ACCELERATE_FRAMEWORK Accelerate)

        if (ACCELERATE_FRAMEWORK)
            message(STATUS "Accelerate framework found")

            set(WHISPER_EXTRA_LIBS  ${WHISPER_EXTRA_LIBS}  ${ACCELERATE_FRAMEWORK})
            set(WHISPER_EXTRA_FLAGS ${WHISPER_EXTRA_FLAGS} -DGGML_USE_ACCELERATE)
        else()
            message(WARNING "Accelerate framework not found")
        endif()
    endif()

    if (WHISPER_COREML)
        find_library(FOUNDATION_FRAMEWORK Foundation)
        find_library(COREML_FRAMEWORK CoreML)

        if (COREML_FRAMEWORK)
            message(STATUS "CoreML framework found")

            set(WHISPER_EXTRA_FLAGS ${WHISPER_EXTRA_FLAGS} -DWHISPER_USE_COREML)
        else()
            message(WARNING "CoreML framework not found")
        endif()

        if (WHISPER_COREML_ALLOW_FALLBACK)
            set(WHISPER_EXTRA_FLAGS ${WHISPER_EXTRA_FLAGS} -DWHISPER_COREML_ALLOW_FALLBACK)
        endif()
    endif()
endif()

if (WHISPER_OPENBLAS)
    set(WHISPER_BLAS_VENDOR "OpenBLAS")
    set(WHISPER_BLAS ON)
endif()

if (WHISPER_BLAS)
    set(BLA_STATIC 1)
    set(BLA_VENDOR ${WHISPER_BLAS_VENDOR})
    #    set(BLA_PREFER_PKGCONFIG 1)
    set(BLA_SIZEOF_INTEGER 8)
    find_package(BLAS)

    if(BLAS_FOUND)
        message(STATUS "BLAS compatible library found")
        message(STATUS "Libraries ${BLAS_LIBRARIES}")
        set(WHISPER_EXTRA_FLAGS ${WHISPER_EXTRA_FLAGS} -DGGML_USE_OPENBLAS)

        include_directories(${BLAS_INCLUDE_DIRS})
        set(WHISPER_EXTRA_LIBS ${WHISPER_EXTRA_LIBS} ${BLAS_LIBRARIES})
    else()
        message(WARNING "BLAS library was not found")
    endif()
endif ()

if (WHISPER_CUBLAS)
    cmake_minimum_required(VERSION 3.17)

    find_package(CUDAToolkit)

    if (CUDAToolkit_FOUND)
        message(STATUS "cuBLAS found")

        enable_language(CUDA)

        set(GGML_CUDA_SOURCES ggml-cuda.cu ggml-cuda.h)

        add_compile_definitions(GGML_USE_CUBLAS)

        if (WHISPER_STATIC)
            set(WHISPER_EXTRA_LIBS ${WHISPER_EXTRA_LIBS} CUDA::cudart_static CUDA::cublas_static CUDA::cublasLt_static)
        else()
            set(WHISPER_EXTRA_LIBS ${WHISPER_EXTRA_LIBS} CUDA::cudart CUDA::cublas CUDA::cublasLt)
        endif()

    else()
        message(WARNING "cuBLAS not found")
    endif()
endif()

if (WHISPER_CLBLAST)
    find_package(CLBlast)
    if (CLBlast_FOUND)
        message(STATUS "CLBlast found")

        set(GGML_OPENCL_SOURCES ggml-opencl.c ggml-opencl.h)

        add_compile_definitions(GGML_USE_CLBLAST)

        set(WHISPER_EXTRA_LIBS ${WHISPER_EXTRA_LIBS} clblast)
    else()
        message(WARNING "CLBlast not found")
    endif()
endif()

# compiler flags

if (NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
    set(CMAKE_BUILD_TYPE Release CACHE STRING "Build type" FORCE)
    set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS "Debug" "Release" "RelWithDebInfo")
endif ()

set(TARGET whisper)

add_library(${TARGET}
        ${WHISPER_CPP_DIR}/ggml.h
        ${WHISPER_CPP_DIR}/ggml.c
        ${GGML_CUDA_SOURCES}
        ${GGML_OPENCL_SOURCES}
        ${WHISPER_CPP_DIR}/whisper.h
        ${WHISPER_CPP_DIR}/whisper.cpp
        )

target_include_directories(${TARGET} PUBLIC
        .
        )


target_compile_definitions(${TARGET} PUBLIC
        ${WHISPER_EXTRA_FLAGS}
        )

set_target_properties(${TARGET} PROPERTIES PUBLIC_HEADER "whisper.h")

install(TARGETS ${TARGET}
        LIBRARY DESTINATION lib
        ARCHIVE DESTINATION lib/static
        RUNTIME DESTINATION bin
        PUBLIC_HEADER DESTINATION include
        )

#
# bindings
#

set(TARGET common)

add_library(${TARGET} STATIC
        ${WHISPER_CPP_DIR}/examples/common.h
        ${WHISPER_CPP_DIR}/examples/common.cpp
        ${WHISPER_CPP_DIR}/examples/common-ggml.h
        ${WHISPER_CPP_DIR}/examples/common-ggml.cpp
        )

include(DefaultTargetOptions)

target_link_libraries(${TARGET} PRIVATE whisper)

set_target_properties(${TARGET} PROPERTIES POSITION_INDEPENDENT_CODE ON)

set(TARGET whisper-addon)

# Base settings
#==================================================================
# env var supported by cmake-js
add_definitions(-DNAPI_VERSION=4)
include_directories(${CMAKE_JS_INC})
#==================================================================


add_library(${TARGET} SHARED ${CMAKE_JS_SRC} native.cpp)
set_target_properties(${TARGET} PROPERTIES PREFIX "" SUFFIX ".node")

include(DefaultTargetOptions)

# Include N-API wrappers
#==================================================================
execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${TARGET} PRIVATE ${NODE_ADDON_API_DIR})
#==================================================================
message(STATUS "Library ${CMAKE_JS_LIB}")
target_link_libraries(${TARGET} ${CMAKE_JS_LIB} common whisper ${CMAKE_THREAD_LIBS_INIT})
#
#if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
#    # Generate node.lib
#    execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
#endif()
