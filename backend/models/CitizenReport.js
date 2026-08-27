const mongoose = require("mongoose");

const citizenReportSchema = new mongoose.Schema(
  {
    pond: { type: mongoose.Schema.Types.ObjectId, ref: "Pond", required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    type: {
      type: String,
      enum: ["complaint", "feedback", "water_level_report", "adopt_request"],
      required: true,
    },

    message: { type: String, required: true },
    reportedWaterLevel: Number, // for crowdsourced water_level_report type

    status: {
      type: String,
      enum: ["pending_review", "published", "rejected", "resolved"],
      default: "pending_review",
    },

    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    moderationRemarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CitizenReport", citizenReportSchema);
