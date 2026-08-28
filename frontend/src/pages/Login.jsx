import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "worker") navigate("/worker");
      else navigate("/public");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Restored rural pond">
        <div className="login-visual-copy">
          <h1>Securing our water future.</h1>
          <p>Advanced environmental monitoring and restorative ecological intelligence platform.</p>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="login-brand"><span className="water-mark">&#128167;</span><span>AquaMonitor</span></div>
          <div className="login-intro">
            <h2>Welcome back</h2>
            <p>Log in to access your monitoring dashboard.</p>
          </div>

          {error && <div className="login-error" role="alert">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <div className="login-input"><span aria-hidden="true">&#128100;</span><input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required /></div>

            <label htmlFor="password">Password</label>
            <div className="login-input"><span aria-hidden="true">&#128274;</span><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required /><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div>

            <label className="remember-choice"><input type="checkbox" /> <span>Remember me</span></label>
            <button className="login-submit" type="submit" disabled={submitting}>{submitting ? "Logging in…" : "Login"}</button>
          </form>

          <div className="login-security"><span aria-hidden="true">&#10003;</span> Secured by AquaMonitor Governance Standards</div>
        </div>
      </section>
    </main>
  );
};

export default Login;
