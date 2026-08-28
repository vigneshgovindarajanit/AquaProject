const express = require("express");
const { overview, stalledProjects, pondExport, activity } = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const router = express.Router();

router.get("/overview", protect, authorize("admin"), overview);
router.get("/stalled", protect, authorize("admin"), stalledProjects);
router.get("/export/ponds", protect, authorize("admin"), pondExport);
router.get("/activity", protect, authorize("admin"), activity);
module.exports = router;
