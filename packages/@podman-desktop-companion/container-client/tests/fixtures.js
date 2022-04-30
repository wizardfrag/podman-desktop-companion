// node
const path = require("path");

const NATIVE_DOCKER_CLI_PATH = "/usr/bin/docker";
const NATIVE_PODMAN_CLI_PATH = "/usr/bin/podman";

const WINDOWS_PODMAN_CLI_VERSION = "4.0.3-dev";
const WINDOWS_PODMAN_CLI_PATH = "C:\\Program Files\\RedHat\\Podman\\podman.exe";
const WINDOWS_DOCKER_CLI_PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe";

const PODMAN_CLI_VERSION = "4.0.3";
const DOCKER_CLI_VERSION = "20.10.14";

const PODMAN_MACHINE_DEFAULT = "podman-machine-default";

const PODMAN_API_BASE_URL = "http://d/v3.0.0/libpod";
const DOCKER_API_BASE_URL = "http://localhost";

const WINDOWS_PODMAN_NAMED_PIPE = "//./pipe/podman-machine-default";
const WINDOWS_DOCKER_NAMED_PIPE = "//./pipe/docker_engine";

// Native
const NATIVE_DOCKER_SOCKET_PATH = "/var/run/docker.sock";
const NATIVE_PODMAN_SOCKET_PATH = "/tmp/podman-desktop-companion-podman-rest-api.sock";

// WSL
const WSL_DISTRIBUTION = "ubuntu-20.04";
const WSL_PATH = "C:\\Windows\\System32\\wsl.exe";
const WSL_PODMAN_CLI_PATH = "/usr/bin/podman";
const WSL_PODMAN_CLI_VERSION = "3.4.2";
const WSL_PODMAN_NAMED_PIPE = "//./pipe/podman-desktop-companion-podman-ubuntu-20.04";
const WSL_DOCKER_NAMED_PIPE = "//./pipe/podman-desktop-companion-docker-ubuntu-20.04";

// LIMA
const LIMA_PATH = "/usr/local/bin/limactl";
const LIMA_DOCKER_CLI_PATH = "/usr/bin/docker";
const LIMA_DOCKER_CLI_VERSION = "";
const LIMA_PODMAN_CLI_PATH = "/usr/bin/podman";
const LIMA_PODMAN_CLI_VERSION = "3.2.1";
const LIMA_PODMAN_INSTANCE = "podman";
const LIMA_DOCKER_INSTANCE = "docker";
const LIMA_PODMAN_SOCKET_PATH = path.join(process.env.HOME, ".lima", LIMA_PODMAN_INSTANCE, "sock/podman.sock");
const LIMA_DOCKER_SOCKET_PATH = path.join(process.env.HOME, ".lima", LIMA_DOCKER_INSTANCE, "sock/docker.sock");
const LIMA_INSTANCES = [
  {
    Arch: "x86_64",
    CPUs: "4",
    Dir: path.join(process.env.HOME, ".lima", LIMA_DOCKER_INSTANCE),
    Disk: "100GiB",
    Memory: "4GiB",
    Name: LIMA_DOCKER_INSTANCE,
    // SSH: "127.0.0.1:50167",
    Status: "Running"
  },
  {
    Arch: "x86_64",
    CPUs: "4",
    Dir: path.join(process.env.HOME, ".lima", LIMA_PODMAN_INSTANCE),
    Disk: "100GiB",
    Memory: "4GiB",
    Name: LIMA_PODMAN_INSTANCE,
    // SSH: "127.0.0.1:50139",
    Status: "Running"
  }
];

module.exports = {
  PODMAN_MACHINE_DEFAULT,
  NATIVE_DOCKER_CLI_PATH,
  NATIVE_PODMAN_CLI_PATH,
  WINDOWS_PODMAN_CLI_VERSION,
  WINDOWS_PODMAN_CLI_PATH,
  WINDOWS_DOCKER_CLI_PATH,
  WINDOWS_PODMAN_NAMED_PIPE,
  WINDOWS_DOCKER_NAMED_PIPE,
  PODMAN_CLI_VERSION,
  DOCKER_CLI_VERSION,
  PODMAN_API_BASE_URL,
  DOCKER_API_BASE_URL,
  NATIVE_DOCKER_SOCKET_PATH,
  NATIVE_PODMAN_SOCKET_PATH,
  // WSL
  WSL_DISTRIBUTION,
  WSL_PATH,
  WSL_PODMAN_CLI_PATH,
  WSL_PODMAN_CLI_VERSION,
  WSL_PODMAN_NAMED_PIPE,
  WSL_DOCKER_NAMED_PIPE,
  // LIMA
  LIMA_PATH,
  LIMA_DOCKER_CLI_PATH,
  LIMA_DOCKER_CLI_VERSION,
  LIMA_PODMAN_CLI_PATH,
  LIMA_PODMAN_CLI_VERSION,
  LIMA_DOCKER_INSTANCE,
  LIMA_PODMAN_INSTANCE,
  LIMA_DOCKER_SOCKET_PATH,
  LIMA_PODMAN_SOCKET_PATH,
  LIMA_INSTANCES
};