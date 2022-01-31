const express = require("express");
const cors = require("cors");

require("module-alias/register");
require("./lib/colors");

const _ = require("lodash");
const infoConsoleLog = require("@utilities/infoConsoleLog");
const minimist = require("minimist");
const argv = minimist(process.argv.slice(2));

const fs = require("fs");
const path = require("path");
const reqPath = path.join(__dirname, "../");
require("dotenv").config({ path: reqPath + ".env" });

const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");

const morgan = require("morgan");
const logger = require("@logger");

const listEndpoints = require("express-list-endpoints");

const swaggerFile = require("./utilities/swaggerAutogen/outputs/live/swagger.json");

const config = require("@env")();

const app = express();
const port = config.port;

const connectDb = require("@lib/database");
if (argv.db) {
  connectDb(config.database);
} else {
  infoConsoleLog(`${"Connect to Database:"} ${"disabled".magenta.bold}`);
}

const api = require("./api");

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  morgan("dev", {
    skip: () => {
      config.logging !== undefined;
    },
  }),
);

// Routing
app.use("/api/", api.applyRoutes());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/list", (req, res) => {
  let list = listEndpoints(app);

  let result = _.transform(list, (element, value, key) => {
    element[key] = _.omit(value, "middleware");
  });

  res.status(200).json(result);
});

app.use("/diag", (req, res) => {
  const { port, environment, appName, args } = config;
  res.status(200).json({ appName, environment, port, args });
});

app.use("/", (req, res) => {
  res
    .status(200)
    .send(`${config.appName} running on ${config.environment} mode`);
});

app.listen(port, () => {
  logger.combined.info(
    `${config.appName} listening at http://localhost:${port}`,
  );
  logger.combined.info("ff");
  infoConsoleLog(
    `${config.appName} listening at http://localhost:${port}`,
  );
});
