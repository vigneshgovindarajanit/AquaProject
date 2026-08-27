import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    ? [["/admin", "Dashboard", "01"], ["/public", "Pond registry", "02"]]
    : user?.role === "worker"
      ? [["/worker", "My fieldwork", "01"], ["/public", "Pond registry", "02"]]
      : [["/public", "Transparency portal", "01"]];

  return (
    <>
      <aside className="side-nav">
        <Link to={dashboardPath} className="brand"><span className="brand-mark">+</span><span>Aqua<span>Track</span></span></Link>
        <div className="profile-block">
          <span className="profile-avatar">{user?.name?.charAt(0) || "G"}</span>
          <div><small>{user ? user.role : "public access"}</small><strong>{user?.name || "Guest visitor"}</strong></div>
        </div>
        <nav className="nav-links">
          {navItems.map(([path, label, index]) => <Link className={location.pathname === path ? "active" : ""} key={path} to={path}><span>{index}</span>{label}</Link>)}
        </nav>
        <div className="nav-footer">
          <div className="mission-note"><small>FIELD NETWORK</small><strong>24 districts connected</strong><span className="online-dot">● Live sync</span></div>
          {user ? <button className="logout-link" onClick={handleLogout}>Sign out <span>-&gt;</span></button> : <Link className="logout-link" to="/login">Staff sign in <span>-&gt;</span></Link>}
        </div>
      </aside>
      <header className="mobile-header"><Link to={dashboardPath} className="brand"><span className="brand-mark">+</span>AquaTrack</Link>{user ? <button className="text-button" onClick={handleLogout}>Sign out</button> : <Link to="/login">Sign in</Link>}</header>
    </>
  );
};

export default Navbar;
