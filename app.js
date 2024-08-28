const express = require("express");
const app = express();
app.get("/api", (_, res) => {
  res.send("BLOG api");
});

module.exports = app;
