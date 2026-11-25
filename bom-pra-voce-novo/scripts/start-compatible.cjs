"use strict";

// Create React App 5 still reads fs.F_OK and the deprecated webpack-dev-server
// setup hooks. Adapt those APIs at the project boundary so development remains
// warning-free on current Node versions without editing installed dependencies.
const fs = require("fs");
const path = require("path");
const chalk = require("react-dev-utils/chalk");

const requiredFilesPath = require.resolve("react-dev-utils/checkRequiredFiles");
require.cache[requiredFilesPath] = {
  id: requiredFilesPath,
  filename: requiredFilesPath,
  loaded: true,
  exports(files) {
    let currentFilePath;
    try {
      files.forEach(filePath => {
        currentFilePath = filePath;
        fs.accessSync(filePath, fs.constants.F_OK);
      });
      return true;
    } catch {
      console.log(chalk.red("Could not find a required file."));
      console.log(chalk.red("  Name: ") + chalk.cyan(path.basename(currentFilePath)));
      console.log(chalk.red("  Searched in: ") + chalk.cyan(path.dirname(currentFilePath)));
      return false;
    }
  },
};

const command = process.argv[2] || "start";

if (command === "start") {
  const devServerConfigPath = require.resolve("react-scripts/config/webpackDevServer.config");
  const createLegacyDevServerConfig = require(devServerConfigPath);

  require.cache[devServerConfigPath].exports = (proxy, allowedHost) => {
    const config = createLegacyDevServerConfig(proxy, allowedHost);
    const beforeSetup = config.onBeforeSetupMiddleware;
    const afterSetup = config.onAfterSetupMiddleware;

    delete config.onBeforeSetupMiddleware;
    delete config.onAfterSetupMiddleware;

    config.setupMiddlewares = (middlewares, devServer) => {
      beforeSetup?.(devServer);

      if (!afterSetup) return middlewares;

      const afterRouter = require("express").Router();
      const app = devServer.app;
      devServer.app = afterRouter;
      afterSetup(devServer);
      devServer.app = app;

      return [...middlewares, { name: "cra-after-setup", middleware: afterRouter }];
    };

    return config;
  };
}

require(`react-scripts/scripts/${command}`);
