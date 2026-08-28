import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
const getId = (item) => item?._id || item?.id;
const getPriority = (pond) => pond.overallHealthScore === "poor" ? "critical" : pond.overallHealthScore === "moderate" ? "high" : "low";
const priorityLabel = (priority) => priority === "critical" ? "Critical" : priority.charAt(0).toUpperCase() + priority.slice(1);

export default function WorkerManagement() {
  const [workers, setWorkers] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPondId, setSelectedPondId] = useState("");
  const [assignPriority, setAssignPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [notice, setNotice] = useState("");

  const loadData = async () => {
    try {
      const [workersResponse, pondsResponse] = await Promise.all([api.get("/workers"), api.get("/ponds")]);
      setWorkers(workersResponse.data || []);
      setPonds(pondsResponse.data || []);
    } catch (error) {
      setNotice(error.response?.data?.message || "Failed to sync latest assignment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const workersWithStats = useMemo(() => workers.map((worker) => {
    const assignedPonds = ponds.filter((pond) => getId(pond.assignedWorker) === getId(worker));
    const completedPonds = assignedPonds.filter((pond) => pond.currentStage === "completed");
    const activePonds = assignedPonds.filter((pond) => pond.currentStage !== "completed");
    return { ...worker, assignedPonds, completedPonds, activePonds, workload: activePonds.length };
  }), [workers, ponds]);

  const filteredWorkers = useMemo(() => workersWithStats
    .filter((worker) => filter === "assigned" ? worker.assignedPonds.length > 0 : filter === "unassigned" ? worker.assignedPonds.length === 0 : true)
    .filter((worker) => {
      const term = searchQuery.trim().toLowerCase();
      return !term || [worker.name, worker.email, worker.district, worker.block, worker.village].filter(Boolean).join(" ").toLowerCase().includes(term);
    })
    .sort((first, second) => first.workload - second.workload), [workersWithStats, filter, searchQuery]);

  const availablePonds = useMemo(() => ponds
    .filter((pond) => pond.currentStage !== "completed")
    .sort((first, second) => priorityOrder[getPriority(first)] - priorityOrder[getPriority(second)]), [ponds]);

  const assignPond = async () => {
    const pond = availablePonds.find((item) => String(getId(item)) === String(selectedPondId));
    if (!selectedWorker || !pond) {
      setNotice("Select a pond before confirming the assignment.");
      return;
    }
    setAssigning(true);
    try {
      await api.put(`/ponds/${getId(pond)}/assign`, { workerId: getId(selectedWorker), priority: assignPriority });
      setPonds((current) => current.map((item) => getId(item) === getId(pond) ? { ...item, assignedWorker: { _id: getId(selectedWorker), name: selectedWorker.name, email: selectedWorker.email } } : item));
      setSelectedPondId("");
      setNotice(`${pond.name} assigned to ${selectedWorker.name} at ${priorityLabel(assignPriority)} priority.`);
    } catch (error) {
      setNotice(error.response?.data?.message || "Assignment failed.");
    } finally {
      setAssigning(false);
    }
  };

  const removeAssignment = async (pond) => {
    try {
      await api.put(`/ponds/${getId(pond)}/assign`, { workerId: null });
      setPonds((current) => current.map((item) => getId(item) === getId(pond) ? { ...item, assignedWorker: null } : item));
      setNotice(`${pond.name} is now unassigned.`);
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not remove assignment.");
    }
  };

  if (loading) return <div className="worker-page"><p className="worker-empty">Loading worker assignments...</p></div>;

  return <div className="worker-page">
    <div className="worker-page-heading"><div><span className="eyebrow">AQUATRACK / WORKER MANAGEMENT</span><h1>Worker Assignment &amp; Workload</h1><p>Manage worker assignments based on workload and priority.</p></div><button className="worker-primary-button" onClick={() => document.querySelector(".worker-assignment")?.scrollIntoView({ behavior: "smooth" })}>＋ New Assignment</button></div>
    {notice && <div className="worker-notice">{notice}</div>}
    <div className="worker-workspace">
      <section className="worker-list-panel"><div className="worker-list-tools"><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="⌕  Search workers by name or role..." aria-label="Search workers" /><div className="worker-filter-tabs">{[["all", "All Workers"], ["assigned", "Assigned"], ["unassigned", "Unassigned"]].map(([value, label]) => <button className={filter === value ? "active" : ""} key={value} onClick={() => setFilter(value)}>{label}{value === "unassigned" && <i />}</button>)}</div></div><div className="worker-list-scroll">{filteredWorkers.length ? filteredWorkers.map((worker) => <button className={`worker-list-card ${getId(selectedWorker) === getId(worker) ? "selected" : ""}`} key={getId(worker)} onClick={() => { setSelectedWorker(worker); setSelectedPondId(""); }}><span className="worker-avatar">{worker.name?.slice(0, 2).toUpperCase()}</span><span className="worker-list-copy"><strong>{worker.name}</strong><small>{worker.roleTitle || "Field worker"}</small><span className="worker-progress"><i style={{ width: `${Math.min(worker.workload / 3 * 100, 100)}%` }} /><em>{worker.workload}/3 Projects</em></span></span><b className={`worker-status ${worker.workload === 0 ? "available" : worker.workload >= 3 ? "busy" : "assigned"}`}>{worker.workload === 0 ? "Available" : "Assigned"}</b></button>) : <p className="worker-empty">No workers found.</p>}</div></section>
      <section className="worker-detail-panel">{selectedWorker ? <><header className="worker-profile"><span className="worker-profile-avatar">{selectedWorker.name?.slice(0, 2).toUpperCase()}</span><div className="worker-profile-copy"><h2>{selectedWorker.name} <span>✓</span></h2><p>{selectedWorker.roleTitle || "Field worker"} • {selectedWorker.district || "Regional team"}</p><div><span>☎ {selectedWorker.phone || "Phone unavailable"}</span><span>✉ {selectedWorker.email}</span>{selectedWorker.block && <span>⌖ {selectedWorker.block}</span>}</div></div><span className={`worker-profile-state ${selectedWorker.workload >= 3 ? "busy" : ""}`}>{selectedWorker.workload >= 3 ? "At capacity" : "Active"}</span></header><div className="worker-detail-content"><div className="worker-section"><h3>▣ Current Workload</h3>{selectedWorker.assignedPonds.length ? <div className="worker-assignments">{selectedWorker.assignedPonds.map((pond) => <article className="worker-assignment-card" key={getId(pond)}><div><h4>{pond.name}</h4><p>⌖ {pond.district || pond.village || "Field site"} <span>•</span> {pond.currentStage?.replaceAll("_", " ")}</p></div><span className={`worker-priority ${getPriority(pond)}`}>{priorityLabel(getPriority(pond))}</span><div className="worker-assignment-bar"><i style={{ width: pond.currentStage === "completed" ? "100%" : "45%" }} /></div><button onClick={() => removeAssignment(pond)}>Remove assignment</button></article>)}</div> : <div className="worker-empty assignment-empty">No ponds assigned to this worker.</div>}</div><div className="worker-assignment"><h3>＋ Assign to Project</h3><p>Select a pending restoration pond. Critical health issues are listed first.</p><label>Pending restoration pond<select value={selectedPondId} onChange={(event) => setSelectedPondId(event.target.value)}><option value="">Choose a pond</option>{availablePonds.map((pond) => <option value={getId(pond)} key={getId(pond)}>{pond.name} • {priorityLabel(getPriority(pond))} priority</option>)}</select></label><label>Assignment priority<select value={assignPriority} onChange={(event) => setAssignPriority(event.target.value)}><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><button className="worker-primary-button full" disabled={assigning || !selectedPondId} onClick={assignPond}>{assigning ? "Assigning..." : "Confirm Assignment"}</button></div></div></> : <div className="worker-empty worker-select-empty"><span>◎</span><h2>Select a worker</h2><p>Choose a worker to view their details and manage pond assignments.</p></div>}</section>
    </div>
  </div>;
}
