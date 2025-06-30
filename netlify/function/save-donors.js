const fs = require("fs").promises;

exports.handler = async (event, context) => {
  try {
    const {
      fullName,
      age,
      gender,
      bloodType,
      contact,
      district,
      pincode,
      date,
      availability,
    } = JSON.parse(event.body);
    const newDonor = {
      fullName,
      age,
      gender,
      bloodType,
      contact,
      district,
      pincode,
      date,
      availability,
    };
    let donors = [];
    try {
      const data = await fs.readFile("./data.json", "utf8");
      donors = JSON.parse(data);
    } catch (e) {
      // File doesn’t exist yet, start with empty array
    }
    donors.push(newDonor);
    await fs.writeFile("./data.json", JSON.stringify(donors, null, 2));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Donor saved successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to save donor" }),
    };
  }
};
