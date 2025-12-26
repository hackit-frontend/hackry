import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


interface Props {
  token?: string | null;
}

const Navbar: React.FC<Props> = ({ token }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "uz" ? "en" : "uz");
  };


  //   flow: "implicit", // popup
  //   onSuccess: async (tokenResponse) => {
  //     console.log("Google Token:", tokenResponse);

  //     await fetch("https://unrefulgently-unitalicized-greta.ngrok-free.dev/auth/google", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ access_token: tokenResponse.access_token }),
  //     });
  //   },
  //   onError: () => {
  //     console.log("Google Login Failed");
  //   },
  // });
  const handelLogin = () => { 
    window.location.href = "https://unrefulgently-unitalicized-greta.ngrok-free.dev/auth/login";
  }

  return (
    <AppBar position="static" sx={{ bgcolor: "black", boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            color: "#00FF00",
            fontFamily: "Fira Code",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          HackLab
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component={Link}
            to="/dashboard"
            sx={{ color: "#00FF00", fontFamily: "Fira Code" }}
          >
            {t("navDashboard")}
          </Button>

          {!token && (
            <Button
              onClick={handelLogin}
              sx={{
                background: "linear-gradient(135deg, #00FF00 0%, #00ffaa 100%)",
                color: "#000",
                fontFamily: "Fira Code",
                fontWeight: 600,
                px: 3,
                py: 1,
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": {
                  boxShadow: "0 0 20px rgba(0, 255, 0, 0.4)",
                },
              }}
            >
              {t("home.cta")}
            </Button>
          )}

          <Button
            onClick={toggleLanguage}
            sx={{
              color: "#00FF00",
              border: "1px solid #00FF00",
              borderRadius: "8px",
              px: 1.5,
              fontFamily: "Fira Code",
              "&:hover": { bgcolor: "#00FF0044" },
            }}
          >
            {i18n.language === "uz" ? "EN" : "UZ"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
