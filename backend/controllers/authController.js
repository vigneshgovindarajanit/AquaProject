const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register a new user (citizen by default; worker requires admin approval)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, district, block, village } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  // Public self-registration can only create 'citizen' or 'worker' (pending approval).
  // 'admin' accounts must be created by an existing admin via a protected route.
  const safeRole = role === "worker" ? "worker" : "citizen";

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: safeRole,
    district,
    block,
    village,
  });

  res.status(201).json({
    message:
      safeRole === "worker"
        ? "Registration submitted. Your worker account is pending admin approval."
        : "Registration successful.",
    user: user.toSafeObject(),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.role === "worker" && !user.isApproved) {
    res.status(403);
    throw new Error("Your worker account is still pending admin approval");
  }

  res.json({
    user: user.toSafeObject(),
    token: generateToken(user._id),
  });
});

// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Admin creates an admin/worker account directly (pre-approved)
// @route   POST /api/auth/admin-create-user
// @access  Private/Admin
const adminCreateUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, district, block, village } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: role || "worker",
    district,
    block,
    village,
    isApproved: true,
  });

  res.status(201).json(user.toSafeObject());
});

// @desc    Admin approves a pending worker account
// @route   PUT /api/auth/approve/:id
// @access  Private/Admin
const approveWorker = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isApproved = true;
  await user.save();

  res.json({ message: "Worker approved", user: user.toSafeObject() });
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  adminCreateUser,
  approveWorker,
};
