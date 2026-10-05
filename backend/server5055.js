const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const connectDatabase = require("./src/config/database");
const authRoutes = require("./src/routes/auth");

dotenv.config();
connectDatabase();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use("/api/auth", authRoutes);

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is missing from .env");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HomeAI NEW AI backend is running",
  });
});

app.post("/api/analyze-image", async (req, res) => {
  console.log("\n==============================");
  console.log("NEW HOMEAI AI REQUEST");
  console.log("==============================");

  try {
    const problem =
      typeof req.body?.problem === "string"
        ? req.body.problem.trim()
        : "";

    const imageBase64 =
      typeof req.body?.imageBase64 === "string"
        ? req.body.imageBase64.trim()
        : "";

    console.log("Problem:", problem);
    console.log("Image received:", !!imageBase64);

    if (!problem && !imageBase64) {
      return res.status(400).json({
        success: false,
        message: "Please provide a problem description or photo.",
      });
    }

    const text = `
You are HomeAI, a professional AI home maintenance assistant.

The homeowner needs help with a home problem.

Problem description:
${problem || "No text description was provided."}

Give a simple and useful answer.

Include:
1. What may be wrong
2. Possible cause
3. Recommended service
4. Priority: Low, Normal, High, or Emergency
5. Safe next step

Do not claim certainty if there is not enough information.
Do not give dangerous repair instructions.
`;

    let input;

    if (imageBase64) {
      console.log("MODE: TEXT + IMAGE");

      input = [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text,
            },
            {
              type: "input_image",
              image_url: imageBase64,
            },
          ],
        },
      ];
    } else {
      console.log("MODE: TEXT ONLY");

      input = [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text,
            },
          ],
        },
      ];
    }

    console.log("Calling OpenAI...");

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input,
    });

    console.log("OpenAI SUCCESS");

    return res.json({
      success: true,
      analysis:
        response.output_text ||
        "No analysis was returned.",
    });
  } catch (error) {
    console.error("\n========== OPENAI ERROR ==========");
    console.error(error);
    console.error("==================================\n");

    return res.status(500).json({
      success: false,
      message: error?.message || "OpenAI request failed",
      status: error?.status || 500,
      code: error?.code || null,
    });
  }
});

const PORT = 5055;

app.listen(PORT, "0.0.0.0", () => {
  console.log("\n=================================");
  console.log("HOMEAI NEW BACKEND");
  console.log("=================================");
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://172.20.10.4:${PORT}`);
  console.log("=================================\n");
});