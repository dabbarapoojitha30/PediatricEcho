const express=require("express");
const db=require("./db");
const app=express();
app.use(express.json());
app.use(express.static("public"));
app.post("/add", (req, res) => {
  const { id, name, age, sex, dob, weight, diagnosis } = req.body;

  if (!id || !name || !age || !sex || !dob || !weight || !diagnosis) {
    return res.json({ message: "Please fill all fields" });
  }
  let patientDob = dob.split("T")[0]; 


  db.query(
    "SELECT * FROM patients WHERE id = ?",
    [id],
    (err, result) => {

      if (err) {
        return res.json({ message: "Database error" });
      }

      if (result.length > 0) {
        db.query(
          `UPDATE patients 
           SET name=?, age=?, sex=?, dob=?, weight=?, diagnosis=?
           WHERE id=?`,
          [name, age, sex, dob, weight, diagnosis, id],
          (err) => {
            if (err) {
              return res.json({ message: "Update failed" });
            }
            res.json({ message: "Patient updated successfully ✅" });
          }
        );
      }
      else {
        db.query(
          `INSERT INTO patients (id, name, age, sex, dob, weight, diagnosis)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, name, age, sex, dob, weight, diagnosis],
          (err) => {
            if (err) {
              return res.json({ message: "Insert failed" });
            }
            res.json({ message: "Patient added successfully " });
          }
        );
      }
    }
  );
});
app.post("/search", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.json({ status: "error", message: "No ID provided" });
  }

  db.query(
    "SELECT * FROM patients WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.json({ status: "error", message: "Database error" });

      if (result.length === 0) {
        return res.json({ status: "notfound" });
      }

      res.json({
        status: "found",
        patient: result[0]
      });
    }
  );
});

app.listen(3000, () => { console.log("Server running on http://localhost:3000 "); });