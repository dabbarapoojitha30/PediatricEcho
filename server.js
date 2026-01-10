const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");   // ✅ DB connection

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// ✅ Test backend
app.get("/api/test", (req, res) => {
  res.json({ status: "Backend working" });
});

// ✅ Test database connection
app.get("/api/db-test", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database NOT connected" });
    }
    res.json({ message: "✅ Database connected successfully" });
  });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
