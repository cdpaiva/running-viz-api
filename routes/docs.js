// This is just a first draft on how to use swagger! I just wanted to understand how it's done
// I won't type in all paths and schemas, because I want to save time to better understand the security packages we added

const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerConfig = require("../swagger.json");

const docsRouter = express.Router();

docsRouter.use("/", swaggerUI.serve);
docsRouter.get("/", swaggerUI.setup(swaggerConfig));

module.exports = docsRouter;
