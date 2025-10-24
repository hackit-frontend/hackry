import { useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import { Google } from "@mui/icons-material";
import { Typewriter } from "react-simple-typewriter";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirect user to backend login endpoint
    window.location.href = "https://backend.hacklab.uz/auth/login";
  };

  useEffect(() => {
    // Check if token exists in URL after redirect
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      // Save token to localStorage
      localStorage.setItem("authToken", token);

      // Remove token from URL without reloading
      const url = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, url);

      // Redirect to dashboard
      navigate("/dashboard");
    }
  }, [navigate]);

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
        HackLab
      </Typography>

      <Button
        variant="outlined"
        onClick={handleLogin}
        sx={{
          color: "#00ff88",
          borderColor: "#00ff88",
          "&:hover": { bgcolor: "#00ff8844" },
        }}
        startIcon={<Google />}
      >
        {t("loginWithGoogle")}
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
          words={[t("loginLine1"), t("loginLine2"), t("loginLine3")]}
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
