const mongoose = require("mongoose");

const pondSchema = new mongoose.Schema(
  {
    pondId: { type: String, required: true, unique: true }, // e.g. POND-0001
    name: { type: String, required: true, trim: true },

    village: { type: String, required: true, trim: true },
    block: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },

    geoLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    surfaceAreaSqm: Number,
    estimatedCapacity: Number,

    pondType: {
      type: String,
      enum: [
        "irrigation_tank",
        "drinking_water",
        "temple_pond",
        "percolation_pond",
        "check_dam",
        "other",
      ],
      default: "other",
    },

    ownership: {
      type: String,
      enum: ["panchayat", "private", "forest", "government", "disputed"],
      default: "panchayat",
    },

    currentStage: {
      type: String,
      enum: [
        "identified",
        "survey_complete",
        "desilting",
        "bund_strengthening",
        "plantation",
        "completed",
        "under_maintenance",
      ],
      default: "identified",
    },

    overallHealthScore: {
      type: String,
      enum: ["good", "moderate", "poor", "unknown"],
      default: "unknown",
    },

    schemeSource: {
      type: String,
      enum: ["mgnrega", "jal_shakti", "csr", "state_scheme", "other"],
      default: "other",
    },

    budgetAllocated: { type: Number, default: 0 },
    budgetUtilized: { type: Number, default: 0 },

    baselinePhotoUrl: String,

    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    isPubliclyVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

pondSchema.index({ "geoLocation.lat": 1, "geoLocation.lng": 1 });

module.exports = mongoose.model("Pond", pondSchema);
