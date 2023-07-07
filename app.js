require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./db/connect.js");

//security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// middlewares
const authMiddleware = require("./middleware/authentication.js");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
const authRouter = require("./routes/auth.js");
const runsRouter = require("./routes/runs.js");
const docsRouter = require("./routes/docs.js");
const polarRouter = require("./routes/polar.js");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/runs", authMiddleware, runsRouter);
app.use("/api/v1/docs", docsRouter);
app.use("/api/v1/polar", polarRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
