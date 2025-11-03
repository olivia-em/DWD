let express = require("express");

// create an HTTP server application which responds to
// any HTTP requests

let app = express();

// server to respond to GET requests with appropriate
// file from the 'public' directory

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let secrets = [];

// get request handler

app.get("/search", mySearchRequestHandler);

function mySearchRequestHandler(req, res) {
  let question = req.query.q;

  console.log("Search request received: " + question);
  res.send(question + " ...stupid question");
}

app.post("/share", myShareRequestHandler);

function myShareRequestHandler(req, res) {
  //   let requestBody = "req.body";
  console.log(req.body);
  //   let json = JSON.parse
  let secret = req.body.secret;
  secrets.push(secret);
  console.log("Share request received");
  res.send("Thanks for sharing!");
}

app.get("/secrets", mySecretsRequestHandler);
function mySecretsRequestHandler(req, res) {
  let secretsHTML = "<h1>Secrets</h1><ul>";
  for (let secret of secrets) {
    secretsHTML += `<li>${secret}</li>`;
  }
  secretsHTML += "</ul>";
  res.send(secretsHTML);

  //   res.send(secrets);
}
app.listen(8080);
