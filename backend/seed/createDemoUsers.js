require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const db = require("../config/db");

const demoUsers = [
  { name: "Field Worker", email: "worker@pondtrack.local", password: "Worker@123", role: "worker", isApproved: 1 },
  { name: "Public Citizen", email: "citizen@pondtrack.local", password: "Citizen@123", role: "citizen", isApproved: 1 },
];

(async () => {
  try {
    await connectDB();
    for (const user of demoUsers) {
      const password = await bcrypt.hash(user.password, 10);
      await db.query(
        "INSERT INTO users (name, email, password, role, isApproved, isActive) VALUES (?, ?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), role=VALUES(role), isApproved=VALUES(isApproved), isActive=1",
        [user.name, user.email, password, user.role, user.isApproved]
      );
    }
    console.log("Demo worker and citizen accounts are ready.");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
