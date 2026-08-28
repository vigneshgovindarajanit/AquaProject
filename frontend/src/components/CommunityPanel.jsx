import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CommunityPanel({ action }) {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending_review");
  const [selectedReport, setSelectedReport] = useState(null);
  const [moderationRemarks, setModerationRemarks] = useState("");
  const [moderating, setModerating] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get(`/citizen-reports?status=${filter}`);
        setReports(data);
        if (data.length && !selectedReport) {
          setSelectedReport(data[0]);
        }
      } catch (error) {
        console.error("Failed to load reports:", error);
      }
      setLoading(false);
    };
    fetchReports();
  }, [filter]);

  const handleModerate = async (decision) => {
    if (!selectedReport) return;
    setModerating(true);
    try {
      await api.put(`/citizen-reports/${selectedReport._id}/moderate`, {
        status: decision === "publish" ? "approved" : "rejected",
        moderationRemarks,
      });
      setReports((current) => current.filter((r) => r._id !== selectedReport._id));
      setSelectedReport(null);
      setModerationRemarks("");
      action(`Issue ${decision === "publish" ? "published" : "rejected"}`);
    } catch (error) {
      console.error("Moderation failed:", error);
    }
    setModerating(false);
  };

  const handleAssignWorker = async () => {
    if (!selectedReport?.pond?.id) return;
    // Navigate to pond assignment with issue context
    navigate(`/admin/ponds/${selectedReport.pond.id}/assign-worker`, {
      state: { issueReport: selectedReport },
    });
  };

  if (loading) return <section className="card table-card"><p>Loading reports...</p></section>;

  return (
    <section className="community-review-layout">
      <aside className="community-reports-list">
        <div className="community-filter">
          <span className="eyebrow">FILTER</span>
          <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
            {["pending_review", "approved", "rejected"].map((status) => (
              <button
                key={status}
                className={filter === status ? "selected" : ""}
                onClick={() => setFilter(status)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "99px",
                  border: "1px solid #ddd",
                  background: filter === status ? "#eeeaff" : "#fff",
                  color: filter === status ? "#4a25d3" : "#484555",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                {status.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "16px", maxHeight: "600px", overflowY: "auto" }}>
          {reports.length === 0 ? (
            <div className="empty-state"><p>No reports to review</p></div>
          ) : (
            reports.map((report) => (
              <button
                key={report._id}
                className={`community-report-item ${selectedReport?._id === report._id ? "selected" : ""}`}
                onClick={() => setSelectedReport(report)}
                style={{
                  display: "grid",
                  gap: "6px",
                  padding: "12px",
                  margin: "8px 0",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: selectedReport?._id === report._id ? "#f0edff" : "#fff",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <strong style={{ fontSize: "12px" }}>{report.pond?.name || "Unknown Pond"}</strong>
                <small style={{ color: "#787587", fontSize: "11px" }}>
                  {report.pond?.village || "Unknown Village"} • {new Date(report.created_at).toLocaleDateString()}
                </small>
                <p style={{ margin: "0", fontSize: "12px", color: "#484555", lineHeight: "1.4" }}>
                  {report.message.substring(0, 60)}...
                </p>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="community-review-details">
        {selectedReport ? (
          <div className="card">
            <div className="review-header">
              <div>
                <span className="eyebrow">ISSUE REPORT</span>
                <h2>{selectedReport.pond?.name}</h2>
                <p style={{ color: "#787587", fontSize: "12px" }}>
                  Reported by citizen • {new Date(selectedReport.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: "99px",
                  fontSize: "10px",
                  fontWeight: "700",
                  background:
                    selectedReport.status === "pending_review" ? "#fff0d5" :
                    selectedReport.status === "approved" ? "#d8f6e1" : "#ffe0df",
                  color:
                    selectedReport.status === "pending_review" ? "#926100" :
                    selectedReport.status === "approved" ? "#12753b" : "#b3241d",
                }}
              >
                {selectedReport.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid #eee" }}>
              <h3 style={{ margin: "0 0 10px", fontSize: "14px" }}>Issue Details</h3>
              <div style={{ fontSize: "13px", lineHeight: "1.6", color: "#484555", padding: "12px", background: "#f5f6f8", borderRadius: "6px" }}>
                {selectedReport.message}
              </div>

              {selectedReport.reported_water_level && (
                <p style={{ marginTop: "12px", fontSize: "12px" }}>
                  <strong>Reported Water Level:</strong> {selectedReport.reported_water_level}m
                </p>
              )}
            </div>

            {selectedReport.status === "pending_review" && (
              <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid #eee" }}>
                <label style={{ display: "grid", gap: "6px" }}>
                  <strong style={{ fontSize: "12px" }}>Moderation Remarks (Optional)</strong>
                  <textarea
                    placeholder="Add any notes for the worker or rejection reason..."
                    value={moderationRemarks}
                    onChange={(e) => setModerationRemarks(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      fontSize: "12px",
                      minHeight: "80px",
                      fontFamily: "inherit",
                    }}
                  />
                </label>

                <div style={{ display: "flex", gap: "8px", marginTop: "12px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleModerate("reject")}
                    disabled={moderating}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      background: "#fff",
                      color: "#484555",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAssignWorker()}
                    disabled={moderating}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "6px",
                      border: "1px solid #4a25d3",
                      background: "#f0edff",
                      color: "#4a25d3",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    Assign Worker
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ display: "grid", placeItems: "center", minHeight: "300px" }}>
            <p style={{ color: "#787587" }}>Select a report to review</p>
          </div>
        )}
      </div>
    </section>
  );
}
