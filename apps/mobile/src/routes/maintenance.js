const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* ==============================
   MAINTENANCE TASK MODEL
============================== */

const maintenanceTaskSchema = new mongoose.Schema(
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

    task: {
      type: String,
      required: true,
      trim: true,
    },

    dueDate: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    notificationId: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

maintenanceTaskSchema.index(
  {
    userId: 1,
    applianceId: 1,
    id: 1,
  },
  {
    unique: true,
  }
);

const MaintenanceTask =
  mongoose.models.MaintenanceTask ||
  mongoose.model(
    "MaintenanceTask",
    maintenanceTaskSchema
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
   GET MAINTENANCE TASKS
============================== */

router.get(
  "/:applianceId",
  authenticateToken,
  async (req, res) => {
    try {
      const applianceId =
        String(req.params.applianceId);

      const tasks =
        await MaintenanceTask.find({
          userId: req.userId,
          applianceId,
        })
          .sort({
            createdAt: 1,
          })
          .lean();

      return res.json({
        success: true,
        tasks,
      });
    } catch (error) {
      console.error(
        "Maintenance load error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load maintenance tasks.",
      });
    }
  }
);

/* ==============================
   ADD MAINTENANCE TASK
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
        task,
        dueDate,
        notes,
        notificationId,
      } = req.body;

      if (
        !id ||
        !task ||
        !dueDate
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Task ID, task and due date are required.",
        });
      }

      const savedTask =
        await MaintenanceTask.findOneAndUpdate(
          {
            userId: req.userId,
            applianceId,
            id: String(id),
          },
          {
            userId: req.userId,
            applianceId,
            id: String(id),
            task: String(task).trim(),
            dueDate: String(dueDate).trim(),
            notes:
              notes === undefined
                ? ""
                : String(notes).trim(),
            notificationId:
              notificationId === undefined ||
              notificationId === null
                ? null
                : String(notificationId),
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
          "Maintenance task saved successfully.",
        task: savedTask,
      });
    } catch (error) {
      console.error(
        "Maintenance save error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save maintenance task.",
      });
    }
  }
);

/* ==============================
   DELETE MAINTENANCE TASK
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
        await MaintenanceTask.findOneAndDelete({
          userId: req.userId,
          applianceId,
          id,
        });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Maintenance task not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Maintenance task deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Maintenance delete error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete maintenance task.",
      });
    }
  }
);

module.exports = router;