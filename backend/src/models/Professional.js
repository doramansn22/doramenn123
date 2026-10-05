const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      default: 4.8,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    price: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    verified: {
      type: Boolean,
      default: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

professionalSchema.index({
  service: 1,
  active: 1,
});

const Professional =
  mongoose.models.Professional ||
  mongoose.model("Professional", professionalSchema);

module.exports = Professional;