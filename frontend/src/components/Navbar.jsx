import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "worker" ? "/worker" : "/public";
  const navItems = user?.role === "admin"
    ? [["/admin", "Dashboard", "▦"], ["/admin/ponds", "Ponds", "▱"], ["/admin/adopt", "Adopt a Pond", "♡"], ["/admin/approvals", "Projects", "⚒"], ["/admin/workers", "Workers", "♧"], ["/admin/analytics", "Analytics", "▥"], ["/admin/reports", "Reports", "▤"], ["/admin/settings", "Settings", "⚙"]]
    : user?.role === "worker"
      ? [["/worker", "Home", "⌂"], ["/worker#ponds", "My Ponds", "≈"], ["/worker#tasks", "Tasks", "!"], ["/worker#add-data", "Field Data", "+"], ["/worker#reports", "Reports", "▤"]]
      : [["/public", "Transparency portal", "01"]];
  const isWorkerLinkActive = (path) => user?.role === "worker" && location.pathname === "/worker" && (path === "/worker" ? !location.hash : Boolean(location.hash) && path === `/worker${location.hash}`);

  return (
    <>
      <aside className={`side-nav ${location.pathname === "/admin" ? "overview-side-nav" : ""} ${user?.role === "worker" ? "worker-side-nav" : ""}`}>
        <Link to={dashboardPath} className="brand"><span className="brand-mark">+</span><span>Aqua<span>Restor</span></span></Link>
        <div className="profile-block">
          <span className="profile-avatar">{user?.name?.charAt(0) || "G"}</span>
          <div><small>{user ? user.role : "public access"}</small><strong>{user?.name || "Guest visitor"}</strong></div>
        </div>
        {user?.role === "admin" && <button className="sidebar-assignment-button" onClick={() => navigate("/admin/workers")}>＋ New Assignment</button>}
        <nav className="nav-links">
          {navItems.map(([path, label, index]) => <NavLink className={({ isActive }) => `sidebar-link ${(user?.role === "worker" ? isWorkerLinkActive(path) : isActive) ? "active" : ""}`} end={path === "/admin"} key={path} to={path}><span>{index}</span>{label}</NavLink>)}
        </nav>
        <div className="nav-footer">
          {user?.role !== "admin" && <div className="mission-note"><small>FIELD NETWORK</small><strong>24 districts connected</strong><span className="online-dot">● Live sync</span></div>}
          {user ? <button className="logout-link" onClick={handleLogout}>{user.role === "admin" ? "Logout" : "Sign out"} <span>-&gt;</span></button> : <Link className="logout-link" to="/login">Staff sign in <span>-&gt;</span></Link>}
        </div>
      </aside>
      <header className="mobile-header"><Link to={dashboardPath} className="brand"><span className="brand-mark">+</span>AquaRestor</Link>{user ? <button className="text-button" onClick={handleLogout}>Sign out</button> : <Link to="/login">Sign in</Link>}</header>
    </>
  );
};

export default Navbar;
