const mongoose = require("mongoose");

const RunSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, "Please provide a location"],
      maxLength: 50,
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
    },
    distance: {
      type: Number,
      required: [true, "Please provide the distance"],
    },
    category: {
      type: String,
      enum: ["recover", "long-run", "tempo"],
      default: "long-run",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an userId"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Run", RunSchema);
