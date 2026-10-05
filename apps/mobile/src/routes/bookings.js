const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* ==============================
   BOOKING MODEL
============================== */

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    bookingId: {
      type: String,
      required: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
    },

    option: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    professionalName: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      trim: true,
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index(
  {
    userId: 1,
    bookingId: 1,
  },
  {
    unique: true,
  }
);

const Booking =
  mongoose.models.Booking ||
  mongoose.model(
    "Booking",
    bookingSchema
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
   GET CURRENT BOOKING
============================== */

router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const booking =
        await Booking.findOne({
          userId: req.userId,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.json({
        success: true,
        booking: booking || null,
      });
    } catch (error) {
      console.error(
        "Booking load error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load booking.",
      });
    }
  }
);

/* ==============================
   SAVE / UPDATE BOOKING
============================== */

router.post(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        bookingId,
        service,
        option,
        date,
        time,
        address,
        professionalName,
        rating,
        price,
        status,
      } = req.body;

      if (
        !bookingId ||
        !service ||
        !option ||
        !date ||
        !time ||
        !address ||
        !professionalName ||
        !rating ||
        !price
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Complete booking information is required.",
        });
      }

      const booking =
        await Booking.findOneAndUpdate(
          {
            userId: req.userId,
            bookingId: String(bookingId),
          },
          {
            userId: req.userId,
            bookingId: String(bookingId),
            service: String(service).trim(),
            option: String(option).trim(),
            date: String(date).trim(),
            time: String(time).trim(),
            address: String(address).trim(),
            professionalName:
              String(professionalName).trim(),
            rating: String(rating).trim(),
            price: String(price).trim(),
            status:
              status === undefined
                ? "Confirmed"
                : String(status).trim(),
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
          "Booking saved successfully.",
        booking,
      });
    } catch (error) {
      console.error(
        "Booking save error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save booking.",
      });
    }
  }
);

/* ==============================
   DELETE / CANCEL BOOKING
============================== */

router.delete(
  "/:bookingId",
  authenticateToken,
  async (req, res) => {
    try {
      const bookingId =
        String(req.params.bookingId);

      const deleted =
        await Booking.findOneAndDelete({
          userId: req.userId,
          bookingId,
        });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Booking not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Booking cancelled successfully.",
      });
    } catch (error) {
      console.error(
        "Booking delete error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to cancel booking.",
      });
    }
  }
);

module.exports = router;