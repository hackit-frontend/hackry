import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import type { User } from "firebase/auth";


interface Props {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<Props> = ({ user, onLogout }) => (
  <AppBar position="static" sx={{ bgcolor: "black" }}>
    <Toolbar>
      <Typography
        variant="h5"
        sx={{
          flexGrow: 1,
          color: "#00ff88",
          fontFamily: "Fira Code",
          textDecoration: "none",
          cursor: "pointer"
        }}
        component={Link}
        to="/"
      >
        HACKRY
      </Typography>


      <Button component={Link} to="/" sx={{ color: "#00ff88" }}>Home</Button>
      <Button component={Link} to="/dashboard" sx={{ color: "#00ff88" }}>Dashboard</Button>
      <Button onClick={onLogout} sx={{ color: "#00ff88" }}>Logout</Button>
    </Toolbar>
  </AppBar>
);

export default Navbar;
