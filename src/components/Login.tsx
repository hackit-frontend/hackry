import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { auth, provider, signInWithPopup } from "../auth/firebase";
import { Google } from "@mui/icons-material";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "black",
        color: "#00ff88",
        fontFamily: "Fira Code",
      }}
    >
      <Typography variant="h3" sx={{ mb: 3 }}>
        Hackry
      </Typography>
      <Button
        variant="outlined"
        onClick={handleGoogleLogin}
        sx={{
          color: "#00ff88",
          borderColor: "#00ff88",
          "&:hover": { bgcolor: "#00ff8844" },
        }}
        startIcon={<Google />}
      >
        Login with Google
      </Button>
    </Box>
  );
};

export default Login;
