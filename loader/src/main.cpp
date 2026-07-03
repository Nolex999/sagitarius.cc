#include <windows.h>
#include <winhttp.h>

#include <algorithm>
#include <cstdint>
#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <optional>
#include <sstream>
#include <string>
#include <vector>

namespace {

struct HttpResponse {
  DWORD status = 0;
  std::string body;
  std::vector<unsigned char> bytes;
};

struct ParsedUrl {
  std::wstring host;
  std::wstring path;
  INTERNET_PORT port = INTERNET_DEFAULT_HTTPS_PORT;
  bool secure = true;
};

std::wstring widen(const std::string& input) {
  if (input.empty()) return L"";
  const int size = MultiByteToWideChar(CP_UTF8, 0, input.data(), static_cast<int>(input.size()), nullptr, 0);
  std::wstring output(size, L'\0');
  MultiByteToWideChar(CP_UTF8, 0, input.data(), static_cast<int>(input.size()), output.data(), size);
  return output;
}

std::string narrow(const std::wstring& input) {
  if (input.empty()) return "";
  const int size = WideCharToMultiByte(CP_UTF8, 0, input.data(), static_cast<int>(input.size()), nullptr, 0, nullptr, nullptr);
  std::string output(size, '\0');
  WideCharToMultiByte(CP_UTF8, 0, input.data(), static_cast<int>(input.size()), output.data(), size, nullptr, nullptr);
  return output;
}

std::string json_escape(const std::string& input) {
  std::string out;
  out.reserve(input.size() + 8);
  for (char ch : input) {
    switch (ch) {
      case '\\': out += "\\\\"; break;
      case '"': out += "\\\""; break;
      case '\n': out += "\\n"; break;
      case '\r': out += "\\r"; break;
      case '\t': out += "\\t"; break;
      default: out += ch; break;
    }
  }
  return out;
}

std::optional<std::string> json_string(const std::string& json, const std::string& key) {
  const std::string needle = "\"" + key + "\"";
  size_t pos = json.find(needle);
  if (pos == std::string::npos) return std::nullopt;
  pos = json.find(':', pos + needle.size());
  if (pos == std::string::npos) return std::nullopt;
  pos = json.find('"', pos + 1);
  if (pos == std::string::npos) return std::nullopt;

  std::string out;
  bool escape = false;
  for (size_t i = pos + 1; i < json.size(); ++i) {
    const char ch = json[i];
    if (escape) {
      switch (ch) {
        case 'n': out += '\n'; break;
        case 'r': out += '\r'; break;
        case 't': out += '\t'; break;
        default: out += ch; break;
      }
      escape = false;
      continue;
    }
    if (ch == '\\') {
      escape = true;
      continue;
    }
    if (ch == '"') return out;
    out += ch;
  }

  return std::nullopt;
}

bool json_bool(const std::string& json, const std::string& key) {
  const std::string needle = "\"" + key + "\"";
  size_t pos = json.find(needle);
  if (pos == std::string::npos) return false;
  pos = json.find(':', pos + needle.size());
  if (pos == std::string::npos) return false;
  const size_t value = json.find_first_not_of(" \t\r\n", pos + 1);
  return value != std::string::npos && json.compare(value, 4, "true") == 0;
}

ParsedUrl parse_url(const std::string& url) {
  const std::wstring wide = widen(url);
  URL_COMPONENTS parts{};
  parts.dwStructSize = sizeof(parts);

  wchar_t host[256]{};
  wchar_t path[4096]{};
  parts.lpszHostName = host;
  parts.dwHostNameLength = static_cast<DWORD>(std::size(host));
  parts.lpszUrlPath = path;
  parts.dwUrlPathLength = static_cast<DWORD>(std::size(path));
  parts.dwSchemeLength = static_cast<DWORD>(-1);
  parts.dwExtraInfoLength = static_cast<DWORD>(-1);

  if (!WinHttpCrackUrl(wide.c_str(), static_cast<DWORD>(wide.size()), 0, &parts)) {
    throw std::runtime_error("Invalid URL.");
  }

  ParsedUrl parsed;
  parsed.host.assign(parts.lpszHostName, parts.dwHostNameLength);
  parsed.path.assign(parts.lpszUrlPath, parts.dwUrlPathLength);
  if (parts.lpszExtraInfo && parts.dwExtraInfoLength > 0) {
    parsed.path.append(parts.lpszExtraInfo, parts.dwExtraInfoLength);
  }
  if (parsed.path.empty()) parsed.path = L"/";
  parsed.port = parts.nPort;
  parsed.secure = parts.nScheme == INTERNET_SCHEME_HTTPS;
  return parsed;
}

HttpResponse request(const std::string& method, const std::string& url, const std::string& body = "") {
  const ParsedUrl parsed = parse_url(url);

  HINTERNET session = WinHttpOpen(
      L"SagitariusLoader/0.1",
      WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
      WINHTTP_NO_PROXY_NAME,
      WINHTTP_NO_PROXY_BYPASS,
      0);
  if (!session) throw std::runtime_error("WinHttpOpen failed.");

  HINTERNET connect = WinHttpConnect(session, parsed.host.c_str(), parsed.port, 0);
  if (!connect) {
    WinHttpCloseHandle(session);
    throw std::runtime_error("WinHttpConnect failed.");
  }

  const std::wstring method_w = widen(method);
  HINTERNET req = WinHttpOpenRequest(
      connect,
      method_w.c_str(),
      parsed.path.c_str(),
      nullptr,
      WINHTTP_NO_REFERER,
      WINHTTP_DEFAULT_ACCEPT_TYPES,
      parsed.secure ? WINHTTP_FLAG_SECURE : 0);
  if (!req) {
    WinHttpCloseHandle(connect);
    WinHttpCloseHandle(session);
    throw std::runtime_error("WinHttpOpenRequest failed.");
  }

  DWORD timeout_ms = 15000;
  WinHttpSetOption(req, WINHTTP_OPTION_CONNECT_TIMEOUT, &timeout_ms, sizeof(timeout_ms));
  WinHttpSetOption(req, WINHTTP_OPTION_SEND_TIMEOUT, &timeout_ms, sizeof(timeout_ms));
  WinHttpSetOption(req, WINHTTP_OPTION_RECEIVE_TIMEOUT, &timeout_ms, sizeof(timeout_ms));

  std::wstring headers = L"Accept: application/json\r\n";
  if (!body.empty()) {
    headers += L"Content-Type: application/json\r\n";
  }

  const BOOL sent = WinHttpSendRequest(
      req,
      headers.c_str(),
      static_cast<DWORD>(headers.size()),
      body.empty() ? WINHTTP_NO_REQUEST_DATA : const_cast<char*>(body.data()),
      static_cast<DWORD>(body.size()),
      static_cast<DWORD>(body.size()),
      0);

  if (!sent || !WinHttpReceiveResponse(req, nullptr)) {
    WinHttpCloseHandle(req);
    WinHttpCloseHandle(connect);
    WinHttpCloseHandle(session);
    throw std::runtime_error("HTTP request failed.");
  }

  HttpResponse response;
  DWORD status_size = sizeof(response.status);
  WinHttpQueryHeaders(
      req,
      WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER,
      WINHTTP_HEADER_NAME_BY_INDEX,
      &response.status,
      &status_size,
      WINHTTP_NO_HEADER_INDEX);

  for (;;) {
    DWORD available = 0;
    if (!WinHttpQueryDataAvailable(req, &available) || available == 0) break;

    const size_t offset = response.bytes.size();
    response.bytes.resize(offset + available);
    DWORD read = 0;
    if (!WinHttpReadData(req, response.bytes.data() + offset, available, &read)) break;
    response.bytes.resize(offset + read);
  }

  response.body.assign(response.bytes.begin(), response.bytes.end());

  WinHttpCloseHandle(req);
  WinHttpCloseHandle(connect);
  WinHttpCloseHandle(session);
  return response;
}

std::string read_registry_string(HKEY root, const wchar_t* path, const wchar_t* name) {
  wchar_t buffer[256]{};
  DWORD size = sizeof(buffer);
  DWORD type = 0;
  const LONG ok = RegGetValueW(root, path, name, RRF_RT_REG_SZ, &type, buffer, &size);
  if (ok != ERROR_SUCCESS) return "";
  return narrow(buffer);
}

std::string computer_name() {
  wchar_t buffer[MAX_COMPUTERNAME_LENGTH + 1]{};
  DWORD size = static_cast<DWORD>(std::size(buffer));
  if (!GetComputerNameW(buffer, &size)) return "";
  return narrow(std::wstring(buffer, size));
}

std::string fnv1a_hex(const std::string& input) {
  uint64_t hash = 14695981039346656037ull;
  for (unsigned char ch : input) {
    hash ^= ch;
    hash *= 1099511628211ull;
  }
  std::ostringstream out;
  out << std::hex << hash;
  return out.str();
}

std::string hwid() {
  const std::string machine_guid = read_registry_string(
      HKEY_LOCAL_MACHINE,
      L"SOFTWARE\\Microsoft\\Cryptography",
      L"MachineGuid");
  return fnv1a_hex(machine_guid + "|" + computer_name());
}

std::filesystem::path local_output_path() {
  wchar_t* local_app_data = nullptr;
  size_t len = 0;
  _wdupenv_s(&local_app_data, &len, L"LOCALAPPDATA");
  std::filesystem::path base = local_app_data ? local_app_data : L".";
  if (local_app_data) free(local_app_data);
  base /= L"Sagitarius";
  std::filesystem::create_directories(base);
  return base / L"Sagitarius.exe";
}

bool save_binary(const std::filesystem::path& path, const std::vector<unsigned char>& bytes) {
  std::ofstream file(path, std::ios::binary);
  if (!file) return false;
  file.write(reinterpret_cast<const char*>(bytes.data()), static_cast<std::streamsize>(bytes.size()));
  return file.good();
}

std::string trim_slash(std::string url) {
  while (!url.empty() && url.back() == '/') url.pop_back();
  return url;
}

std::string arg_value(int argc, char** argv, const std::string& name, const std::string& fallback) {
  for (int i = 1; i + 1 < argc; ++i) {
    if (argv[i] == name) return argv[i + 1];
  }
  return fallback;
}

}  // namespace

int main(int argc, char** argv) {
  try {
    const std::string base_url = trim_slash(arg_value(argc, argv, "--base-url", "https://sagitarius.cc"));

    std::cout << "Sagitarius Loader\n";
    std::cout << "API: " << base_url << "\n\n";

    std::string email;
    std::string password;
    std::string key;

    std::cout << "Email: ";
    std::getline(std::cin, email);

    std::cout << "Password: ";
    std::getline(std::cin, password);

    std::cout << "License key (optional): ";
    std::getline(std::cin, key);

    const std::string device_id = hwid();
    const std::string payload =
        "{\"email\":\"" + json_escape(email) +
        "\",\"password\":\"" + json_escape(password) +
        "\",\"hwid\":\"" + json_escape(device_id) +
        "\",\"key\":\"" + json_escape(key) + "\"}";

    std::cout << "\nAuthenticating...\n";
    const HttpResponse auth = request("POST", base_url + "/api/loader/auth", payload);
    const std::string message = json_string(auth.body, "message").value_or("No server message.");

    if (auth.status < 200 || auth.status >= 300 || !json_bool(auth.body, "success")) {
      std::cerr << "Authentication failed: " << message << "\n";
      return 1;
    }

    const auto loader_url = json_string(auth.body, "loader_url");
    if (!loader_url || loader_url->empty()) {
      std::cerr << "Authentication succeeded, but no loader_url was returned.\n";
      return 1;
    }

    std::cout << message << "\n";
    if (const auto expiry = json_string(auth.body, "expiry")) {
      std::cout << "Access: " << *expiry << "\n";
    }

    std::cout << "Downloading authorized package...\n";
    const HttpResponse download = request("GET", *loader_url);
    if (download.status < 200 || download.status >= 300 || download.bytes.empty()) {
      std::cerr << "Download failed. HTTP " << download.status << "\n";
      return 1;
    }

    const std::filesystem::path output = local_output_path();
    if (!save_binary(output, download.bytes)) {
      std::cerr << "Could not save package to disk.\n";
      return 1;
    }

    std::wcout << L"Saved: " << output.wstring() << L"\n";
    std::cout << "Done.\n";
    return 0;
  } catch (const std::exception& ex) {
    std::cerr << "Fatal error: " << ex.what() << "\n";
    return 1;
  }
}
