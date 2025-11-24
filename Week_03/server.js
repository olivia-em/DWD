let express = require("express");

// create an HTTP server application which responds to
// any HTTP requests

let app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

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
  console.log(req.body);
  let secret = req.body.secret;
  secrets.push(secret);
  console.log("Share request received");
  res.redirect("/secrets");
}

app.get("/secrets", mySecretsRequestHandler);

function mySecretsRequestHandler(req, res) {
  let dataToRender = { secrets: secrets };
  res.render("secrets.ejs", dataToRender);
}

app.listen(8080);
