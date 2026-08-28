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
  const [reportForm, setReportForm] = useState({ pond: "", type: "complaint", message: "" });
  const [reportMessage, setReportMessage] = useState("");
  const [activePanel, setActivePanel] = useState("updates");
  const [activeSection, setActiveSection] = useState(window.location.hash.replace("#", "") || "home");

  const fetchAssignedPonds = async () => {
    try { const res = await api.get("/ponds"); setPonds(res.data); } catch { setPonds([{ _id: "demo-1", pondId: "POND-0042", name: "Chikkahalli lake", village: "Chikkahalli", currentStage: "desilting" }, { _id: "demo-2", pondId: "POND-0057", name: "Hulikunte kere", village: "Hulikunte", currentStage: "bund_strengthening" }]); }
  };

  useEffect(() => {
    fetchAssignedPonds();
    const handleHashChange = () => setActiveSection(window.location.hash.replace("#", "") || "home");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const submitRestorationLog = async (e) => {
    e?.preventDefault();
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

  const submitReport = async (e) => {
    e.preventDefault();
    setReportMessage("");
    try {
      await api.post("/citizen-reports", reportForm);
      window.dispatchEvent(new Event("citizen-report-created"));
      setReportMessage("Issue submitted for review.");
      setReportForm({ pond: "", type: "complaint", message: "" });
    } catch (err) {
      setReportMessage(err.response?.data?.message || "Issue submission failed");
    }
  };

  return (
    <div className={`worker-report-page worker-workspace-page section-${activeSection}`} data-worker-section={activeSection}>
      <section className="worker-home-panel" id="home"><div className="worker-home-copy"><span className="eyebrow">FIELD OPERATIONS / WORKER WORKSPACE</span><h1>Good morning, field team.</h1><p>Review your assigned ponds, complete today&apos;s tasks, and keep restoration records moving.</p></div><div className="worker-home-summary"><strong>{ponds.length}</strong><span>Assigned ponds</span><strong>5</strong><span>Pending tasks</span></div></section>
      <section className="worker-ponds-panel" id="ponds"><div className="worker-section-heading"><div><span className="eyebrow">WORKER WORKSPACE / MY PONDS</span><h2>Assigned ponds</h2><p>Every pond currently assigned to your field team.</p></div><span className="offline-badge">◉ Online sync</span></div><div className="worker-pond-grid">{ponds.map((pond) => <article className="worker-pond-card" key={pond._id}><span className="badge badge-good">{pond.currentStage?.replaceAll("_", " ") || "Active"}</span><h3>{pond.name}</h3><p>⌖ {pond.village || pond.district || "Field site"}</p><small>{pond.pondId || "Assigned restoration pond"}</small></article>)}{!ponds.length && <p className="worker-empty">No ponds are assigned to you yet.</p>}</div></section>
      <section className="worker-profile-panel" id="profile"><span className="worker-profile-large">W</span><div><span className="eyebrow">WORKER PROFILE</span><h2>Field worker account</h2><p>Update your contact and field coverage details with the administration team.</p><div className="worker-profile-fields"><span>Role: Field worker</span><span>Ponds assigned: {ponds.length}</span><span>Sync: Online</span></div></div></section>
      <section className="worker-mobile-dashboard" id="tasks">
        <div className="worker-mobile-greeting"><div><h1>Hello, Ravi!</h1><p>Field Worker Dashboard</p></div><span className="worker-mobile-avatar">R</span></div>
        <div className="worker-mobile-kpis"><article><span className="mobile-kpi-icon pond">≈</span><strong>{ponds.length || 12}</strong><small>My ponds</small></article><article><span className="mobile-kpi-icon task">!</span><strong>5</strong><small>Pending tasks</small></article></div>
        <div className="worker-mobile-section-heading"><h2>Upcoming tasks</h2><button type="button">View all →</button></div>
        <div className="worker-mobile-task"><span className="mobile-task-icon pond">●</span><div><div className="mobile-task-title"><h3>Water quality test</h3><span>Today, 2 PM</span></div><p>{ponds[0]?.name || "Pond Alpha"} · {ponds[0]?.village || "Sector 4"}</p><b className="priority-high">High priority</b></div></div>
        <div className="worker-mobile-task"><span className="mobile-task-icon routine">⚒</span><div><div className="mobile-task-title"><h3>Equipment maintenance</h3><span>Tomorrow</span></div><p>Central Storage Unit</p><b className="priority-routine">Routine</b></div></div>
      </section>
      <section className="field-data-entry" id="add-data">
        <div className="field-entry-heading"><div><span className="eyebrow">WORKER WORKSPACE / ADD DATA</span><h2>Field data entry</h2><p>Capture today&apos;s restoration evidence and water quality readings.</p></div><span className="offline-badge">◉ Online sync</span></div>
        <div className="field-entry-grid">
          <div className="field-entry-main">
            <section className="worker-report-card pond-context-card"><div><span className="eyebrow">SELECTED POND</span><h3>{ponds[0]?.name || "Pond Alpha-7"}</h3><p>{ponds[0]?.village || "North Sector"} · Active restoration</p></div><span className="badge badge-good">Active</span></section>
            <section className="worker-report-card stage-card"><h3 className="field-section-label">◌ Stage update</h3><div className="stage-rail">{[["survey_complete", "Survey"], ["desilting", "Prep"], ["bund_strengthening", "Clear"], ["completed", "Done"]].map(([value, label], index) => <button type="button" key={value} className={logForm.stage === value ? "current" : index < ["survey_complete", "desilting", "bund_strengthening", "completed"].indexOf(logForm.stage) ? "complete" : ""} onClick={() => setLogForm({ ...logForm, stage: value })}><span>{index < ["survey_complete", "desilting", "bund_strengthening", "completed"].indexOf(logForm.stage) ? "✓" : index + 1}</span><small>{label}</small></button>)}</div><div className="stage-notes"><p>Current stage notes for <strong>{logForm.stage.replaceAll("_", " ")}</strong>:</p><span>Equipment on site</span><span>Area marked</span></div></section>
            <section className="worker-report-card quality-entry-card"><h3 className="field-section-label quality-label">● Water quality metrics</h3><form onSubmit={submitWaterQuality}><div className="quality-input-grid"><label>pH level<input type="number" step="0.1" placeholder="e.g. 7.2" value={wqForm.pH} onChange={(e) => setWqForm({ ...wqForm, pH: e.target.value })} /></label><label>Water level (m)<input type="number" step="0.1" placeholder="e.g. 2.4" value={wqForm.waterLevelMeters} onChange={(e) => setWqForm({ ...wqForm, waterLevelMeters: e.target.value })} /></label><label className="wide-field">Turbidity (NTU)<span>Target: &lt; 5</span><input type="number" placeholder="Enter value" value={wqForm.turbidityNTU} onChange={(e) => setWqForm({ ...wqForm, turbidityNTU: e.target.value })} /></label></div><label>Pond<select required value={wqForm.pond} onChange={(e) => setWqForm({ ...wqForm, pond: e.target.value })}><option value="">Select pond</option>{ponds.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.pondId})</option>)}</select></label><button className="btn" type="submit">Save quality reading</button></form></section>
          </div>
          <div className="field-entry-side">
            <section className="worker-report-card photos-card"><div className="field-section-heading"><h3 className="field-section-label">▣ Site photos</h3><span className="geo-badge">⌖ Geo-verified</span></div><div className="photo-grid"><div className="photo-placeholder">Field photo</div><label className="photo-upload"><input type="file" accept="image/*" />＋<span>Add photo</span></label></div><small>Photos are tagged with GPS coordinates when sync is available.</small></section>
            <section className="worker-report-card remarks-card"><h3 className="field-section-label">▤ Field remarks</h3><textarea rows="5" placeholder="Enter specific observations or issues..." value={logForm.remarks} onChange={(e) => setLogForm({ ...logForm, remarks: e.target.value })} /><button className="btn" onClick={submitRestorationLog}>Save entry</button></section>
          </div>
        </div>
      </section>
      <div className="worker-report-hero" id="reports"><div><span className="eyebrow">FIELD OPERATIONS / COMMUNITY CARE</span><h1>Citizen reporting &amp; feedback</h1><p>Document issues from the field and keep your restoration work visible to every village.</p></div><span className="field-status">● Sync complete</span></div>
      <div className="worker-report-grid">
        <section className="worker-report-card report-form-card">
          <div className="report-card-title"><span className="report-icon purple">!</span><div><span className="eyebrow">FIELD OBSERVATION</span><h2>Report an issue</h2></div></div>
          {reportMessage && <div className="worker-report-notice">{reportMessage}</div>}
          <form onSubmit={submitReport}>
            <label>Issue type</label>
            <select value={reportForm.type} onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}>
              <option value="complaint">Water pollution</option>
              <option value="water_level_report">Water level report</option>
              <option value="feedback">General feedback</option>
            </select>
            <label>Pond</label>
            <select required value={reportForm.pond} onChange={(e) => setReportForm({ ...reportForm, pond: e.target.value })}>
              <option value="">Select pond</option>
              {ponds.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.pondId})</option>)}
            </select>
            <label>Description</label>
            <textarea required rows="5" placeholder="Provide details about the issue..." value={reportForm.message} onChange={(e) => setReportForm({ ...reportForm, message: e.target.value })} />
            <button className="btn report-submit" type="submit">↗ Submit report</button>
          </form>
        </section>

        <section className="worker-report-card community-card">
          <div className="report-card-title"><span className="report-icon blue">◎</span><div><span className="eyebrow">SHARED VISIBILITY</span><h2>Recent community reports</h2></div><span className="badge badge-good">Live</span></div>
          <div className="community-list">
            <CommunityReport title="Debris near North Bank" detail="Plastic bags accumulating near the inflow pipe on Willow Pond." status="Investigating" tone="warning" time="2 hrs ago" />
            <CommunityReport title="Broken fencing" detail="The wooden fence beside the east pond needs repair." status="Resolved" tone="success" time="1 day ago" />
            <CommunityReport title="Water clarity improving" detail="Central basin readings are trending better after aerators were installed." status="Monitoring" tone="info" time="2 days ago" />
          </div>
        </section>
      </div>

      <section className="worker-report-card field-entry-card">
        <div className="section-heading"><div><span className="eyebrow">FIELD ENTRY</span><h2>Log a site update</h2></div><div className="segmented"><button type="button" className={activePanel === "updates" ? "selected" : ""} onClick={() => setActivePanel("updates")}>Restoration</button><button type="button" className={activePanel === "quality" ? "selected" : ""} onClick={() => setActivePanel("quality")}>Water quality</button></div></div>
        {message && <div className="worker-report-notice">{message}</div>}
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
      </>}

      <div className="worker-report-card form-card" style={{ display: activePanel === "quality" ? "block" : "none" }}>
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
      </section>
    </div>
  );
};

function CommunityReport({ title, detail, status, tone, time }) {
  return <article className="community-report"><span className={`report-thumb ${tone}`}>{tone === "success" ? "✓" : "!"}</span><div><div className="community-report-heading"><h3>{title}</h3><span className={`report-status ${tone}`}>{status}</span></div><p>{detail}</p><small>◷ {time} · ◉ Field network</small></div></article>;
}

export default WorkerDashboard;
