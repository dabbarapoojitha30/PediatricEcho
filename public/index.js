document.addEventListener("DOMContentLoaded", function () {
  const ageSelect = document.getElementById("age");

  for (let i = 1; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    ageSelect.appendChild(option);
  }

  document.getElementById("addForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      id: document.getElementById("patientId").value.trim(),
      name: document.getElementById("patientName").value.trim(),
      age: parseInt(document.getElementById("age").value),
      sex: document.querySelector('select[name="sex"]').value,
      dob: document.querySelector('input[name="dob"]').value,
      weight: parseFloat(document.querySelector('input[name="weight"]').value),
      diagnosis: document.querySelector('textarea[name="diagnosis"]').value.trim(),
    };

    if (!data.id) return alert("Patient ID required");
    if (!data.name) return alert("Patient name required");
    if (!data.age) return alert("Please select age");
    if (!data.sex) return alert("Please select sex");
    if (!data.dob) return alert("Please select DOB");
    if (!data.weight) return alert("Please enter weight");
    if (!data.diagnosis) return alert("Please enter diagnosis");

    fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        this.reset();
        document.getElementById("age").value = "";
      })
      .catch((err) => {
        console.error("Save error:", err);
        alert("Error saving patient");
      });
  });

  document.getElementById("searchform").addEventListener("submit", function (e) {
    e.preventDefault();
    const id = this.elements["id"].value.trim();
    const result = document.getElementById("searchResult");

    if (!id) return alert("Please enter Patient ID");

    fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "found") {
          const p = data.patient;
          const dob = p.dob ? new Date(p.dob).toISOString().split("T")[0] : "";
          result.innerHTML = `
            <p><b>ID:</b> ${p.id}</p>
            <p><b>Name:</b> ${p.name}</p>
            <p><b>Age:</b> ${p.age}</p>
            <p><b>Sex:</b> ${p.sex}</p>
            <p><b>DOB:</b> ${dob}</p>
            <p><b>Weight:</b> ${p.weight} kg</p>
            <p><b>Diagnosis:</b> ${p.diagnosis}</p>
          `;
        } else if (data.status === "notfound") {
          result.innerHTML = "<p style='color:red'>Patient not found</p>";
        } else {
          result.innerHTML = "<p style='color:red'>Error searching patient</p>";
        }
      })
      .catch((err) => {
        console.error("Search error:", err);
        result.innerHTML = "<p style='color:red'>Error searching patient</p>";
      });
  });
});
