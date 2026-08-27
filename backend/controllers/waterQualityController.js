const asyncHandler = require("express-async-handler");
const WaterQualityRecord = require("../models/WaterQualityRecord");
const Pond = require("../models/Pond");

// @desc    Worker logs a water quality record
// @route   POST /api/water-quality
// @access  Private/Worker
const createWaterQualityRecord = asyncHandler(async (req, res) => {
  const record = await WaterQualityRecord.create({
    ...req.body,
    recordedBy: req.user._id,
  });

  // Keep the pond's overall health score in sync with the latest reading
  await Pond.findByIdAndUpdate(record.pond, {
    overallHealthScore: record.healthScore,
  });

  res.status(201).json(record);
});

// @desc    Get water quality history for a pond (for trend charts)
// @route   GET /api/water-quality?pond=<pondId>
// @access  Private
const getWaterQualityRecords = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.pond) filter.pond = req.query.pond;

  const records = await WaterQualityRecord.find(filter).sort({ recordedDate: 1 });
  res.json(records);
});

module.exports = { createWaterQualityRecord, getWaterQualityRecords };
