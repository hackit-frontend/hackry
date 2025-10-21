import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

import Home from "./pages/ Home";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import TaskDetails from "./pages/TaskDetails";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const ADMIN_EMAIL = "ludlowbecker@gmail.com";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setToken(authToken);

      try {
        // If JWT, decode payload
        const payload = JSON.parse(atob(authToken.split(".")[1]));
        setUserEmail(payload.email);
      } catch (err) {
        console.error("Failed to parse token:", err);
      }
    }
    setLoading(false);
  }, []);

  const isAdmin = userEmail === ADMIN_EMAIL;

  if (loading)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#000",
        }}
      >
        <CircularProgress sx={{ color: "#00ff88", mb: 2 }} />
        <Typography sx={{ color: "#00ff88", fontFamily: "Fira Code", fontSize: "1.2rem" }}>
          Booting HackLab...
        </Typography>
      </Box>
    );

  return (
    <Router>
      {/* Show Navbar only if logged in */}
      {token && <Navbar
        userEmail={userEmail}
        onLogout={() => {
          localStorage.removeItem("authToken");
          window.location.href = "/login"; 
        }}
      />}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={token ? <Navigate to="/home" /> : <Login />} />
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task/:id"
          element={
            <ProtectedRoute token={token}>
              <TaskDetails />
            </ProtectedRoute>
          }
        />
        {isAdmin && (
          <Route
            path="/admin"
            element={
              <ProtectedRoute token={token}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        )}

        {/* Fallback for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Show Footer only if logged in */}
      {token && <Footer />}
    </Router>
  );
};

export default App;
