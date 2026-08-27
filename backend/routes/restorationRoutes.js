const express = require("express");
const router = express.Router();
const {
  createRestorationLog,
  getRestorationLogs,
  reviewRestorationLog,
} = require("../controllers/restorationController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router
  .route("/")
  .get(protect, getRestorationLogs)
  .post(protect, authorize("worker"), createRestorationLog);

router.put("/:id/review", protect, authorize("admin"), reviewRestorationLog);

module.exports = router;
