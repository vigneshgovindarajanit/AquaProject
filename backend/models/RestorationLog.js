const mongoose = require("mongoose");

const restorationLogSchema = new mongoose.Schema(
  {
    pond: { type: mongoose.Schema.Types.ObjectId, ref: "Pond", required: true },

    stage: {
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
      required: true,
    },

    updateDate: { type: Date, default: Date.now },
    remarks: String,

    budgetAllocated: { type: Number, default: 0 },
    budgetUtilized: { type: Number, default: 0 },

    beforePhotoUrl: String,
    duringPhotoUrl: String,
    afterPhotoUrl: String,

    materialUsage: {
      jcbHours: Number,
      laborDays: Number,
      desiltedSoilVolumeCubicM: Number,
      soilRedistribution: String, // where the silt was used
    },

    // Submitted by a Worker
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Approval workflow (Admin approves)
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvalRemarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("RestorationLog", restorationLogSchema);
