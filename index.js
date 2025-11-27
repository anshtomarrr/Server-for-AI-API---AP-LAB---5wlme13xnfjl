const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();


const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.post("/api/gemini/prompt/send", async (req, res) => {

  const { prompt } = req.body;

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ message: "Please send a valid prompt" });
  }

  try {
    const geminiBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
      geminiBody,
      { headers: { "Content-Type": "application/json" } }
    );

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

module.exports = { app };
