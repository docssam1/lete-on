"use strict";

const http = require("node:http");
const { createApp } = require("./app.js");

const port = Math.max(1, Number(process.env.PORT || 8080));
const server = http.createServer(createApp());
server.listen(port, "0.0.0.0", function () {
  process.stdout.write(`highschool-selection server listening on ${port}\n`);
});
