const mysql = require("mysql2/promise");
let pool;
const schema = [
  `CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL UNIQUE, phone VARCHAR(30), password VARCHAR(255) NOT NULL, role ENUM('admin','worker','citizen') NOT NULL DEFAULT 'citizen', district VARCHAR(120), block VARCHAR(120), village VARCHAR(120), isApproved BOOLEAN DEFAULT FALSE, isActive BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS ponds (id INT AUTO_INCREMENT PRIMARY KEY, pond_id VARCHAR(30) NOT NULL UNIQUE, name VARCHAR(180) NOT NULL, village VARCHAR(120) NOT NULL, block VARCHAR(120) NOT NULL, district VARCHAR(120) NOT NULL, state VARCHAR(120) NOT NULL, lat DECIMAL(10,7) NOT NULL, lng DECIMAL(10,7) NOT NULL, pond_type VARCHAR(40) DEFAULT 'other', ownership VARCHAR(40) DEFAULT 'panchayat', encroachment_status VARCHAR(40) DEFAULT 'clear', current_stage VARCHAR(40) DEFAULT 'identified', overall_health_score VARCHAR(20) DEFAULT 'unknown', scheme_source VARCHAR(40) DEFAULT 'other', budget_allocated DECIMAL(14,2) DEFAULT 0, budget_utilized DECIMAL(14,2) DEFAULT 0, assigned_worker_id INT NULL, created_by INT NOT NULL, is_publicly_visible BOOLEAN DEFAULT TRUE, planned_start_date DATE NULL, planned_completion_date DATE NULL, contractor_name VARCHAR(180), contractor_rating DECIMAL(2,1), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX (district), INDEX (assigned_worker_id))`,
  `CREATE TABLE IF NOT EXISTS restoration_logs (id INT AUTO_INCREMENT PRIMARY KEY, pond_id INT NOT NULL, stage VARCHAR(40) NOT NULL, update_date DATETIME DEFAULT CURRENT_TIMESTAMP, remarks TEXT, budget_utilized DECIMAL(14,2) DEFAULT 0, before_photo_url TEXT, during_photo_url TEXT, after_photo_url TEXT, photo_geo_verified BOOLEAN DEFAULT FALSE, digital_signature TEXT, updated_by INT NOT NULL, approval_status VARCHAR(20) DEFAULT 'pending', approved_by INT NULL, approval_remarks TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (pond_id))`,
  `CREATE TABLE IF NOT EXISTS water_quality_records (id INT AUTO_INCREMENT PRIMARY KEY, pond_id INT NOT NULL, recorded_date DATETIME DEFAULT CURRENT_TIMESTAMP, ph DECIMAL(4,2), turbidity_ntu DECIMAL(10,2), dissolved_oxygen_mgl DECIMAL(10,2), water_level_meters DECIMAL(10,2), temperature_c DECIMAL(10,2), algae_presence VARCHAR(20) DEFAULT 'none', biodiversity_notes TEXT, health_score VARCHAR(20), source VARCHAR(20) DEFAULT 'manual', recorded_by INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (pond_id))`,
  `CREATE TABLE IF NOT EXISTS citizen_reports (id INT AUTO_INCREMENT PRIMARY KEY, pond_id INT NOT NULL, submitted_by INT NOT NULL, type VARCHAR(30) NOT NULL, message TEXT NOT NULL, reported_water_level DECIMAL(10,2), status VARCHAR(30) DEFAULT 'pending_review', moderated_by INT NULL, moderation_remarks TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS audit_logs (id INT AUTO_INCREMENT PRIMARY KEY, actor_id INT NULL, action VARCHAR(120) NOT NULL, entity_type VARCHAR(50) NOT NULL, entity_id INT NULL, details JSON NULL, ip_address VARCHAR(80), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (entity_id, created_at))`,
];
const connectDB = async () => {
  const config = { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, waitForConnections: true, connectionLimit: 10 };
  const admin = await mysql.createConnection(config);
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await admin.end();
  pool = mysql.createPool({ ...config, database: process.env.DB_NAME });
  for (const statement of schema) await pool.query(statement);
  console.log(`MySQL connected: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`);
};
const query = (...args) => { if (!pool) throw new Error("Database is still connecting"); return pool.query(...args); };
module.exports = connectDB;
module.exports.query = query;
