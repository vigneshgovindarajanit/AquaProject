const asyncHandler = require("express-async-handler");
const db = require("../config/db");

const getWorkers = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name, email, phone, district, block, village, isApproved, isActive, created_at FROM users WHERE role='worker' ORDER BY name ASC"
  );
  
  // Map to standard format
  const workers = rows.map((row) => ({
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    district: row.district,
    block: row.block,
    village: row.village,
    isApproved: row.isApproved,
    isActive: row.isActive,
    created_at: row.created_at,
  }));

  res.json(workers);
});

const getWorkerById = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name, email, phone, district, block, village, isApproved, isActive, created_at FROM users WHERE id=? AND role='worker'",
    [req.params.id]
  );

  if (!rows[0]) {
    res.status(404);
    throw new Error("Worker not found");
  }

  res.json({
    _id: rows[0].id,
    id: rows[0].id,
    name: rows[0].name,
    email: rows[0].email,
    phone: rows[0].phone,
    district: rows[0].district,
    block: rows[0].block,
    village: rows[0].village,
    isApproved: rows[0].isApproved,
    isActive: rows[0].isActive,
    created_at: rows[0].created_at,
  });
});

const updateWorkerStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  
  const [result] = await db.query("UPDATE users SET isActive=? WHERE id=?", [
    isActive,
    req.params.id,
  ]);

  if (!result.affectedRows) {
    res.status(404);
    throw new Error("Worker not found");
  }

  const [rows] = await db.query(
    "SELECT id, name, email, phone, district, block, village, isApproved, isActive FROM users WHERE id=?",
    [req.params.id]
  );

  res.json({
    _id: rows[0].id,
    id: rows[0].id,
    name: rows[0].name,
    email: rows[0].email,
    phone: rows[0].phone,
    district: rows[0].district,
    block: rows[0].block,
    village: rows[0].village,
    isApproved: rows[0].isApproved,
    isActive: rows[0].isActive,
  });
});

module.exports = { getWorkers, getWorkerById, updateWorkerStatus };
