const db = require("../config/db");
const recordAudit = (req, action, entityType, entityId, details = {}) => db.query("INSERT INTO audit_logs (actor_id,action,entity_type,entity_id,details,ip_address) VALUES (?,?,?,?,?,?)", [req.user?.id || req.user?._id || null, action, entityType, entityId || null, JSON.stringify(details), req.ip]).catch((error) => console.error("Audit logging failed:", error.message));
module.exports = { recordAudit };
