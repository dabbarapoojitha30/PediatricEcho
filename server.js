const express = require("express");
const db = require("./db");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

// Add / Update patient
app.post("/add", (req, res) => {
  console.log("ADD API HIT:", req.body);

  const { id, name, age, sex, dob, weight, diagnosis } = req.body;

  if (!id || !name || !age || !sex || !dob || !weight || !diagnosis) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const patientId = id.trim();
  const patientAge = parseInt(age);
  const patientWeight = parseFloat(weight);

  db.query(
    "SELECT * FROM patients WHERE TRIM(LOWER(id)) = LOWER(?)",
    [patientId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.length > 0) {
        // Update existing patient
        db.query(
          "UPDATE patients SET name=?, age=?, sex=?, dob=?, weight=?, diagnosis=? WHERE TRIM(LOWER(id)) = LOWER(?)",
          [name, patientAge, sex, dob, patientWeight, diagnosis, patientId],
          (err) => {
            if (err) return res.status(500).json({ message: "Update failed" });
            res.json({ message: "Patient updated successfully" });
          }
        );
      } else {
        // Insert new patient
        db.query(
          "INSERT INTO patients (id, name, age, sex, dob, weight, diagnosis) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [patientId, name, patientAge, sex, dob, patientWeight, diagnosis],
          (err) => {
            if (err) return res.status(500).json({ message: "Insert failed" });
            res.json({ message: "Patient added successfully" });
          }
        );
      }
    }
  );
});

// Search patient
app.post("/search", (req, res) => {
  const { id } = req.body;
  if (!id) return res.json({ status: "error", message: "No ID provided" });

  const searchId = id.trim();

  db.query(
    "SELECT * FROM patients WHERE TRIM(LOWER(id)) = LOWER(?)",
    [searchId],
    (err, result) => {
      if (err) return res.json({ status: "error", message: "Database error" });
      if (result.length === 0) return res.json({ status: "notfound" });

      res.json({ status: "found", patient: result[0] });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
