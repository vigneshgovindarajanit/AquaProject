import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "citizen",
    district: "",
    block: "",
    village: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await register(form);
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <div className="card">
        <h2>Create Account</h2>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />

          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} />

          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>I am registering as</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="citizen">Public Citizen</option>
            <option value="worker">Worker (Rural Pond Manager — requires admin approval)</option>
          </select>

          {form.role === "worker" && (
            <>
              <label>District</label>
              <input name="district" value={form.district} onChange={handleChange} />
              <label>Block</label>
              <input name="block" value={form.block} onChange={handleChange} />
              <label>Village</label>
              <input name="village" value={form.village} onChange={handleChange} />
            </>
          )}

          <button className="btn" type="submit">
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
