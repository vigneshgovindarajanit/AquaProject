const express = require("express");
const router = express.Router();
const {
  createPond,
  getPonds,
  getPondById,
  updatePond,
  deletePond,
  assignWorker,
  getDashboardStats,
} = require("../controllers/pondController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.get("/stats/summary", protect, authorize("admin"), getDashboardStats);

router
  .route("/")
  .get(protect, getPonds)
  .post(protect, authorize("admin", "worker"), createPond);

router
  .route("/:id")
  .get(protect, getPondById)
  .put(protect, authorize("admin", "worker"), updatePond)
  .delete(protect, authorize("admin"), deletePond);

router.put("/:id/assign", protect, authorize("admin"), assignWorker);

module.exports = router;
