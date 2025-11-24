require("dotenv").config();
const express = require("express");
const cors = require("cors");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
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

// Placeholder endpoints
app.get("/api/pieces", (req, res) => {
  res.json([]); // Will return piece metadata later
});

app.post("/api/search", (req, res) => {
  res.json({ results: [] }); // Will return search results later
});

// In-memory secrets store
let secrets = [];

// GET secrets
app.get("/api/secrets", (req, res) => {
  res.json(secrets);
});

// POST secret, preposition, and image together
app.post("/api/secrets", upload.single("image"), (req, res) => {
  const { secret, preposition } = req.body;
  let imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  // Delete previous image if it exists
  const prev = secrets.length > 0 ? secrets[secrets.length - 1] : null;
  if (prev && prev.image) {
    const prevPath = require("path").join(__dirname, prev.image);
    require("fs").unlink(prevPath, (err) => {
      if (err) console.log("Error deleting previous image:", err);
      else console.log("Deleted previous image:", prev.image);
    });
  }

  // Replace previous secret with new one
  secrets = [
    {
      secret: secret?.trim() || "",
      preposition: preposition || "",
      image: imagePath,
    },
  ];
  res.status(201).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
