const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const authRoutes = require("./src/routes/auth");
const applianceRoutes = require("./src/routes/appliances");
const serviceHistoryRoutes = require("./src/routes/service-history");
const maintenanceRoutes = require("./src/routes/maintenance");
const bookingRoutes = require("./src/routes/bookings");
const serviceRoutes = require("./src/routes/services");
const professionalRoutes = require("./src/routes/professionals");

dotenv.config();

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "20mb",
  })
);

/* ==============================
   AUTH ROUTES
============================== */

app.use("/api/auth", authRoutes);
app.use("/api/appliances", applianceRoutes);
app.use("/api/service-history", serviceHistoryRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/professionals", professionalRoutes);

/* ==============================
   HOMEAI DATABASE
============================== */

const connectDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/homeai";

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

connectDatabase();

/* ==============================
   HOME PROFILE MODEL
============================== */

const homeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },

    homeName: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    homeType: {
      type: String,
      trim: true,
      default: "",
    },

    bedrooms: {
      type: String,
      trim: true,
      default: "",
    },

    bathrooms: {
      type: String,
      trim: true,
      default: "",
    },

    people: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const HomeProfile =
  mongoose.models.HomeProfile ||
  mongoose.model(
    "HomeProfile",
    homeProfileSchema
  );

/* ==============================
   JWT AUTHENTICATION
============================== */

const authenticateToken = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is missing from .env",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token.",
    });
  }
};

/* ==============================
   GET HOME PROFILE
============================== */

app.get(
  "/api/home-profile",
  authenticateToken,
  async (req, res) => {
    try {
      const homeProfile =
        await HomeProfile.findOne({
          userId: req.userId,
        }).lean();

      return res.json({
        success: true,
        homeProfile:
          homeProfile || null,
      });
    } catch (error) {
      console.error(
        "Home profile load error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load home profile.",
      });
    }
  }
);

/* ==============================
   SAVE HOME PROFILE
============================== */

app.put(
  "/api/home-profile",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        homeName,
        address,
        homeType,
        bedrooms,
        bathrooms,
        people,
      } = req.body;

      if (
        !homeName ||
        !String(homeName).trim() ||
        !address ||
        !String(address).trim() ||
        !homeType ||
        !String(homeType).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Home name, address and home type are required.",
        });
      }

      const homeProfile =
        await HomeProfile.findOneAndUpdate(
          {
            userId: req.userId,
          },
          {
            userId: req.userId,

            homeName:
              String(homeName).trim(),

            address:
              String(address).trim(),

            homeType:
              String(homeType).trim(),

            bedrooms:
              bedrooms === undefined
                ? ""
                : String(bedrooms).trim(),

            bathrooms:
              bathrooms === undefined
                ? ""
                : String(bathrooms).trim(),

            people:
              people === undefined
                ? ""
                : String(people).trim(),
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        ).lean();

      return res.json({
        success: true,
        message:
          "Home profile saved successfully.",
        homeProfile,
      });
    } catch (error) {
      console.error(
        "Home profile save error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save home profile.",
      });
    }
  }
);

/* ==============================
   OPENAI
============================== */

if (!process.env.OPENAI_API_KEY) {
  console.error(
    "OPENAI_API_KEY is missing from .env"
  );

  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ==============================
   HOMEAI STATUS
============================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "HomeAI NEW AI backend is running",
  });
});

/* ==============================
   AI IMAGE ANALYSIS
============================== */

app.post(
  "/api/analyze-image",
  async (req, res) => {
    console.log(
      "\n=============================="
    );

    console.log(
      "HOMEAI AI ANALYSIS REQUEST"
    );

    console.log(
      "=============================="
    );

    try {
      const problem =
        typeof req.body?.problem === "string"
          ? req.body.problem.trim()
          : "";

      const imageBase64 =
        typeof req.body?.imageBase64 ===
        "string"
          ? req.body.imageBase64.trim()
          : "";

      console.log(
        "Problem:",
        problem || "(none)"
      );

      console.log(
        "Image received:",
        !!imageBase64
      );

      /*
       * Validate request
       */

      if (!problem && !imageBase64) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a problem description or photo.",
        });
      }

      /*
       * Validate image format
       */

      if (imageBase64) {
        if (
          !imageBase64.startsWith(
            "data:image/"
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid image format. Please select the image again.",
          });
        }
      }

      /*
       * HomeAI instructions
       */

      const text = `
You are HomeAI, a professional AI home maintenance assistant.

The homeowner needs help understanding a problem in their home.

Problem description:
${problem || "No text description was provided."}

Analyze the information carefully.

If an image is provided, inspect the image and use visible information
from the image in your analysis.

Give a simple, practical and useful answer.

Include:

1. What may be wrong
2. Possible cause
3. Recommended service
4. Priority: Low, Normal, High, or Emergency
5. Safe next step

Do not claim certainty when the information is insufficient.

Do not give dangerous repair instructions.

If professional assistance is required, clearly recommend
the appropriate home service professional.
`;

      let input;

      /*
       * TEXT + IMAGE
       */

      if (imageBase64) {
        console.log(
          "MODE: TEXT + IMAGE"
        );

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
                image_url:
                  imageBase64,
              },
            ],
          },
        ];
      }

      /*
       * TEXT ONLY
       */

      else {
        console.log(
          "MODE: TEXT ONLY"
        );

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

      console.log(
        "Calling OpenAI Responses API..."
      );

      console.log(
        "Model: gpt-5.6-luna"
      );

      /*
       * OpenAI Responses API
       */

      const response =
        await client.responses.create({
          model: "gpt-5.6-luna",
          input,
        });

      console.log(
        "OpenAI SUCCESS"
      );

      const analysis =
        response.output_text ||
        "No analysis was returned.";

      console.log(
        "Analysis received successfully."
      );

      return res.json({
        success: true,
        analysis,
      });
    } catch (error) {
      console.error(
        "\n========== OPENAI ERROR =========="
      );

      console.error(
        "Message:",
        error?.message
      );

      console.error(
        "Status:",
        error?.status
      );

      console.error(
        "Code:",
        error?.code
      );

      console.error(
        "Type:",
        error?.type
      );

      console.error(
        "Full error:",
        error
      );

      console.error(
        "==================================\n"
      );

      return res.status(500).json({
        success: false,

        message:
          error?.message ||
          "OpenAI request failed.",

        status:
          error?.status || 500,

        code:
          error?.code || null,
      });
    }
  }
);

/* ==============================
   SERVER
============================== */

const PORT = 5055;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      "\n================================="
    );

    console.log(
      "HOMEAI NEW BACKEND"
    );

    console.log(
      "================================="
    );

    console.log(
      `Local:   http://localhost:${PORT}`
    );

    console.log(
      `Network: http://172.20.10.4:${PORT}`
    );

    console.log(
      "=================================\n"
    );
  }
);