const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error("ERROR: OPENAI_API_KEY is missing from .env");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HomeAI AI backend is running",
  });
});

app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageBase64, problem } = req.body || {};

    const cleanProblem =
      typeof problem === "string" ? problem.trim() : "";

    const cleanImage =
      typeof imageBase64 === "string"
        ? imageBase64.trim()
        : "";

    console.log("-----------------------------------------");
    console.log("HomeAI request received");
    console.log("Has problem:", !!cleanProblem);
    console.log("Has image:", !!cleanImage);

    if (!cleanProblem && !cleanImage) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a problem description or photo.",
      });
    }

    const prompt = `
You are HomeAI, an AI home maintenance assistant.

Analyze the homeowner's home problem carefully.

${
  cleanProblem
    ? `The homeowner described:
"${cleanProblem}"`
    : "The homeowner did not provide a text description."
}

${
  cleanImage
    ? "A photo of the home problem is attached. Analyze the visible problem carefully."
    : ""
}

Give a practical homeowner-friendly assessment.

Include:

1. What appears to be wrong.
2. Possible cause.
3. Recommended home service.
4. Priority: Low, Normal, High, or Emergency.
5. Safe next step.

If the image is unclear, say so clearly.

Do not claim certainty when evidence is insufficient.

Do not provide dangerous repair instructions.

If there may be an electrical, gas, fire, structural,
or other serious safety issue, recommend contacting
a qualified professional.
`;

    /*
     * TEXT ONLY
     *
     * This is deliberately a completely separate request.
     * No image object is sent when there is no image.
     */
    if (!cleanImage) {
      console.log("Sending TEXT-ONLY request to OpenAI...");

      const response = await client.responses.create({
        model: "gpt-5.6-luna",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: prompt,
              },
            ],
          },
        ],
      });

      console.log("OpenAI text response received");

      return res.json({
        success: true,
        analysis:
          response.output_text ||
          "HomeAI could not generate an analysis.",
      });
    }

    /*
     * IMAGE REQUEST
     *
     * The mobile app sends a JPEG data URL:
     * data:image/jpeg;base64,...
     *
     * OpenAI Responses API accepts image_url as a
     * fully qualified URL or base64 data URL.
     */

    if (
      !cleanImage.startsWith("data:image/jpeg") &&
      !cleanImage.startsWith("data:image/png") &&
      !cleanImage.startsWith("data:image/webp") &&
      !cleanImage.startsWith("data:image/gif")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid image format. Please select a JPEG, PNG, WEBP, or GIF image.",
      });
    }

    console.log("Sending IMAGE request to OpenAI...");

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt,
            },
            {
              type: "input_image",
              image_url: cleanImage,
            },
          ],
        },
      ],
    });

    console.log("OpenAI image response received");

    return res.json({
      success: true,
      analysis:
        response.output_text ||
        "HomeAI could not generate an analysis.",
    });
  } catch (error) {
    console.error("-----------------------------------------");
    console.error("HomeAI AI Error");

    console.error("Message:", error?.message);
    console.error("Status:", error?.status);
    console.error("Code:", error?.code);
    console.error("Param:", error?.param);

    if (error?.error) {
      console.error("OpenAI error:", error.error);
    }

    console.error("-----------------------------------------");

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "AI analysis failed. Please try again.",
      status: error?.status || 500,
      code: error?.code || null,
    });
  }
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, "0.0.0.0", () => {
  console.log("-----------------------------------------");
  console.log(
    `HomeAI AI backend running on http://localhost:${PORT}`
  );
  console.log(
    `HomeAI network backend running on http://172.20.10.4:${PORT}`
  );
  console.log("-----------------------------------------");
});