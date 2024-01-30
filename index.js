import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Home Page Route: Show a random activity on the home page
app.get("/", async (req, res) => {
  try {
    
    // Fetch a random activity from the Bored API
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    
    // Render the index.ejs file with the random activity
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    
    // Render the index.ejs file with an error message
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

// Form Submission Route: Handle form submissions and show a random activity
app.post("/", async (req, res) => {
  try {
    console.log(req.body);

    // Make a request to the Bored API's /filter endpoint with specified parameters
    const type = await axios.get("https://bored-api.appbrewery.com/filter", {
      params: {
        type: req.body.type,
        participants: req.body.participants,
      },
    });
    
    // Check if there are activities in the response
    const randomActivity = type.data[Math.floor(Math.random() * type.data.length)];
    
    // Render the index.ejs file with the random activity
    res.render("index.ejs", { data: randomActivity });

  } catch (error) {
    console.error("Failed to make request:", error.message);

    // Check for a specific 404 status code indicating no activities match the criteria
    if (error.response && error.response.status === 404) {
      res.render("index.ejs", { error: "No activities that match your criteria" });
    } else {
      res.render("index.ejs", { error: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
