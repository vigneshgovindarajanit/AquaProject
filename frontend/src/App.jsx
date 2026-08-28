import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicPortal from "./pages/PublicPortal";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminWorkspace from "./pages/AdminWorkspace";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const isAuthPage = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public" element={<PublicPortal />} />

        <Route
          path="/worker"
          element={
            <PrivateRoute roles={["worker"]}>
              <WorkerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/:section"
          element={<PrivateRoute roles={["admin"]}><AdminWorkspace /></PrivateRoute>}
        />
      </Routes>
    </>
  );
};

export default App;
