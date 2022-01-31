const express = require("express");
const router = express.Router();

const testEndpoint = require("./testEndpoint");

function applyRoutes() {
  router.get("/testEndpoint", testEndpoint);

  return router;
}

module.exports = { applyRoutes };
