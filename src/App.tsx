import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";

import { API_BASE } from "./constants";

const App: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sshKey, setSshKey] = useState<string>("");

  // Detect token from URL after Google OAuth and mark authenticated
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // On initial load, check localStorage for existing token
  useEffect(() => {
    const existing = localStorage.getItem("access_token");
    if (existing) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("access_token");
      setSshKey("");
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  return (
    <>
      <Navbar token={isAuthenticated ? "true" : null} />

      <Routes>
        <Route path="/dashboard" element={<Dashboard sshKey={sshKey} isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
