const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HomeAI AI backend is running",
  });
});

app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageBase64, problem } = req.body;

    if (!imageBase64 && !problem?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a problem description or photo.",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
You are HomeAI, an AI home maintenance assistant.

Analyze the uploaded home-problem image carefully.

Return a practical assessment for the homeowner.

Identify:
1. What is visibly wrong.
2. Possible cause.
3. Recommended home service.
4. Priority: Low, Normal, High, or Emergency.
5. Safe next step.

Do not claim certainty when the image is unclear.
Do not provide dangerous repair instructions.
If the problem could be dangerous, recommend contacting a qualified professional.

${problem ? `The homeowner also described: ${problem}` : ""}
              `,
            },
            {
              type: "input_image",
              image_url: imageBase64,
            },
          ],
        },
      ],
    });

    res.json({
      success: true,
      analysis: response.output_text,
    });
  } catch (error) {
    console.error("HomeAI AI Error:", error);

    res.status(500).json({
      success: false,
      message: "AI analysis failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HomeAI backend running on http://localhost:${PORT}`);
});

