import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./components/Login";
import Home from "./pages/ Home";

const App: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sshKey, setSshKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthAndFetchKey = async () => {
      try {
        const sshRes = await fetch("https://backend.hacklab.uz/me/ssh/public", {
          method: "GET",
          credentials: "include", // send cookies cross-site
          headers: { "Content-Type": "application/json" },
        });

        if (sshRes.ok) {
          const sshData = await sshRes.json();
          setIsAuthenticated(true);
          setSshKey(sshData.public_key || "");
        } else {
          setIsAuthenticated(false);
          setSshKey("");
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchKey();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://unrefulgently-unitalicized-greta.ngrok-free.dev/", {
        method: "POST",
        credentials: "include", // so the backend clears cookie
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthenticated(false);
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
