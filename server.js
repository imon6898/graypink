// server.js
const express = require("express");
const next = require("next");

// const port = 30015 || 8000;
const port = 30007 || 8000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.static(__dirname + "/public/uploads"));

  server.all("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${port}`);
  });
});