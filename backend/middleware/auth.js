const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const db = require("../config/db");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) { res.status(401); throw new Error("Not authorized, no token provided"); }
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const [rows] = await db.query("SELECT id,name,email,phone,role,district,block,village,isApproved,isActive,created_at FROM users WHERE id=?", [decoded.id]);
    if (!rows[0]) { res.status(401); throw new Error("Not authorized, user not found"); }
    if (!rows[0].isActive) { res.status(403); throw new Error("Account has been deactivated"); }
    req.user = { ...rows[0], _id: rows[0].id };
    next();
  } catch (error) { res.status(401); throw new Error("Not authorized, token failed"); }
});
module.exports = { protect };
