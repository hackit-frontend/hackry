import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { auth, provider, signInWithPopup } from "../auth/firebase";
import { Google } from "@mui/icons-material";
import { Typewriter } from "react-simple-typewriter";


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


      <Typography
        variant="body1"
        sx={{
          color: "#00ff88",
          maxWidth: "600px",
          px: 2,
          fontSize: "1.1rem",
          whiteSpace: "pre-line",
          marginTop: "2rem",
          textAlign: "center",
        }}
      >
        <Typewriter
          words={[
            "Welcome to Hackry — a platform for ethical hackers.",
            "Solve real-world cybersecurity challenges.",
            "Sharpen your skills. Climb the leaderboard. Rule the grid.",
          ]}
          
          loop={0}
          cursor
          cursorStyle="_"
          typeSpeed={40}
          deleteSpeed={25}
          delaySpeed={2000}
        />
      </Typography>

    </Box>
  );
};

export default Login;
