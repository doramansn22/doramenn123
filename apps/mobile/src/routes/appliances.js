const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* ==============================
   APPLIANCE MODEL
============================== */

const applianceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      trim: true,
      default: "",
    },

    purchaseYear: {
      type: String,
      trim: true,
      default: "",
    },

    warranty: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

applianceSchema.index(
  { userId: 1, id: 1 },
  { unique: true }
);

const Appliance =
  mongoose.models.Appliance ||
  mongoose.model(
    "Appliance",
    applianceSchema
  );

/* ==============================
   JWT AUTHENTICATION
============================== */

const authenticateToken = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
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

    const decoded =
      jwt.verify(
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
   GET APPLIANCES
============================== */

router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const appliances =
        await Appliance.find({
          userId: req.userId,
        })
          .sort({ createdAt: 1 })
          .lean();

      return res.json({
        success: true,
        appliances,
      });
    } catch (error) {
      console.error(
        "Appliance load error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load appliances.",
      });
    }
  }
);

/* ==============================
   SAVE APPLIANCE
============================== */

router.post(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        id,
        type,
        name,
        brand,
        model,
        purchaseYear,
        warranty,
      } = req.body;

      if (
        !id ||
        !type ||
        !name ||
        !brand
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Appliance ID, type, name and brand are required.",
        });
      }

      const appliance =
        await Appliance.findOneAndUpdate(
          {
            userId: req.userId,
            id: String(id),
          },
          {
            userId: req.userId,
            id: String(id),
            type: String(type).trim(),
            name: String(name).trim(),
            brand: String(brand).trim(),
            model:
              model === undefined
                ? ""
                : String(model).trim(),
            purchaseYear:
              purchaseYear === undefined
                ? ""
                : String(purchaseYear).trim(),
            warranty:
              warranty === undefined
                ? ""
                : String(warranty).trim(),
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
          "Appliance saved successfully.",
        appliance,
      });
    } catch (error) {
      console.error(
        "Appliance save error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save appliance.",
      });
    }
  }
);

/* ==============================
   DELETE APPLIANCE
============================== */

router.delete(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const deleted =
        await Appliance.findOneAndDelete({
          userId: req.userId,
          id: String(req.params.id),
        });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Appliance not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Appliance deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Appliance delete error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete appliance.",
      });
    }
  }
);

module.exports = router;