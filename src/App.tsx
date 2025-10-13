import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./auth/firebase";
import Home from "./pages/ Home";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import TaskDetails from "./pages/TaskDetails";
import Navbar from "./components/Navbar";
import type { User } from "firebase/auth";
import { Box, CircularProgress, Typography } from "@mui/material";


const App = () => {
  const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);




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
        Booting Hackry...
      </Typography>
    </Box>
  );

  

  if (!user) return <Login />;

  return (
    <Router>
      <Navbar user={user} onLogout={() => signOut(auth)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
