import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../constants";


interface Props {
  token?: string | null;
  onLogout: () => void;
}

const Navbar: React.FC<Props> = ({ token, onLogout }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "uz" ? "en" : "uz");
  };

  useEffect(() => {
    if (!token) return;

    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem("access_token");
        if (!storedToken) return;
        const res = await fetch(`${API_BASE}me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setUserName(data.name || "");
        setUserEmail(data.email || "");
        const photo = data.picture || data.photo || data.avatar || data.image || data.imageUrl || data.photoUrl;
        if (photo) {
          setAvatarUrl(photo);
        }
      } catch (err) {
        console.error("Failed to load user info", err);
      }
    };

    loadUser();
  }, [token]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/dashboard");
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    onLogout();
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
          {token && (
            <Button
              component={Link}
              to="/tasks"
              sx={{ color: "#00FF00", fontFamily: "Fira Code" }}
            >
              {t("navTasks")}
            </Button>
          )}

          {!token && (
            <Button
              onClick={handelLogin}
              sx={{
                color: "#00FF00",
                fontFamily: "Fira Code",
                border: "1px solid #00FF00",
                borderRadius: "8px",
                px: 3,
                py: 1,
                textTransform: "none",
                "&:hover": { bgcolor: "#00FF0044" },
              }}
            >
              {t("loginWithGoogle")}
            </Button>
          )}

          {token && (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  src={avatarUrl || undefined}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#00FF00",
                    color: "#000",
                    fontFamily: "Fira Code",
                  }}
                >
                  {avatarUrl ? "" : (userName?.[0] || userEmail?.[0] || "U").toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: "#0a0a0a",
                    color: "#00FF00",
                    border: "1px solid #00FF00",
                    minWidth: 180,
                  },
                }}
              >
                <MenuItem onClick={handleProfile} sx={{ fontFamily: "Fira Code" }}>
                  {t("profile.title")}
                </MenuItem>
                <Divider sx={{ borderColor: "#00FF00", opacity: 0.2 }} />
                <MenuItem onClick={handleLogoutClick} sx={{ fontFamily: "Fira Code", color: "#FF4D4D" }}>
                  {t("navLogout")}
                </MenuItem>
              </Menu>
            </>
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
