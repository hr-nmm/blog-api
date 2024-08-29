// imports
const config = require("./utils/config");
const express = require("express");
const app = express();
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");

// connect to DB
mongoose.set("strictQuery", false);
logger.info("connecting to ", config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI).then((result) => {
  logger.info("connected to MongoDB");
});

// use middlewares
app.use(express.json());
app.use("/api/blogs", blogsRouter);
module.exports = app;
