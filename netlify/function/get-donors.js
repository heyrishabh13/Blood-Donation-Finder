const fs = require("fs").promises;

exports.handler = async (event, context) => {
  try {
    const donors = JSON.parse(await fs.readFile("./data.json", "utf8"));
    return {
      statusCode: 200,
      body: JSON.stringify(donors),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch donors" }),
    };
  }
};
