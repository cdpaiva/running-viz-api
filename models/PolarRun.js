const mongoose = require("mongoose");
const parseDuration = require("../utils/parseDuration");

const PolarRunSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    distance: {
      type: Number,
      required: [true, "Please provide the distance"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an userId"],
    },
    device: {
      type: String,
    },
    duration: {
      type: String,
    },
    calories: {
      type: Number,
    },
    heartRateAverage: {
      type: Number,
    },
    heartRateMax: {
      type: Number,
    },
    trainingLoad: {
      type: Number,
    },
    runningIndex: {
      type: Number,
    },
  },
  { timestamps: true }
);

PolarRunSchema.statics.mapResponseToModel = function (res) {
  return {
    date: new Date(res["start-time"]),
    distance: res.distance,
    device: res.device,
    duration: parseDuration(res.duration),
    calories: res.calories,
    heartRateAverage: res["heart-rate"].average,
    heartRateMax: res["heart-rate"].maximum,
    trainingLoad: res["training-load"],
    runningIndex: res["running-index"],
  };
};

module.exports = mongoose.model("PolarRun", PolarRunSchema);
