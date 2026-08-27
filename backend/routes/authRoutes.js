const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  adminCreateUser,
  approveWorker,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);

router.post("/admin-create-user", protect, authorize("admin"), adminCreateUser);
router.put("/approve/:id", protect, authorize("admin"), approveWorker);

module.exports = router;
