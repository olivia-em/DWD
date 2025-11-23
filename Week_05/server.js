let express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// create an HTTP server application which responds to
// any HTTP requests

let app = express();

// server to respond to GET requests with appropriate
// file from the 'public' directory

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
// Used ChatGPT to help with this part
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

// Path to store secrets data
const secretDataPath = path.join(__dirname, "secrets.json");

// Load secrets from file if it exists
let secrets = { current: null, previous: null };
try {
  if (fs.existsSync(secretDataPath)) {
    const data = fs.readFileSync(secretDataPath, "utf8");
    secrets = JSON.parse(data);
    console.log("Loaded existing secrets from file");
  }
} catch (err) {
  console.log("No existing secrets found or error loading:", err.message);
}

// get request handler

app.get("/search", mySearchRequestHandler);

function mySearchRequestHandler(req, res) {
  let question = req.query.q;

  console.log("Search request received: " + question);
  res.send(question + " ...stupid question");
}

app.post("/share", upload.single("photo"), myShareRequestHandler);

function myShareRequestHandler(req, res) {
  console.log(req.body);
  console.log(req.file);

  // Delete previous photo file if it exists
  if (secrets.previous && secrets.previous.photoPath) {
    const oldPath = path.join(__dirname, "public", secrets.previous.photoPath);
    fs.unlink(oldPath, (err) => {
      if (err) console.log("Error deleting old photo:", err);
      else console.log("Deleted old photo:", secrets.previous.photoPath);
    });
  }

  // Move current to previous (but only keep secret and preposition)
  secrets.previous = secrets.current
    ? { secret: secrets.current.secret, preposition: secrets.current.preposition, photoPath: secrets.current.photoPath }
    : null;

  let secret = req.body.secret;
  let preposition = req.body.preposition;
  let photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  // Set new current secret
  secrets.current = { preposition, secret, photoPath };

  // Save to file so it persists across server restarts
  fs.writeFileSync(secretDataPath, JSON.stringify(secrets, null, 2));

  console.log("Share request received");
  res.redirect("/secrets");
}

app.get("/secrets", mySecretsRequestHandler);
function mySecretsRequestHandler(req, res) {
  let secretsHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Secrets</title>
      <link rel="stylesheet" href="styles.css" />
    </head>
    <body>
      <div class="poem-container">
  `;

  if (secrets.current) {
    let prep = secrets.current.preposition;
    let backgroundStyle = secrets.current.photoPath
      ? `style="background-image: url('${secrets.current.photoPath}');"`
      : "";

    secretsHTML += `
        <div class="poem" ${backgroundStyle}>
          <div class="poem-text">
            <p>We've kept a secret <em>${prep}</em> each other</p>
            <p>You've kept a secret <em>${prep}</em> me<br/>
            You hold it, I know you do.<br/>
            We'll never speak again, not like we used to.</p>
            <p>I've kept a secret <em>${prep}</em> you.<br/>
            Nothing said out loud.<br/>
            I'll tell you now. Because,<br/>
            we'll never speak again, not like we used to.</p>
            <p class="secret-text">${secrets.current.secret}</p>
            <p>You can take it, this thing I've shared…<br/>
            that, the love, and the care.</p>
          </div>
          ${secrets.previous ? `
          <div class="poem-text poem-text-overlay">
            <p>We've kept a secret <em>${secrets.previous.preposition}</em> each other</p>
            <p>You've kept a secret <em>${secrets.previous.preposition}</em> me<br/>
            You hold it, I know you do.<br/>
            We'll never speak again, not like we used to.</p>
            <p>I've kept a secret <em>${secrets.previous.preposition}</em> you.<br/>
            Nothing said out loud.<br/>
            I'll tell you now. Because,<br/>
            we'll never speak again, not like we used to.</p>
            <p class="secret-text">${secrets.previous.secret}</p>
            <p>You can take it, this thing I've shared…<br/>
            that, the love, and the care.</p>
          </div>
          ` : ""}
        </div>
    `;
  } else {
    secretsHTML += `<p style="text-align: center;">No secrets yet. <a href="/">Share one?</a></p>`;
  }

  secretsHTML += `
      </div>
      <p style="text-align: center; margin-top: 40px;">
        <a href="/">← back to form</a>
      </p>
    </body>
    </html>
  `;

  res.send(secretsHTML);
}
// Fallback route for SPA: serve index.html for all non-API, non-static requests

// SPA fallback: serve index.html for non-API, non-static GET requests
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.path.startsWith("/api") &&
    !req.path.startsWith("/uploads") &&
    !req.path.startsWith("/share") &&
    !req.path.startsWith("/secrets")
  ) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    next();
  }
});

app.listen(8080);
