const express = require("express");
const router = express.Router();

const testEndpoint = require("./testRoute");

function applyRoutes() {
  return router
    .use("/testEndpoint", testEndpoint.applyRoutes());
}

module.exports = { applyRoutes };
