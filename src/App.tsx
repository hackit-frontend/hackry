import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import { fetchSSHKey } from "./services/api";

import { API_BASE } from "./constants";

const App: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sshKey, setSshKey] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.given_name) localStorage.setItem("user_given_name", payload.given_name);
          if (payload.family_name) localStorage.setItem("user_family_name", payload.family_name);
        }
      } catch (err) {
        console.error("Failed to decode token", err);
      }
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    const existing = localStorage.getItem("access_token");
    if (existing) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const loadKey = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        localStorage.clear();
        setIsAuthenticated(false);
        return;
      }

      const key = await fetchSSHKey(token);

      if (!key) {
        if (!localStorage.getItem("access_token")) {
          setIsAuthenticated(false);
          localStorage.clear();
        }
        return;
      }

      setSshKey(key);
    };

    if (isAuthenticated) {
      loadKey();
    }
  }, [isAuthenticated]);

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
      <Navbar token={isAuthenticated ? "true" : null} onLogout={handleLogout} />

      <Routes>
        <Route path="/dashboard" element={<Dashboard sshKey={sshKey} isAuthenticated={isAuthenticated}  />} />
        <Route path="/tasks" element={<Tasks setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={isAuthenticated ? <Tasks setIsAuthenticated={setIsAuthenticated} /> : <Home />} />
        <Route path="/"element={<Home/>}/>
      </Routes>

      <Footer />
    </>
  );
};

export default App;
