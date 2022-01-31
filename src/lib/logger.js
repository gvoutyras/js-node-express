const winston = require("winston");
const { combine, timestamp, label, printf } = require("winston").format;
const DailyRotate = require("winston-daily-rotate-file");
const fs = require("fs");
const minimist = require("minimist");
const infoConsoleLog = require("@utilities/infoConsoleLog");

const logDir = "../logs";

const argv = minimist(process.argv.slice(2));
const logging = argv["log"];

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const combined = winston.createLogger({
  transports: [
    new DailyRotate({
      filename: `${logDir}/combined.%DATE%.log`,
      timestamp: true,
      datePattern: "YYYY-MM-DD",
      prepend: true,
      json: false,
      level: "info",
      maxSize: "20m",
      zippedArchive: true,
      colorize: "true",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
  exitOnError: false,
});

const payments = winston.createLogger({
  transports: [
    new DailyRotate({
      filename: `${logDir}/payments/payments.%DATE%.log`,
      timestamp: true,
      datePattern: "YYYY-MM-DD",
      prepend: true,
      json: false,
      level: "info",
      maxSize: "20m",
      zippedArchive: true,
      colorize: "true",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
  exitOnError: false,
});

if (!logging) {
  combined.transports.forEach((t) => (t.silent = true));
  payments.transports.forEach((t) => (t.silent = true));
  infoConsoleLog(`Logging: ${"disabled".magenta.bold}`);
} else {
  infoConsoleLog(`Logging: ${"enabled".magenta.bold}`);
}

module.exports = {
  combined,
  payments,
};
