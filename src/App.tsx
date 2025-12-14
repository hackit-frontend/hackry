import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./components/Login";
import Home from "./pages/ Home";

import { API_BASE } from "./constants";

const App: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sshKey, setSshKey] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      // no token → go back to login
      // navigate("/login");
        console.log("No token found");
      return;

    }

    // save token
    localStorage.setItem("access_token", token);
    // navigate("/");
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include", // so the backend clears cookie
      });
    } catch (err) {
      console.error("Logout error:", err);
      setSshKey("");
    setIsAuthenticated(false);
    }
  };

  return (
    <>
      <Navbar token={isAuthenticated ? "true" : null} onLogout={handleLogout} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard sshKey={sshKey} isAuthenticated={false} />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
