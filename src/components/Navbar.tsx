import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  token?: string | null;
  onLogout: () => void;
}

const Navbar: React.FC<Props> = ({ token, onLogout }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "uz" ? "en" : "uz");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "black", boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            color: "#00ff88",
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
            sx={{ color: "#00ff88", fontFamily: "Fira Code" }}
          >
            {t("navDashboard")}
          </Button>

          {/* Show Login or Logout */}
          {token ? (
            <Button
              onClick={onLogout}
              sx={{
                color: "#00ff88",
                fontFamily: "Fira Code",
                border: "1px solid #00ff88",
                borderRadius: "8px",
                "&:hover": { bgcolor: "#00ff8844" },
              }}
            >
              {t("navLogout")}
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              sx={{
                color: "#00ff88",
                fontFamily: "Fira Code",
                borderRadius: "8px",
                "&:hover": { bgcolor: "#00ff8844" },
              }}
            >
              {t("Login")}
            </Button>
          )}

          <Button
            onClick={toggleLanguage}
            sx={{
              color: "#00ff88",
              border: "1px solid #00ff88",
              borderRadius: "8px",
              px: 1.5,
              fontFamily: "Fira Code",
              "&:hover": { bgcolor: "#00ff8844" },
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
