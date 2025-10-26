import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./components/Login";
import Callback from "./pages/Callback";
import Home from "./pages/ Home";

const App: React.FC = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [userEmail, setUserEmail] = useState<string>("");
  const [sshKey, setSshKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user info if token exists
  useEffect(() => {
    const fetchUserData = async () => {

      try { // Fetch SSH key
        const sshRes = await fetch("https://backend.hacklab.uz/me/ssh/public", {
            method: 'GET',
            credentials: 'include',  // Critical: Sends cookies cross-site
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("SSH Key Response:", sshRes);
        if (sshRes.ok) {
          const sshData = await sshRes.json();
          setSshKey(sshData.public_key || "");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        localStorage.removeItem("authToken");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Navbar is always visible */}
      <Navbar
        userEmail={userEmail}
        token={token}
        onLogout={() => {
          localStorage.removeItem("authToken");
          setToken(null);
          setUserEmail("");
          setSshKey("");
          navigate("/login");
        }}
      />

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard sshKey={sshKey} />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
