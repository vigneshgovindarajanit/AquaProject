const express = require("express");
const router = express.Router();
const { getWorkers, getWorkerById, updateWorkerStatus } = require("../controllers/workerController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

// Get all workers (admin only)
router.get("/", protect, authorize("admin"), getWorkers);

// Get single worker
router.get("/:id", protect, getWorkerById);

// Update worker status (admin only)
router.put("/:id/status", protect, authorize("admin"), updateWorkerStatus);

module.exports = router;
