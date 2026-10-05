const express = require("express");
const jwt = require("jsonwebtoken");
const Professional = require("../models/Professional");

const router = express.Router();

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
      message: "Invalid or expired authentication token.",
    });
  }
};


/*
  GET ALL PROFESSIONALS
  Optional:
  /api/professionals?service=Plumber
*/
router.get("/", authenticateToken, async (req, res) => {
  try {
    const filter = {
      active: true,
    };

    if (req.query.service) {
      filter.service = String(req.query.service);
    }

    const professionals = await Professional.find(filter)
      .sort({
        verified: -1,
        rating: -1,
        reviews: -1,
      })
      .lean();

    return res.json({
      success: true,
      professionals,
    });
  } catch (error) {
    console.error(
      "Professionals load error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load professionals.",
    });
  }
});


/*
  GET PROFESSIONALS BY SERVICE
  Example:
  /api/professionals/service/Plumber
*/
router.get(
  "/service/:service",
  authenticateToken,
  async (req, res) => {
    try {
      const service = String(
        req.params.service
      );

      const professionals =
        await Professional.find({
          service,
          active: true,
        })
          .sort({
            verified: -1,
            rating: -1,
            reviews: -1,
          })
          .lean();

      return res.json({
        success: true,
        professionals,
      });
    } catch (error) {
      console.error(
        "Professionals by service error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load professionals for this service.",
      });
    }
  }
);


/*
  GET SINGLE PROFESSIONAL
*/
router.get(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const professional =
        await Professional.findOne({
          _id: req.params.id,
          active: true,
        }).lean();

      if (!professional) {
        return res.status(404).json({
          success: false,
          message: "Professional not found.",
        });
      }

      return res.json({
        success: true,
        professional,
      });
    } catch (error) {
      console.error(
        "Professional load error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to load professional.",
      });
    }
  }
);


module.exports = router;