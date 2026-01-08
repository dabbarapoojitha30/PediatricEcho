document.addEventListener("DOMContentLoaded", function() {

  
  const ageSelect = document.getElementById("age");
  for (let i = 0; i <= 100; i++) {
    let option = document.createElement("option");
    option.value = i; 
    option.textContent = i;
    ageSelect.appendChild(option);
  }

  document.getElementById("addForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
      id: document.getElementById("patientId").value,
      name: document.getElementById("patientName").value,
      age: document.getElementById("age").value,
      sex: document.querySelector('select[name="sex"]').value,
      dob: document.querySelector('input[name="dob"]').value,
      weight: document.querySelector('input[name="weight"]').value,
      diagnosis: document.querySelector('textarea[name="diagnosis"]').value
    };

    for (let key in data) {
      if (!data[key]) {
        alert("Please fill all fields");
        return;
      }
    }

    fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      alert(res.message);
      this.reset();
      document.getElementById("age").value = "";
    })
    .catch(err => {
      console.error(err);
      alert("Error saving patient");
    });
  });

 
  document.getElementById("searchform").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = this.elements["id"].value.trim();
    const result = document.getElementById("searchResult");

    if (!id) {
      alert("Please enter Patient ID");
      return;
    }

    fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "found") {
        const p = data.patient;
        result.innerHTML = `
          <p><b>ID:</b> ${p.id}</p>
          <p><b>Name:</b> ${p.name}</p>
          <p><b>Age:</b> ${p.age}</p>
          <p><b>Sex:</b> ${p.sex}</p>
          <p><b>DOB:</b> ${p.dob.toString().split("T")[0]}</p>
          <p><b>Weight:</b> ${p.weight} kg</p>
          <p><b>Diagnosis:</b> ${p.diagnosis}</p>
        `;
      } else {
        result.innerHTML = "Patient not found";
      }
    })
    .catch(err => {
      console.error(err);
      result.innerHTML = "Error searching patient";
    });
  });

});
