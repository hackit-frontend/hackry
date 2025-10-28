import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./components/Login";
import Home from "./pages/ Home"; // fixed space in import

const App: React.FC = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [sshKey, setSshKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1️⃣ Verify login status
        const authCheck = await fetch("https://backend.hacklab.uz/me", {
          method: "GET",
          credentials: "include", // ensures cookies are sent
        });

        if (authCheck.ok) {
          // const authData = await authCheck.json();
          setToken("true"); 
        } else {
          setToken(null);
        }

        // 2️⃣ Fetch SSH public key (only if logged in)
        if (authCheck.ok) {
          const sshRes = await fetch("https://backend.hacklab.uz/me/ssh/public", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          if (sshRes.ok) {
            const sshData = await sshRes.json();
            setSshKey(sshData.public_key || "");
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://backend.hacklab.uz/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setToken(null);
      setSshKey("");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "black",
        }}
      >
        <CircularProgress sx={{ color: "#00ff88" }} />
      </Box>
    );
  }

  return (
    <>
      <Navbar token={token} onLogout={handleLogout} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard sshKey={sshKey} />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
