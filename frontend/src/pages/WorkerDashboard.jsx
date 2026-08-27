import React, { useEffect, useState } from "react";
import api from "../api/axios";

const WorkerDashboard = () => {
  const [ponds, setPonds] = useState([]);
  const [logForm, setLogForm] = useState({
    pond: "",
    stage: "survey_complete",
    remarks: "",
    budgetUtilized: 0,
  });
  const [wqForm, setWqForm] = useState({
    pond: "",
    pH: "",
    turbidityNTU: "",
    dissolvedOxygenMgL: "",
    waterLevelMeters: "",
    algaePresence: "none",
  });
  const [message, setMessage] = useState("");
  const [activePanel, setActivePanel] = useState("updates");

  const fetchAssignedPonds = async () => {
    try { const res = await api.get("/ponds"); setPonds(res.data); } catch { setPonds([{ _id: "demo-1", pondId: "POND-0042", name: "Chikkahalli lake", village: "Chikkahalli", currentStage: "desilting" }, { _id: "demo-2", pondId: "POND-0057", name: "Hulikunte kere", village: "Hulikunte", currentStage: "bund_strengthening" }]); }
  };

  useEffect(() => {
    fetchAssignedPonds();
  }, []);

  const submitRestorationLog = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/restoration-logs", logForm);
      setMessage("Restoration update submitted for admin approval.");
      setLogForm({ pond: "", stage: "survey_complete", remarks: "", budgetUtilized: 0 });
    } catch (err) {
      setMessage(err.response?.data?.message || "Submission failed");
    }
  };

  const submitWaterQuality = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/water-quality", wqForm);
      setMessage("Water quality record logged successfully.");
      setWqForm({
        pond: "",
        pH: "",
        turbidityNTU: "",
        dissolvedOxygenMgL: "",
        waterLevelMeters: "",
        algaePresence: "none",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="container worker-page">
      <div className="page-heading"><div><span className="eyebrow">FIELD OPERATIONS / TODAY</span><h1>Your fieldwork, Ravi</h1><p>Two active assignments need your attention this week.</p></div><span className="field-status">● Sync complete</span></div>
      <section className="metric-grid"><div className="metric-card"><small>Assigned ponds</small><strong>{ponds.length || "--"}</strong><span className="trend neutral">Across 2 villages</span></div><div className="metric-card"><small>Tasks due today</small><strong>04</strong><span className="trend down">2 high priority</span></div><div className="metric-card"><small>Updates approved</small><strong>18</strong><span className="trend up">+3 this week</span></div></section>
      {message && <div className="card">{message}</div>}

      <div className="card table-card">
        <div className="section-heading"><div><span className="eyebrow">MY ASSIGNMENTS</span><h2>Active ponds</h2></div><span className="badge badge-good">Field mode</span></div>
        <table>
          <thead>
            <tr>
              <th>Pond ID</th>
              <th>Name</th>
              <th>Village</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {ponds.map((p) => (
              <tr key={p._id}>
                <td>{p.pondId}</td>
                <td>{p.name}</td>
                <td>{p.village}</td>
                <td><div className="progress-label"><span>{p.currentStage?.replaceAll("_", " ")}</span><b>{p.currentStage === "desilting" ? "46" : "68"}%</b></div><div className="mini-progress"><span style={{ width: p.currentStage === "desilting" ? "46%" : "68%" }} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card form-card">
        <div className="section-heading"><div><span className="eyebrow">FIELD ENTRY</span><h2>Log a site update</h2></div><div className="segmented"><button className={activePanel === "updates" ? "selected" : ""} onClick={() => setActivePanel("updates")}>Restoration</button><button className={activePanel === "quality" ? "selected" : ""} onClick={() => setActivePanel("quality")}>Water quality</button></div></div>
        {activePanel !== "updates" ? null : <>
        <form onSubmit={submitRestorationLog}>
          <label>Pond</label>
          <select
            value={logForm.pond}
            onChange={(e) => setLogForm({ ...logForm, pond: e.target.value })}
            required
          >
            <option value="">Select pond</option>
            {ponds.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.pondId})
              </option>
            ))}
          </select>

          <label>Stage</label>
          <select
            value={logForm.stage}
            onChange={(e) => setLogForm({ ...logForm, stage: e.target.value })}
          >
            <option value="survey_complete">Survey Complete</option>
            <option value="desilting">Desilting</option>
            <option value="bund_strengthening">Bund Strengthening</option>
            <option value="plantation">Plantation</option>
            <option value="completed">Completed</option>
          </select>

          <label>Remarks</label>
          <textarea
            rows="3"
            value={logForm.remarks}
            onChange={(e) => setLogForm({ ...logForm, remarks: e.target.value })}
          />

          <label>Budget Utilized (this stage)</label>
          <input
            type="number"
            value={logForm.budgetUtilized}
            onChange={(e) => setLogForm({ ...logForm, budgetUtilized: e.target.value })}
          />

          <button className="btn" type="submit">
            Submit for Approval
          </button>
        </form>
      </>}</div>

      <div className="card form-card" style={{ display: activePanel === "quality" ? "block" : "none" }}>
        <h3>Log Water Quality Reading</h3>
        <form onSubmit={submitWaterQuality}>
          <label>Pond</label>
          <select
            value={wqForm.pond}
            onChange={(e) => setWqForm({ ...wqForm, pond: e.target.value })}
            required
          >
            <option value="">Select pond</option>
            {ponds.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.pondId})
              </option>
            ))}
          </select>

          <label>pH</label>
          <input
            type="number"
            step="0.1"
            value={wqForm.pH}
            onChange={(e) => setWqForm({ ...wqForm, pH: e.target.value })}
          />

          <label>Turbidity (NTU)</label>
          <input
            type="number"
            value={wqForm.turbidityNTU}
            onChange={(e) => setWqForm({ ...wqForm, turbidityNTU: e.target.value })}
          />

          <label>Dissolved Oxygen (mg/L)</label>
          <input
            type="number"
            step="0.1"
            value={wqForm.dissolvedOxygenMgL}
            onChange={(e) => setWqForm({ ...wqForm, dissolvedOxygenMgL: e.target.value })}
          />

          <label>Water Level (meters)</label>
          <input
            type="number"
            step="0.1"
            value={wqForm.waterLevelMeters}
            onChange={(e) => setWqForm({ ...wqForm, waterLevelMeters: e.target.value })}
          />

          <label>Algae Presence</label>
          <select
            value={wqForm.algaePresence}
            onChange={(e) => setWqForm({ ...wqForm, algaePresence: e.target.value })}
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="heavy_bloom">Heavy Bloom</option>
          </select>

          <button className="btn" type="submit">
            Log Reading
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkerDashboard;
