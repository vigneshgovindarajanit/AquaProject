const express = require("express");
const router = express.Router();
const {
  createWaterQualityRecord,
  getWaterQualityRecords,
} = require("../controllers/waterQualityController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router
  .route("/")
  .get(protect, getWaterQualityRecords)
  .post(protect, authorize("worker"), createWaterQualityRecord);

module.exports = router;
