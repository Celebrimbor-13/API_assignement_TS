const webpack = require("webpack");
const config = require("../webpack.config");
const express = require("express");
const path = require("path");
const middleware = require("webpack-dev-middleware");
const open = require("open");

const PORT = 3000;

const compiler = webpack(config);
const server = express();

// server.use(express.static("src"));
server.use(
  middleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

server.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../src/index.html"));
});

server.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  } else {
    open("http://localhost:" + PORT, { app: { name: "google-chrome" } });
  }
});
