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

let currentSecret = null;

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

  // Delete old photo file if it exists
  if (currentSecret && currentSecret.photoPath) {
    const oldPath = path.join(__dirname, "public", currentSecret.photoPath);
    fs.unlink(oldPath, (err) => {
      if (err) console.log("Error deleting old photo:", err);
      else console.log("Deleted old photo:", currentSecret.photoPath);
    });
  }

  let secret = req.body.secret;
  let preposition = req.body.preposition;
  let photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  // Replace the current secret with the new one
  currentSecret = { preposition, secret, photoPath };

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
      <style>
        .poem-container {
          margin: 40px auto;
          max-width: 600px;
        }
        .poem {
          line-height: 0.5;
          margin-bottom: 60px;
          border: 1px solid rgba(0,0,0,0.1);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 400px;
          position: relative;
        }
        .poem-text {
          white-space: pre-line;
          position: absolute;
          mix-blend-mode: hard-light;
        }
        .poem-text p {
          padding: 8px 12px;
          display: inline-block;
          margin: 8px 0;
          line-height: 0.5;
          background-color: black;
          color: white;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        }
        .poem em {
          font-style: italic;
        }
        .poem .secret-text {
          font-style: italic;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="poem-container">
  `;

  if (currentSecret) {
    let prep = currentSecret.preposition;
    let backgroundStyle = currentSecret.photoPath
      ? `style="background-image: url('${currentSecret.photoPath}');"`
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

            <p class="secret-text">${currentSecret.secret}</p>

            <p>You can take it, this thing I've shared…<br/>
            that, the love, and the care.</p>
          </div>
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
app.listen(8080);
