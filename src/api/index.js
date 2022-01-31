const express = require("express");
const router = express.Router();

let v1 = require("./v1");

function applyRoutes() {
  router.use((req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (apiKey === undefined) {
      res.status(401).json({});
    } else {
      next();
    }
  });
  router.use((req, res, next) => {
    let method = req.method;
    let url = req.url;
    console.log(`${"[Start]".magenta} ${method.yellow} /api${url}`);
    return next();
  });
  router.use("/v1", v1.applyRoutes());

  return router;
}

module.exports = { applyRoutes };
