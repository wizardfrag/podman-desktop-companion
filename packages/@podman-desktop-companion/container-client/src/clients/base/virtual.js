// node
const fs = require("fs");
const os = require("os");
// vendors
const merge = require("lodash.merge");
// project
// module
const { AbstractContainerClient } = require("../abstract");
const { findProgram, findProgramPath } = require("../../detector");
// locals

class VirtualContainerClient extends AbstractContainerClient {
  constructor(userConfiguration, id, engine, program, { controller, scope }) {
    super(userConfiguration, id, engine, program);
    // More settings
    this.controller = controller;
    this.scope = scope;
  }

  async getWrapper(settings) {
    throw new Error("Not implemented");
  }

  async isAllowedOperatingSystem() {
    throw new Error("Not implemented");
  }

  async checkAvailability() {
    const isMatchingOs = await this.isAllowedOperatingSystem();
    let reason;
    if (!isMatchingOs) {
      reason = `Not available on ${os.type()}`;
    }
    return {
      available: isMatchingOs,
      reason
    };
  }

  async getEngine() {
    const cli = this.controller;
    const controller = {
      detect: {
        name: cli,
        path: "",
        version: "",
        scope: this.scope
      },
      custom: {
        name: cli,
        path: this.userConfiguration.getKey(`${this.id}.${cli}.path`),
        scope: this.userConfiguration.getKey(`${this.id}.${cli}.scope`)
      }
    };
    // Restrict
    const isMatchingOs = await this.isAllowedOperatingSystem();
    if (isMatchingOs) {
      controller.detect = merge(controller.detect, {
        name: cli,
        path: await findProgramPath(cli),
        version: ""
      });
    } else {
      this.logger.debug("Skip controller path detection - non matching operating system");
    }
    // Combine settings
    const controllerSettings = merge({}, controller.detect, controller.custom);
    // All setup
    let detected = {
      path: undefined,
      version: undefined
    };
    const availability = await this.checkAvailability();
    if (availability.available) {
      const wrapper = await this.getWrapper({ controller: controllerSettings });
      const detection = await findProgram(this.program, { wrapper });
      detected.path = detection.path;
      detected.version = detection.version;
    }
    const engine = {
      id: this.id,
      engine: this.engine,
      program: this.program,
      availability,
      settings: {
        detect: {
          api: {
            baseURL: undefined,
            connectionString: undefined
          },
          program: {
            name: this.program,
            path: detected.path,
            version: detected.version
          },
          controller: controller.detect
        },
        custom: {
          api: {
            baseURL: this.userConfiguration.getKey(`${this.id}.api.baseURL`),
            connectionString: this.userConfiguration.getKey(`${this.id}.api.connectionString`)
          },
          program: {
            name: this.program,
            path: this.userConfiguration.getKey(`${this.id}.${this.program}.path`)
          },
          controller: controller.custom
        }
      }
    };
    // Inject api configuration (merges configuration)
    const settings = await this.getMergedSettings(engine);
    engine.settings.detect.api = await this.createApiConfiguration(settings);
    return engine;
  }

  // API connectivity and startup
  async isApiConfigured() {
    this.logger.debug("Checking API - check if configuration is set");
    const settings = await this.getCurrentSettings();
    return !!settings.api?.connectionString;
  }
  async isApiScopeAvailable() {
    throw new Error("Not implemented");
  }
  async isApiAvailable() {
    let flag = false;
    this.logger.debug("Checking API - check if connection string is an unix socket");
    const settings = await this.getCurrentSettings();
    if (os.type() !== "Windows_NT") {
      if (settings.api?.connectionString) {
        const unixSocketPath = settings.api.connectionString.replace("unix://", "");
        flag = fs.existsSync(unixSocketPath);
        this.logger.debug("Checking API - checked if unix socket exists at", { unixSocketPath, flag });
      }
    } else {
      // TODO: Test named pipe availability
      flag = true;
    }
    return flag;
  }
}

module.exports = {
  VirtualContainerClient
};