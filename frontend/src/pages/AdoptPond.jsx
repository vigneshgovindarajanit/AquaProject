import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AdoptPond() {
  const { pondId } = useParams();
  const navigate = useNavigate();
  const [pond, setPond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    type: "adoption",
    message: "",
    issueCategory: "water_quality",
    photoUrl: "",
    reportedWaterLevel: "",
  });

  useEffect(() => {
    const fetchPond = async () => {
      try {
        const { data } = await api.get(`/ponds/${pondId}`);
        setPond(data);
      } catch (error) {
        setNotice(error.response?.data?.message || "Failed to load pond");
        setLoading(false);
      }
      setLoading(false);
    };
    fetchPond();
  }, [pondId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        pond: pond._id || pond.id,
        type: "adoption",
        message: form.message,
        reportedWaterLevel: form.reportedWaterLevel || null,
      };
      await api.post("/citizen-reports", payload);
      window.dispatchEvent(new Event("citizen-report-created"));
      setNotice("Thank you! Your adoption report has been submitted for review.");
      setForm({ type: "adoption", message: "", issueCategory: "water_quality", photoUrl: "", reportedWaterLevel: "" });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setNotice(error.response?.data?.message || "Failed to submit report");
    }
    setSubmitting(false);
  };

  if (loading) return <main className="container"><p>Loading pond details...</p></main>;

  return (
    <main className="container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADOPT A POND</span>
          <h1>{pond?.name || "Pond Details"}</h1>
          <p>Help restore {pond?.village || "this water body"} by reporting issues and supporting restoration efforts</p>
        </div>
      </div>

      {notice && <div className={`overview-notice ${notice.includes("submitted") ? "" : "error"}`}>{notice}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
        <section className="card">
          <span className="eyebrow">POND DETAILS</span>
          <h2>{pond?.name}</h2>
          <div style={{ marginTop: "14px", fontSize: "13px", lineHeight: "1.8" }}>
            <p><strong>Village:</strong> {pond?.village}</p>
            <p><strong>Block:</strong> {pond?.block}</p>
            <p><strong>District:</strong> {pond?.district}</p>
            <p><strong>Current Stage:</strong> <span style={{ textTransform: "capitalize" }}>{pond?.currentStage?.replaceAll("_", " ")}</span></p>
            <p><strong>Health Status:</strong> <span style={{ textTransform: "capitalize", color: pond?.overallHealthScore === "good" ? "#198645" : pond?.overallHealthScore === "moderate" ? "#c46b00" : "#c33a31" }}>{pond?.overallHealthScore || "Unknown"}</span></p>
            <p><strong>Coordinates:</strong> {pond?.geoLocation?.lat}, {pond?.geoLocation?.lng}</p>
          </div>
        </section>

        <section className="card pond-registration-form">
          <div className="section-heading">
            <div>
              <span className="eyebrow">REPORT ISSUES</span>
              <h2>Submit adoption issues</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <label style={{ display: "grid", gap: "4px" }}>
              <strong>Issue Category</strong>
              <select
                value={form.issueCategory}
                onChange={(e) => setForm({ ...form, issueCategory: e.target.value })}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
              >
                <option value="water_quality">Water Quality Issues</option>
                <option value="algae_growth">Algae/Weed Growth</option>
                <option value="encroachment">Encroachment</option>
                <option value="pollution">Pollution/Debris</option>
                <option value="structural">Structural Damage</option>
                <option value="low_water_level">Low Water Level</option>
                <option value="other">Other Issues</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: "4px" }}>
              <strong>Description of Issues</strong>
              <textarea
                required
                placeholder="Describe the issues you've observed with this pond..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", minHeight: "100px", fontFamily: "inherit" }}
              />
            </label>

            <label style={{ display: "grid", gap: "4px" }}>
              <strong>Current Water Level (meters) - Optional</strong>
              <input
                type="number"
                step="0.1"
                placeholder="e.g., 2.5"
                value={form.reportedWaterLevel}
                onChange={(e) => setForm({ ...form, reportedWaterLevel: e.target.value })}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
              />
            </label>

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  padding: "10px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !form.message.trim()}
                style={{
                  padding: "10px 16px",
                  border: "0",
                  borderRadius: "6px",
                  background: submitting || !form.message.trim() ? "#ccc" : "#4a25d3",
                  color: "#fff",
                  cursor: submitting || !form.message.trim() ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {submitting ? "Submitting..." : "Submit Issue Report"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
