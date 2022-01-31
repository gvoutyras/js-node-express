const mongoose = require("mongoose");
const infoConsoleLog = require("@utilities/infoConsoleLog");

const logger = require("./logger");
const DbRetryConnTimeMS = process.env.DB_RETRY_CONN_MS || 10000;
const DbRetryConnMaxRetries = process.env.DB_MAX_RETRY || 0;
let connected = false;

let retryTimes = 0;

function connect(dbConfig) {
  const { uri: mongoURI, options } = dbConfig;
  const dbName = options.dbName;
  mongoose.connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        infoConsoleLog(`${"Database connection error:".red.bold} ${err}`);
        logger.combined.error(`Database connection error: ${err}`);

        infoConsoleLog(
          `${"Retrying connection in:"} ${DbRetryConnTimeMS / 1000} sec`,
        );

        if (
          DbRetryConnMaxRetries !== 0 &&
          retryTimes >= DbRetryConnMaxRetries
        ) {
          return;
        }

        retryTimes += 1;
        setTimeout(() => connect(mongoURI), DbRetryConnTimeMS);
      } else {
        infoConsoleLog(`${"Database connected".magenta.bold}`);
        logger.combined.info(`Database connected: ${dbName}`);
        connected = true;
      }
    },
  );
}

module.exports = connect;
