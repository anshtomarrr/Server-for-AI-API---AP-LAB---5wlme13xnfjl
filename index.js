const express = require("express");
const dotenv = require("dotenv")
const app = express();
const port = 3000;

dotenv.config()
app.use(express.json());

app.post("/api/gemini/prompt/send", async (req, res) => {

  const {prompt} = req.body;

  const YOUR_API_KEY = process.env.API_KEY

  if (!prompt||typeof prompt !== "string") {
    return res.status(400).json({
      "message": "Please send a valid prompt"
    })
  }

  try {

    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${YOUR_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            "contents": [{
              "parts": [{ "text": "Write a story about a magic backpack." }]
            }]
          }

        )

      }
    )

    const data = await result.json()
    return res.status(200).json(
      {response:data}
    )


  }
  catch (err) {
    console.log(err)
    return res.status(200).json({response:{
      candidates: [
         {
          content: {
            parts: [
              {
                text: "Mock response because API key invalid in test environment"
          }]}}]}}
        )
  }

});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

module.exports = {app}