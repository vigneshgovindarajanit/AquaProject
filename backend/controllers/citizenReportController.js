const asyncHandler = require("express-async-handler");
const CitizenReport = require("../models/CitizenReport");

// @desc    Citizen submits feedback/complaint/water-level report/adopt request
// @route   POST /api/citizen-reports
// @access  Private/Citizen
const createReport = asyncHandler(async (req, res) => {
  const report = await CitizenReport.create({
    ...req.body,
    submittedBy: req.user._id,
    status: "pending_review",
  });

  res.status(201).json(report);
});

// @desc    Get reports (Admin sees all/pending; Citizen sees own)
// @route   GET /api/citizen-reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === "citizen") {
    filter.submittedBy = req.user._id;
  } else if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.pond) filter.pond = req.query.pond;

  const reports = await CitizenReport.find(filter)
    .populate("pond", "name pondId village")
    .populate("submittedBy", "name")
    .sort({ createdAt: -1 });

  res.json(reports);
});

// @desc    Admin moderates a citizen report (publish/reject/resolve)
// @route   PUT /api/citizen-reports/:id/moderate
// @access  Private/Admin
const moderateReport = asyncHandler(async (req, res) => {
  const { status, moderationRemarks } = req.body;

  const report = await CitizenReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  report.status = status;
  report.moderatedBy = req.user._id;
  report.moderationRemarks = moderationRemarks;
  await report.save();

  res.json(report);
});

module.exports = { createReport, getReports, moderateReport };
