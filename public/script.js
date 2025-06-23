let donors = [];

function fetchDonors(callback) {
  fetch("/get-donors")
    .then((response) => response.json())
    .then((data) => {
      donors = data;
      //   console.log(donors);
      if (callback && typeof callback === "function") {
        callback();
      }
    })
    .catch((error) => console.error("Error fetching donors:", error));
}

function displayDonors() {
  const resultDiv = document.getElementById("result");
  console.log(resultDiv);

  if (donors.length === 0) {
    resultDiv.innerHTML = `<p>No donors registered yet.</p>`;
    return;
  }

  resultDiv.innerHTML = `<h3>Registered Donors:</h3>`;

  let text = "";
  donors.forEach(
    ({
      fullName,
      age,
      gender,
      date,
      district,
      contact,
      bloodType,
      pincode,
      availability,
    }) => {
      text = `<div class="card">
                <div class="pair"><span class="label">Full Name:</span><span class="value">${fullName}</span></div>
                <div class="pair"><span class="label">Age:</span><span class="value">${age}</span></div>
                <div class="pair"><span class="label">Gender:</span><span class="value">${gender}</span></div>
                <div class="pair"><span class="label">Blood Type:</span><span class="value">${bloodType}</span></div>
                <div class="pair"><span class="label">Contact:</span><span class="value">${contact}</span></div>
                <div class="pair"><span class="label">District:</span><span class="value">${district}</span></div>
                <div class="pair"><span class="label">Pincode:</span><span class="value">${pincode}</span></div>
                <div class="pair"><span class="label">Last Donated:</span><span class="value">${date
                  .split("-")
                  .reverse()
                  .join("-")}</span></div>
                <div class="pair"><span class="label">Availability:</span><span class="value">${availability}</span></div>
               </div>`;
      resultDiv.innerHTML += text;
    }
  );
}

async function showSection(sectionId) {
  console.log("Switching to section", sectionId);
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  const section = document.getElementById(sectionId);
  if (section) {
    console.log("Showing Section:", sectionId);
    section.classList.add("active");
  } else {
    console.error(`Section ${sectionId} not found`);
  }

  document
    .querySelectorAll(".nav a")
    .forEach((link) => link.classList.remove("active"));
  document
    .querySelector(`.nav a[onclick="showSection('${sectionId}')"]`)
    .classList.add("active");
  localStorage.setItem("lastSection", sectionId);

  // Fetch and display donors when showing profile
  if (sectionId === "profile") {
    fetchDonors(displayDonors);
  }
}

window.onload = () => {
  const lastSection = localStorage.getItem("lastSection") || "home";
  showSection(lastSection);
};

// Register form
document
  .getElementById("donorForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      fullName: document.getElementById("fullName").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      bloodType: document.getElementById("bloodType").value,
      contact: document.getElementById("contact").value,
      district: document.getElementById("district").value,
      pincode: document.getElementById("pincode").value,
      date: document.getElementById("date").value,
      availability: document.getElementById("availability").value,
    };

    console.log(formData);

    try {
      const response = await fetch("/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data saved successfully!");
        document.getElementById("donorForm").reset();
      } else {
        alert("Error saving data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving data");
    }
  });

document.getElementById("find-form").addEventListener("submit", (event) => {
  event.preventDefault();
  fetchDonors(() => {
    const district = document.getElementById("find-district").value;
    const bloodType = document.getElementById("find-blood").value;
    const contact = document.getElementById("contact-info").value;

    const filteredDonors = donors.filter((donor) => {
      if (
        donor.district === district &&
        donor.bloodType === bloodType &&
        donor.contact === contact
      ) {
        return donor;
      } else if (donor.district === district && donor.bloodType === bloodType) {
        return donor;
      }
    });
    showFindDonors(filteredDonors, district, bloodType);

    console.log("find donors array", filteredDonors);
  });
});

function showFindDonors(filteredDonors, district, bloodType) {
  let resultDiv = document.getElementById("find-result");

  if (filteredDonors.length === 0) {
    resultDiv.innerHTML = `<p>Currently no donor Available in District ${district} with Blood Type ${bloodType}!</p>`;
    return;
  }

  resultDiv.innerHTML = "<h3>Donors:</h3>";

  let text = "";
  filteredDonors.forEach(({ fullName, date, bloodType, contact }) => {
    text = `<div>
                <div><p><span class="bold">${fullName}</span> | ${bloodType}</p>
                    <p>Last Donated: ${date.split("-").reverse().join("-")}</p>
                </div>
                <div class="icons"><img src="images/002-call.png" alt="call image"/>
                    <a href="https://api.whatsapp.com/send/?phone=${contact}&text&type=phone_number&app_absent=0&text=Hello%2C%20I%20need%20blood%20donor.%20Can%20you%20donate%3F"><img src="images/001-whatsapp.png" alt="whatsapp image"/></a>
                </div></div>`;
    resultDiv.innerHTML += text;
  });
}
