const asyncHandler = require("express-async-handler");
const RestorationLog = require("../models/RestorationLog");
const Pond = require("../models/Pond");

// @desc    Worker submits a restoration stage update
// @route   POST /api/restoration-logs
// @access  Private/Worker
const createRestorationLog = asyncHandler(async (req, res) => {
  const log = await RestorationLog.create({
    ...req.body,
    updatedBy: req.user._id,
    approvalStatus: "pending",
  });

  res.status(201).json(log);
});

// @desc    Get restoration logs (optionally filter by pond)
// @route   GET /api/restoration-logs?pond=<pondId>
// @access  Private
const getRestorationLogs = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.pond) filter.pond = req.query.pond;
  if (req.user.role === "worker") filter.updatedBy = req.user._id;

  const logs = await RestorationLog.find(filter)
    .populate("pond", "name pondId village")
    .populate("updatedBy", "name role")
    .sort({ createdAt: -1 });

  res.json(logs);
});

// @desc    Admin approves/rejects a restoration log; on approval, pond's currentStage updates
// @route   PUT /api/restoration-logs/:id/review
// @access  Private/Admin
const reviewRestorationLog = asyncHandler(async (req, res) => {
  const { decision, approvalRemarks } = req.body; // decision: "approved" | "rejected"

  const log = await RestorationLog.findById(req.params.id);
  if (!log) {
    res.status(404);
    throw new Error("Restoration log not found");
  }

  log.approvalStatus = decision;
  log.approvedBy = req.user._id;
  log.approvalRemarks = approvalRemarks;
  await log.save();

  if (decision === "approved") {
    await Pond.findByIdAndUpdate(log.pond, {
      currentStage: log.stage,
      $inc: { budgetUtilized: log.budgetUtilized || 0 },
    });
  }

  res.json(log);
});

module.exports = {
  createRestorationLog,
  getRestorationLogs,
  reviewRestorationLog,
};
