/**
 * Run once to create the first Admin account:
 *   node seed/createAdmin.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "admin@pondtrack.local" });
  if (existing) {
    console.log("Admin already exists.");
    process.exit(0);
  }

  await User.create({
    name: "System Admin",
    email: "admin@pondtrack.local",
    password: "Admin@123",
    role: "admin",
    isApproved: true,
  });

  console.log("Admin created: admin@pondtrack.local / Admin@123");
  process.exit(0);
};

run();
