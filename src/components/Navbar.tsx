import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  userEmail?: string | null; 
  onLogout: () => void;
}

const Navbar: React.FC<Props> = ({ userEmail, onLogout }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "uz" ? "en" : "uz");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "black" }}>
      <Toolbar>
        {/* App Title */}
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            color: "#00ff88",
            fontFamily: "Fira Code",
            textDecoration: "none",
            cursor: "pointer",
          }}
          component={Link}
          to="/"
        >
          HackLab
        </Typography>

        {/* Navigation Links */}
        <Button component={Link} to="/" sx={{ color: "#00ff88", fontFamily: "Fira Code" }}>
          {t("navHome")}
        </Button>
        <Button component={Link} to="/dashboard" sx={{ color: "#00ff88", fontFamily: "Fira Code" }}>
          {t("navDashboard")}
        </Button>

        {/* Display email if available */}
        {userEmail && (
          <Typography sx={{ ml: 2, color: "#00ff88", fontFamily: "Fira Code" }}>
            {userEmail}
          </Typography>
        )}

        <Button onClick={onLogout} sx={{ ml: 2, color: "#00ff88", fontFamily: "Fira Code" }}>
          {t("navLogout")}
        </Button>

        {/* Language Toggle */}
        <Button
          onClick={toggleLanguage}
          sx={{
            ml: 2,
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
