const asyncHandler = require("express-async-handler");
const Pond = require("../models/Pond");

// @desc    Create a new pond (Admin or Worker)
// @route   POST /api/ponds
// @access  Private/Admin,Worker
const createPond = asyncHandler(async (req, res) => {
  const count = await Pond.countDocuments();
  const pondId = `POND-${String(count + 1).padStart(4, "0")}`;

  const pond = await Pond.create({
    ...req.body,
    pondId,
    createdBy: req.user._id,
    assignedWorker: req.user.role === "worker" ? req.user._id : req.body.assignedWorker,
  });

  res.status(201).json(pond);
});

// @desc    Get all ponds (filterable) — Admin sees all, Worker sees assigned, Citizen sees public ones
// @route   GET /api/ponds
// @access  Private
const getPonds = asyncHandler(async (req, res) => {
  const { district, block, village, stage, healthScore } = req.query;
  const filter = {};

  if (district) filter.district = district;
  if (block) filter.block = block;
  if (village) filter.village = village;
  if (stage) filter.currentStage = stage;
  if (healthScore) filter.overallHealthScore = healthScore;

  if (req.user.role === "worker") {
    filter.assignedWorker = req.user._id;
  } else if (req.user.role === "citizen") {
    filter.isPubliclyVisible = true;
  }

  const ponds = await Pond.find(filter).populate("assignedWorker", "name email");
  res.json(ponds);
});

// @desc    Get single pond by ID
// @route   GET /api/ponds/:id
// @access  Private
const getPondById = asyncHandler(async (req, res) => {
  const pond = await Pond.findById(req.params.id).populate("assignedWorker", "name email");

  if (!pond) {
    res.status(404);
    throw new Error("Pond not found");
  }

  if (
    req.user.role === "citizen" &&
    !pond.isPubliclyVisible
  ) {
    res.status(403);
    throw new Error("This pond record is not publicly available");
  }

  res.json(pond);
});

// @desc    Update pond details (Admin, or assigned Worker)
// @route   PUT /api/ponds/:id
// @access  Private/Admin,Worker
const updatePond = asyncHandler(async (req, res) => {
  const pond = await Pond.findById(req.params.id);

  if (!pond) {
    res.status(404);
    throw new Error("Pond not found");
  }

  if (
    req.user.role === "worker" &&
    (!pond.assignedWorker || pond.assignedWorker.toString() !== req.user._id.toString())
  ) {
    res.status(403);
    throw new Error("You are not assigned to this pond");
  }

  Object.assign(pond, req.body);
  await pond.save();

  res.json(pond);
});

// @desc    Delete a pond
// @route   DELETE /api/ponds/:id
// @access  Private/Admin
const deletePond = asyncHandler(async (req, res) => {
  const pond = await Pond.findById(req.params.id);

  if (!pond) {
    res.status(404);
    throw new Error("Pond not found");
  }

  await pond.deleteOne();
  res.json({ message: "Pond removed" });
});

// @desc    Assign a worker to a pond
// @route   PUT /api/ponds/:id/assign
// @access  Private/Admin
const assignWorker = asyncHandler(async (req, res) => {
  const { workerId } = req.body;
  const pond = await Pond.findById(req.params.id);

  if (!pond) {
    res.status(404);
    throw new Error("Pond not found");
  }

  pond.assignedWorker = workerId;
  await pond.save();

  res.json(pond);
});

// @desc    Dashboard summary stats
// @route   GET /api/ponds/stats/summary
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalPonds = await Pond.countDocuments();
  const completed = await Pond.countDocuments({ currentStage: "completed" });
  const underRestoration = await Pond.countDocuments({
    currentStage: { $nin: ["completed", "identified"] },
  });

  const healthBreakdown = await Pond.aggregate([
    { $group: { _id: "$overallHealthScore", count: { $sum: 1 } } },
  ]);

  const districtBreakdown = await Pond.aggregate([
    { $group: { _id: "$district", count: { $sum: 1 } } },
  ]);

  res.json({
    totalPonds,
    completed,
    underRestoration,
    healthBreakdown,
    districtBreakdown,
  });
});

module.exports = {
  createPond,
  getPonds,
  getPondById,
  updatePond,
  deletePond,
  assignWorker,
  getDashboardStats,
};
