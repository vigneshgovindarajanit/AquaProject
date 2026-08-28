const express = require("express");
const router = express.Router();
const {
  createReport,
  getReports,
  moderateReport,
} = require("../controllers/citizenReportController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router
  .route("/")
  .get(protect, getReports)
  .post(protect, authorize("citizen", "worker"), createReport);

router.put("/:id/moderate", protect, authorize("admin"), moderateReport);

module.exports = router;
