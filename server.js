const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

const dataFilePath = path.join(__dirname, "donors.json");

// Post request to save data to file
app.post("/save-data", async (req, res) => {
  try {
    const newData = req.body;
    console.log(newData);

    let dataArray = [];

    //reading existing file content
    try {
      const data = await fs.readFile(dataFilePath, "utf8");
      dataArray = data ? JSON.parse(data) : [];
    } catch (readErr) {
      if (readErr.code !== "ENOENT") {
        console.error("Error reading data file:", readErr);
        return res.status(500).send("Error reading data");
      }
      // If file doesn't exist, start with empty array
      dataArray = [];
    }

    dataArray.push(newData);

    // Write updated array back to file
    await fs.writeFile(dataFilePath, JSON.stringify(dataArray, null, 2));

    console.log("Data saved to data.json");
    res.status(200).send("Data saved successfully");
  } catch (error) {
    console.error("Error saving data to data.json:", error);
    res.status(500).send("Error saving data");
  }
});

// Get request to get all data from file
app.get("/get-donors", async (req, res) => {
  try {
    console.log("get donors route hit");
    const data = await fs.readFile(dataFilePath, "utf8");
    const donors = data ? JSON.parse(data) : [];
    res.json(donors);
  } catch (readErr) {
    if (readErr.code === "ENOENT") {
      // File doesn't exist, return empty array
      return res.json([]);
    }
    console.error("Error reading data file:", readErr);
    res.status(500).send("Error reading data");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
