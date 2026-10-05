const express = require("express");
const jwt = require("jsonwebtoken");
const Service = require("../models/Service");

const router = express.Router();

/* ==============================
   JWT AUTHENTICATION
============================== */

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing from .env",
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
   GET ACTIVE SERVICES
============================== */

router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const services = await Service.find({
        active: true,
      })
        .sort({
          name: 1,
        })
        .lean();

      return res.json({
        success: true,
        services,
      });
    } catch (error) {
      console.error(
        "Services load error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to load services.",
      });
    }
  }
);

/* ==============================
   GET SINGLE SERVICE
============================== */

router.get(
  "/:name",
  authenticateToken,
  async (req, res) => {
    try {
      const service = await Service.findOne({
        name: req.params.name,
        active: true,
      }).lean();

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found.",
        });
      }

      return res.json({
        success: true,
        service,
      });
    } catch (error) {
      console.error(
        "Single service load error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load service.",
      });
    }
  }
);

module.exports = router;