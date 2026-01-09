const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatLabel: { type: String, required: true }, // A1, B3
    status: {
      type: String,
      enum: ["AVAILABLE", "LOCKED", "BOOKED"],
      default: "AVAILABLE",
    },
    userId: mongoose.Schema.Types.ObjectId,
    lockedAt: Date,
  },
  { _id: false }
);

const showSchema = new mongoose.Schema(
  {
    hallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },
    showTime: {
      type: Date,
      required: true,
    },
    seats: [seatSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
