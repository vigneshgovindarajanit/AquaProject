import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const healthBadge = (score) => {
  const map = { good: "badge-good", moderate: "badge-moderate", poor: "badge-poor" };
  return <span className={`badge ${map[score] || ""}`}>{score || "unknown"}</span>;
};

const PublicPortal = () => {
  const { user } = useAuth();
  const [ponds, setPonds] = useState([]);
  const [filters, setFilters] = useState({ district: "", stage: "" });
  const [reportForm, setReportForm] = useState({ pond: "", type: "feedback", message: "" });
  const [reportMsg, setReportMsg] = useState("");
  const demoPonds = [{ _id: "demo-1", pondId: "POND-0042", name: "Chikkahalli lake", village: "Chikkahalli", district: "Kolar", currentStage: "desilting", overallHealthScore: "good" }, { _id: "demo-2", pondId: "POND-0057", name: "Hulikunte kere", village: "Hulikunte", district: "Tumakuru", currentStage: "completed", overallHealthScore: "good" }, { _id: "demo-3", pondId: "POND-0061", name: "Dodda katté", village: "Belur", district: "Mysuru", currentStage: "plantation", overallHealthScore: "moderate" }];

  const fetchPonds = async () => {
    const params = {};
    if (filters.district) params.district = filters.district;
    if (filters.stage) params.stage = filters.stage;
    try { const res = await api.get("/ponds", { params }); setPonds(res.data); } catch { setPonds(demoPonds.filter((pond) => !filters.district || pond.district.toLowerCase().includes(filters.district.toLowerCase()))); }
  };

  useEffect(() => {
    fetchPonds();
    // eslint-disable-next-line
  }, []);

  const submitReport = async (e) => {
    e.preventDefault();
    setReportMsg("");
    try {
      await api.post("/citizen-reports", reportForm);
      setReportMsg("Thank you! Your submission has been sent for review.");
      setReportForm({ pond: "", type: "feedback", message: "" });
    } catch (err) {
      setReportMsg(err.response?.data?.message || "Submission failed. Please login as a citizen.");
    }
  };

  return (
    <div className="container public-page">
      <div className="public-hero"><div><span className="eyebrow">OPEN WATER DATA / 2026</span><h1>See restoration in motion.</h1><p>Explore the ponds, people and progress shaping healthier villages across Karnataka.</p></div><div className="hero-stat"><strong>128</strong><span>ponds monitored<br />in the network</span></div></div>

      <div className="card filter-card">
        <div className="filter-title"><div><span className="eyebrow">EXPLORE THE REGISTRY</span><h2>Find a pond</h2></div><span>{ponds.length} public records</span></div>
        <input
          placeholder="District"
          value={filters.district}
          onChange={(e) => setFilters({ ...filters, district: e.target.value })}
        />
        <select
          value={filters.stage}
          onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
        >
          <option value="">All Stages</option>
          <option value="identified">Identified</option>
          <option value="survey_complete">Survey Complete</option>
          <option value="desilting">Desilting</option>
          <option value="bund_strengthening">Bund Strengthening</option>
          <option value="plantation">Plantation</option>
          <option value="completed">Completed</option>
        </select>
        <button className="btn" onClick={fetchPonds}>Search registry -&gt;</button>
      </div>

      <div className="card table-card">
        <div className="section-heading"><div><span className="eyebrow">PUBLIC RECORDS</span><h2>Restoration across the network</h2></div><span className="status-dot">Updated today</span></div>
        <table>
          <thead>
            <tr>
              <th>Pond ID</th>
              <th>Name</th>
              <th>Village</th>
              <th>District</th>
              <th>Stage</th>
              <th>Health</th>
            </tr>
          </thead>
          <tbody>
            {ponds.map((p) => (
              <tr key={p._id}>
                <td>{p.pondId}</td>
                <td>{p.name}</td>
                <td>{p.village}</td>
                <td>{p.district}</td>
                <td>{p.currentStage}</td>
                <td>{healthBadge(p.overallHealthScore)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.role === "citizen" && (
        <div className="card">
          <h3>Submit Feedback / Complaint / Adopt a Pond</h3>
          {reportMsg && <p>{reportMsg}</p>}
          <form onSubmit={submitReport}>
            <label>Pond</label>
            <select
              value={reportForm.pond}
              onChange={(e) => setReportForm({ ...reportForm, pond: e.target.value })}
              required
            >
              <option value="">Select a pond</option>
              {ponds.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.pondId})
                </option>
              ))}
            </select>

            <label>Type</label>
            <select
              value={reportForm.type}
              onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
            >
              <option value="feedback">Feedback</option>
              <option value="complaint">Complaint</option>
              <option value="water_level_report">Water Level Report</option>
              <option value="adopt_request">Adopt a Pond Request</option>
            </select>

            <label>Message</label>
            <textarea
              rows="4"
              value={reportForm.message}
              onChange={(e) => setReportForm({ ...reportForm, message: e.target.value })}
              required
            />

            <button className="btn" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PublicPortal;
