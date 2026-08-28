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
  const [discussion, setDiscussion] = useState("");
  const [discussionPosts, setDiscussionPosts] = useState([]);
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
      window.dispatchEvent(new Event("citizen-report-created"));
      setReportMsg("Thank you! Your submission has been sent for review.");
      setReportForm({ pond: "", type: "feedback", message: "" });
    } catch (err) {
      setReportMsg(err.response?.data?.message || "Submission failed. Please login as a citizen.");
    }
  };

  const addDiscussionPost = (e) => {
    e.preventDefault();
    if (!discussion.trim()) return;
    setDiscussionPosts([...discussionPosts, { name: user?.name || "You", message: discussion.trim() }]);
    setDiscussion("");
  };

  return (
    <div className="container public-page">
      <div className="public-hero"><div><span className="eyebrow">OPEN WATER DATA / 2026</span><h1>See restoration in motion.</h1><p>Explore the ponds, people and progress shaping healthier villages across Karnataka.</p></div></div>

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

      {user?.role === "citizen" && <section className="citizen-feedback">
        <div className="citizen-feedback-heading"><div><span className="eyebrow">COMMUNITY CARE / OPEN FEEDBACK</span><h2>Citizen reporting &amp; feedback</h2><p>Share what you see around local ponds and help keep restoration moving.</p></div><span className="status-dot">● Community live</span></div>
        <div className="citizen-feedback-grid">
          <section className="card citizen-report-card"><div className="citizen-card-title"><span className="citizen-icon purple">!</span><h3>Report an issue</h3></div>{reportMsg && <p className="citizen-report-message">{reportMsg}</p>}<form onSubmit={submitReport}><label>Issue type<select value={reportForm.type} onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}><option value="complaint">Water pollution</option><option value="water_level_report">Water level report</option><option value="feedback">General feedback</option><option value="adopt_request">Adopt a pond request</option></select></label><label>Location<select value={reportForm.pond} onChange={(e) => setReportForm({ ...reportForm, pond: e.target.value })} required><option value="">Select a pond</option>{ponds.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.pondId})</option>)}</select></label><label>Description<textarea rows="5" placeholder="Provide details about the issue..." value={reportForm.message} onChange={(e) => setReportForm({ ...reportForm, message: e.target.value })} required /></label><label>Photo proof <span className="optional-copy">Optional</span><input className="citizen-file" type="file" accept="image/*" /></label><button className="btn citizen-submit" type="submit">↗ Submit report</button></form></section>
          <div className="citizen-feedback-side"><section className="card citizen-community-card"><div className="citizen-card-title"><span className="citizen-icon blue">◎</span><h3>Recent community reports</h3><button className="text-button">View all</button></div><div className="citizen-report-list"><CitizenReport title="Debris near North Bank" detail="Plastic bags accumulating near the inflow pipe on Willow Pond." status="Investigating" tone="warning" time="2 hrs ago" /><CitizenReport title="Broken fencing" detail="The wooden fence beside the east pond needs repair." status="Resolved" tone="success" time="1 day ago" /></div></section><section className="card citizen-discussion-card"><div className="citizen-card-title"><span className="citizen-icon orange">✦</span><h3>Village discussion board</h3></div><div className="discussion-posts"><div className="discussion-post"><span className="discussion-avatar">SJ</span><p><strong>Sarah J.</strong><small>10:42 AM</small>Has anyone noticed the water clarity improving since the aerators were installed?</p></div><div className="discussion-post"><span className="discussion-avatar purple-avatar">MK</span><p><strong>Mark K.</strong><small>11:15 AM</small>Yes, the turbidity readings dropped significantly this week.</p></div>{discussionPosts.map((post, index) => <div className="discussion-post" key={`${post.message}-${index}`}><span className="discussion-avatar">{post.name.slice(0, 2).toUpperCase()}</span><p><strong>{post.name}</strong><small>Now</small>{post.message}</p></div>)}</div><form className="discussion-form" onSubmit={addDiscussionPost}><input value={discussion} onChange={(e) => setDiscussion(e.target.value)} placeholder="Add to the discussion..." /><button className="btn" type="submit">↗</button></form></section></div>
        </div>
      </section>}
    </div>
  );
};

function CitizenReport({ title, detail, status, tone, time }) {
  return <article className="citizen-report-item"><span className={`citizen-report-thumb ${tone}`}>{tone === "success" ? "✓" : "!"}</span><div><div className="citizen-report-item-heading"><h4>{title}</h4><span className={`citizen-status ${tone}`}>{status}</span></div><p>{detail}</p><small>◷ {time} · ◉ Pond network</small></div></article>;
}

export default PublicPortal;
