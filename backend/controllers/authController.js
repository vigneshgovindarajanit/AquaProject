const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const safe = (row) => { if (!row) return null; const { password, ...user } = row; return { ...user, _id: user.id }; };
const token = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, district, block, village } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error("Please provide name, email and password"); }
  const [existing] = await db.query("SELECT id FROM users WHERE email=?", [email]);
  if (existing.length) { res.status(400); throw new Error("A user with this email already exists"); }
  const [result] = await db.query("INSERT INTO users (name,email,phone,password,role,district,block,village,isApproved) VALUES (?,?,?,?,?,?,?,?,?)", [name, email, phone || null, await bcrypt.hash(password, 10), role === "worker" ? "worker" : "citizen", district || null, block || null, village || null, role !== "worker"]);
  const [rows] = await db.query("SELECT * FROM users WHERE id=?", [result.insertId]);
  res.status(201).json({ message: role === "worker" ? "Registration submitted. Your worker account is pending admin approval." : "Registration successful.", user: safe(rows[0]) });
});
const loginUser = asyncHandler(async (req, res) => { const [rows] = await db.query("SELECT * FROM users WHERE email=?", [req.body.email]); const user = rows[0]; if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) { res.status(401); throw new Error("Invalid email or password"); } if (user.role === "worker" && !user.isApproved) { res.status(403); throw new Error("Your worker account is still pending admin approval"); } res.json({ user: safe(user), token: token(user.id) }); });
const getProfile = asyncHandler(async (req, res) => { res.json(req.user); });
const adminCreateUser = asyncHandler(async (req, res) => { const { name, email, phone, password, role, district, block, village } = req.body; const [result] = await db.query("INSERT INTO users (name,email,phone,password,role,district,block,village,isApproved) VALUES (?,?,?,?,?,?,?,?,1)", [name, email, phone || null, await bcrypt.hash(password, 10), role || "worker", district || null, block || null, village || null]); const [rows] = await db.query("SELECT * FROM users WHERE id=?", [result.insertId]); res.status(201).json(safe(rows[0])); });
const approveWorker = asyncHandler(async (req, res) => { const [result] = await db.query("UPDATE users SET isApproved=1 WHERE id=?", [req.params.id]); if (!result.affectedRows) { res.status(404); throw new Error("User not found"); } const [rows] = await db.query("SELECT * FROM users WHERE id=?", [req.params.id]); res.json({ message: "Worker approved", user: safe(rows[0]) }); });
module.exports = { registerUser, loginUser, getProfile, adminCreateUser, approveWorker };
