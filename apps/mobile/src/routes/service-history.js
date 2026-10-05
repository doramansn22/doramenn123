const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* ==============================
   SERVICE HISTORY MODEL
============================== */

const serviceRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    applianceId: {
      type: String,
      required: true,
    },

    id: {
      type: String,
      required: true,
    },

    serviceType: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    professional: {
      type: String,
      trim: true,
      default: "",
    },

    cost: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

serviceRecordSchema.index(
  {
    userId: 1,
    applianceId: 1,
    id: 1,
  },
  {
    unique: true,
  }
);

const ServiceRecord =
  mongoose.models.ServiceRecord ||
  mongoose.model(
    "ServiceRecord",
    serviceRecordSchema
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
   GET SERVICE HISTORY
============================== */

router.get(
  "/:applianceId",
  authenticateToken,
  async (req, res) => {
    try {
      const applianceId =
        String(req.params.applianceId);

      const records =
        await ServiceRecord.find({
          userId: req.userId,
          applianceId,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.json({
        success: true,
        records,
      });
    } catch (error) {
      console.error(
        "Service history load error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load service history.",
      });
    }
  }
);

/* ==============================
   ADD SERVICE RECORD
============================== */

router.post(
  "/:applianceId",
  authenticateToken,
  async (req, res) => {
    try {
      const applianceId =
        String(req.params.applianceId);

      const {
        id,
        serviceType,
        date,
        description,
        professional,
        cost,
      } = req.body;

      if (
        !id ||
        !serviceType ||
        !date
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Service ID, service type and date are required.",
        });
      }

      const record =
        await ServiceRecord.findOneAndUpdate(
          {
            userId: req.userId,
            applianceId,
            id: String(id),
          },
          {
            userId: req.userId,
            applianceId,

            id: String(id),

            serviceType:
              String(serviceType).trim(),

            date:
              String(date).trim(),

            description:
              description === undefined
                ? ""
                : String(description).trim(),

            professional:
              professional === undefined
                ? ""
                : String(professional).trim(),

            cost:
              cost === undefined
                ? ""
                : String(cost).trim(),
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
          "Service record saved successfully.",
        record,
      });
    } catch (error) {
      console.error(
        "Service history save error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save service record.",
      });
    }
  }
);

/* ==============================
   DELETE SERVICE RECORD
============================== */

router.delete(
  "/:applianceId/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const applianceId =
        String(req.params.applianceId);

      const id =
        String(req.params.id);

      const deleted =
        await ServiceRecord.findOneAndDelete({
          userId: req.userId,
          applianceId,
          id,
        });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Service record not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Service record deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Service history delete error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete service record.",
      });
    }
  }
);

module.exports = router;