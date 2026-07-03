cmake_minimum_required(VERSION 3.20)

project(SagitariusLoader VERSION 0.1.0 LANGUAGES CXX)

add_executable(SagitariusLoader
  src/main.cpp
)

target_compile_features(SagitariusLoader PRIVATE cxx_std_17)
target_compile_definitions(SagitariusLoader PRIVATE UNICODE _UNICODE WIN32_LEAN_AND_MEAN)
target_link_libraries(SagitariusLoader PRIVATE winhttp advapi32)

if (MSVC)
  target_compile_options(SagitariusLoader PRIVATE /W4 /permissive- /O2)
endif()
