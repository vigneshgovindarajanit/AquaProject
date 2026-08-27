const mongoose = require("mongoose");

const waterQualityRecordSchema = new mongoose.Schema(
  {
    pond: { type: mongoose.Schema.Types.ObjectId, ref: "Pond", required: true },
    recordedDate: { type: Date, default: Date.now },

    pH: Number,
    turbidityNTU: Number,
    dissolvedOxygenMgL: Number,
    waterLevelMeters: Number,
    temperatureC: Number,
    algaePresence: {
      type: String,
      enum: ["none", "low", "moderate", "heavy_bloom"],
      default: "none",
    },

    biodiversityNotes: String, // fish species, bird sightings etc.

    healthScore: {
      type: String,
      enum: ["good", "moderate", "poor"],
    },

    source: { type: String, enum: ["manual", "sensor"], default: "manual" },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Simple auto-scoring logic based on thresholds before saving
waterQualityRecordSchema.pre("save", function (next) {
  let score = "good";

  if (
    (this.pH !== undefined && (this.pH < 6.0 || this.pH > 9.0)) ||
    (this.dissolvedOxygenMgL !== undefined && this.dissolvedOxygenMgL < 3) ||
    (this.turbidityNTU !== undefined && this.turbidityNTU > 25) ||
    this.algaePresence === "heavy_bloom"
  ) {
    score = "poor";
  } else if (
    (this.pH !== undefined && ((this.pH >= 6.0 && this.pH < 6.5) || (this.pH > 8.5 && this.pH <= 9.0))) ||
    (this.dissolvedOxygenMgL !== undefined && this.dissolvedOxygenMgL >= 3 && this.dissolvedOxygenMgL < 5) ||
    (this.turbidityNTU !== undefined && this.turbidityNTU >= 10 && this.turbidityNTU <= 25) ||
    this.algaePresence === "moderate"
  ) {
    score = "moderate";
  }

  this.healthScore = score;
  next();
});

module.exports = mongoose.model("WaterQualityRecord", waterQualityRecordSchema);
