// let http = require("http");

// let myServer = http.createServer(myRequestHandler);

// myServer.listen(8080);

// function myRequestHandler(req) {
//   // this function will log al requests
//   console.log(req);
// }

// server.js — static file server (CommonJS)
const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 8080;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".html": "text/html",
    ".htm": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".txt": "text/plain",
  };
  return map[ext] || "application/octet-stream";
}

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);

  // default to index.html for "/"
  let reqPath = req.url.split("?")[0];
  if (reqPath === "/") reqPath = "/index.html";

  // safe join within current dir
  const safePath = path.normalize(path.join(process.cwd(), reqPath));

  // prevent escaping web root
  if (!safePath.startsWith(process.cwd())) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(safePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": getMimeType(safePath) });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(
    `Server running at http://143.198.29.234/:${port}/ (serving ${process.cwd()})`
  );
});
