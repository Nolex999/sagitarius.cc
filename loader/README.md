# Sagitarius Loader

Small Windows C++ bootstrapper for Sagitarius.

What it does:
- Collects the user's email, password, and optional license key.
- Builds a stable HWID from local machine identifiers.
- Calls `/api/loader/auth`.
- Downloads the authorized binary returned by the API.
- Saves it under `%LOCALAPPDATA%\Sagitarius\Sagitarius.exe`.

What it intentionally does not do:
- No process injection.
- No stealth behavior.
- No anti-debugging or bypass logic.
- No credential persistence.

Build with CMake on Windows:

```powershell
cmake -S loader -B loader/build
cmake --build loader/build --config Release
```

Run:

```powershell
loader/build/Release/SagitariusLoader.exe
```

Optional custom API base:

```powershell
SagitariusLoader.exe --base-url https://sagitarius.cc
```
