const minimist = require("minimist");
const infoConsoleLog = require("@utilities/infoConsoleLog");

const config = () => {
  const argv = minimist(process.argv.slice(2));
  const logging = argv["log"];

  let database;
  let port;
  let environment;
  const appName = process.env.APP_NAME;

  if (argv.dev) {
    /**
     * Development environment
     */
    database = "booking-engines-dev";
    environment = "development";
    port = process.env.DEV_PORT;
  } else if (argv.staging) {
    /**
     * Staging environment
     */
    database = "booking-engines-staging";
    environment = "staging";
    port = process.env.STAG_PORT;
  } else if (argv.prod) {
    /**
     * Production environment
     */
    database = "bookingengines";
    environment = "production";
    port = process.env.PROD_PORT;
  } else {
    throw new Error("No environment set");
  }

  if (argv.db) {
    infoConsoleLog(`Active DB: ${database.magenta.bold}`);
  }

  const config = {
    environment,
    port,
    appName,
    logging,
    database: {
      uri: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${database}?authSource=${process.env.DB_AUTH_SOURCE}`,
      options: {
        dbName: database,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
      },
    },
    args: [{ logging }],
  };

  return config;
};

module.exports = config;
