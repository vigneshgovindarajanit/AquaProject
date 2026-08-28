require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const db = require("../config/db");

const users = [
  { name: "Asha Nair", email: "admin@pondtrack.local", password: "Admin@123", role: "admin", district: "Mysuru", block: "Hunsur", village: "Gavadagere" },
  { name: "Ravi Kumar", email: "worker@pondtrack.local", password: "Worker@123", role: "worker", district: "Mysuru", block: "Hunsur", village: "Gavadagere" },
  { name: "Meera S", email: "citizen@pondtrack.local", password: "Citizen@123", role: "citizen", district: "Mysuru", block: "Hunsur", village: "Gavadagere" },
];

const ponds = [
  { pondId: "POND-0001", name: "Gavadagere Community Pond", village: "Gavadagere", block: "Hunsur", district: "Mysuru", state: "Karnataka", lat: 12.3398, lng: 76.2894, type: "irrigation", ownership: "panchayat", stage: "in_progress", health: "fair", scheme: "MGNREGA", allocated: 850000, utilized: 512400, start: "2026-07-15", end: "2026-10-30", contractor: "Mysuru Rural Works", rating: 4.3 },
  { pondId: "POND-0002", name: "Bilikere Temple Tank", village: "Bilikere", block: "Hunsur", district: "Mysuru", state: "Karnataka", lat: 12.2957, lng: 76.2201, type: "temple_tank", ownership: "community", stage: "completed", health: "good", scheme: "Jal Jeevan Mission", allocated: 620000, utilized: 606800, start: "2026-04-08", end: "2026-07-28", contractor: "Kaveri Eco Solutions", rating: 4.7 },
  { pondId: "POND-0003", name: "Hanagodu Harvest Pond", village: "Hanagodu", block: "Hunsur", district: "Mysuru", state: "Karnataka", lat: 12.2381, lng: 76.2629, type: "rainwater_harvesting", ownership: "panchayat", stage: "planning", health: "poor", scheme: "State Water Mission", allocated: 410000, utilized: 42500, start: "2026-09-10", end: "2026-12-20", contractor: "", rating: null },
];

async function upsertUser(user) {
  const password = await bcrypt.hash(user.password, 10);
  await db.query(
    "INSERT INTO users (name,email,password,role,district,block,village,isApproved,isActive) VALUES (?,?,?,?,?,?,?,?,1) ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), district=VALUES(district), block=VALUES(block), village=VALUES(village), isApproved=1, isActive=1",
    [user.name, user.email, password, user.role, user.district, user.block, user.village, 1]
  );
  const [[row]] = await db.query("SELECT id FROM users WHERE email=?", [user.email]);
  return row.id;
}

async function main() {
  await connectDB();
  const [adminId, workerId, citizenId] = await Promise.all(users.map(upsertUser));

  for (const pond of ponds) {
    await db.query(
      "INSERT INTO ponds (pond_id,name,village,block,district,state,lat,lng,pond_type,ownership,current_stage,overall_health_score,scheme_source,budget_allocated,budget_utilized,assigned_worker_id,created_by,planned_start_date,planned_completion_date,contractor_name,contractor_rating) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), current_stage=VALUES(current_stage), overall_health_score=VALUES(overall_health_score), budget_allocated=VALUES(budget_allocated), budget_utilized=VALUES(budget_utilized), assigned_worker_id=VALUES(assigned_worker_id), planned_start_date=VALUES(planned_start_date), planned_completion_date=VALUES(planned_completion_date), contractor_name=VALUES(contractor_name), contractor_rating=VALUES(contractor_rating)",
      [pond.pondId, pond.name, pond.village, pond.block, pond.district, pond.state, pond.lat, pond.lng, pond.type, pond.ownership, pond.stage, pond.health, pond.scheme, pond.allocated, pond.utilized, workerId, adminId, pond.start, pond.end, pond.contractor || null, pond.rating]
    );
  }

  const [pondRows] = await db.query("SELECT id, pond_id FROM ponds WHERE pond_id IN (?, ?, ?)", ponds.map((pond) => pond.pondId));
  const pondByCode = Object.fromEntries(pondRows.map((pond) => [pond.pond_id, pond.id]));
  const now = new Date();
  const timestamp = (hoursAgo) => new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  const readings = [
    ["POND-0001", 7.24, 18.6, 5.8, 2.15, 27.4, "moderate", "Tilapia and dragonfly activity observed near the eastern bund.", "fair", 2],
    ["POND-0002", 7.08, 6.9, 7.1, 2.82, 26.8, "none", "Clear water near inlet; small native fish observed.", "good", 5],
    ["POND-0003", 6.62, 34.2, 3.4, 0.94, 28.1, "high", "Dense algae at the southern edge; desludging recommended.", "poor", 8],
  ];
  for (const [code, ph, turbidity, oxygen, level, temperature, algae, notes, score, hoursAgo] of readings) {
    const recordedAt = timestamp(hoursAgo);
    await db.query(
      "INSERT INTO water_quality_records (pond_id,recorded_date,ph,turbidity_ntu,dissolved_oxygen_mgl,water_level_meters,temperature_c,algae_presence,biodiversity_notes,health_score,source,recorded_by) SELECT ?,?,?,?,?,?,?,?,?,?,'field_visit',? WHERE NOT EXISTS (SELECT 1 FROM water_quality_records WHERE pond_id=? AND source='field_visit' AND DATE(recorded_date)=CURDATE())",
      [pondByCode[code], recordedAt, ph, turbidity, oxygen, level, temperature, algae, notes, score, workerId, pondByCode[code]]
    );
  }

  const logs = [
    ["POND-0001", "in_progress", "Desilting is 68% complete. The inlet channel has been cleared and bund strengthening is under way.", 164000, 30],
    ["POND-0002", "completed", "Stone pitching and inlet repair completed. Community handover meeting held with the water users group.", 98600, 72],
  ];
  for (const [code, stage, remarks, spent, hoursAgo] of logs) {
    await db.query(
      "INSERT INTO restoration_logs (pond_id,stage,update_date,remarks,budget_utilized,photo_geo_verified,digital_signature,updated_by,approval_status,approved_by,approval_remarks) SELECT ?,?,?,?,?,1,?,?, 'approved', ?, 'Verified during site review' WHERE NOT EXISTS (SELECT 1 FROM restoration_logs WHERE pond_id=? AND stage=? AND DATE(update_date)=CURDATE())",
      [pondByCode[code], stage, timestamp(hoursAgo), remarks, spent, `FIELD-${code}-${now.toISOString().slice(0, 10)}`, workerId, adminId, pondByCode[code], stage]
    );
  }

  await db.query(
    "INSERT INTO citizen_reports (pond_id,submitted_by,type,message,reported_water_level,status,moderated_by,moderation_remarks) SELECT ?,?,'water_level','Water level is improving after recent work. Please maintain the inlet screen before the monsoon.',?,'resolved',?,'Field team notified and inlet inspection scheduled.' WHERE NOT EXISTS (SELECT 1 FROM citizen_reports WHERE pond_id=? AND type='water_level' AND DATE(created_at)=CURDATE())",
    [pondByCode["POND-0001"], citizenId, 2.15, adminId, pondByCode["POND-0001"]]
  );

  console.log(`Sample data is ready in ${process.env.DB_NAME}: 3 ponds, current field readings, restoration updates, and a citizen report.`);
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
