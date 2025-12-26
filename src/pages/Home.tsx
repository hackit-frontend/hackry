import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "0A0A0A",
        color: "#fff",
        pt: { xs: 4, md: 8 },
        pb: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "Fira Code",
              fontWeight: 700,
              color: "#00FF00",
              mb: 2,
              fontSize: { xs: "2rem", md: "3.5rem" },
              textShadow: "0 0 20px rgba(0, 255, 0, 0.5)",
            }}
          >
            HackLab
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontFamily: "Fira Code",
              color: "#00ffaa",
              mb: 3,
              fontSize: { xs: "1.25rem", md: "1.75rem" },
            }}
          >
            {t("home.tagline")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#ccc",
              mb: 2,
              fontSize: { xs: "1rem", md: "1.1rem" },
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            {t("home.description1")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#aaa",
              mb: 4,
              fontSize: { xs: "0.95rem", md: "1rem" },
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            {t("home.description2")}
          </Typography>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Fira Code",
              color: "#00FF00",
              textAlign: "center",
              mb: 4,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            {t("home.features")}
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
            {[
              t("home.feature1"),
              t("home.feature2"),
              t("home.feature3"),
              t("home.feature4"),
            ].map((feature, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 2.5,
                  border: "2px solid #00FF00",
                  borderRadius: "8px",
                  background: "rgba(0, 255, 0, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(0, 255, 0, 0.1)",
                    boxShadow: "0 0 15px rgba(0, 255, 0, 0.3)",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#00FF00",
                    fontFamily: "Fira Code",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  ✓ {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: "center" }}>
          {isAuthenticated ? (
            <Box>
              <Typography
                variant="body1"
                sx={{
                  color: "#aaa",
                  mb: 2,
                  fontSize: "1rem",
                }}
              >
                {t("home.alreadyMember")}
              </Typography>
              <Button
                onClick={() => navigate("/tasks")}
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #00FF00 0%, #00ffaa 100%)",
                  color: "#000",
                  fontFamily: "Fira Code",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 0 30px rgba(0, 255, 0, 0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {t("home.goToTasks")}
              </Button>
            </Box>
          ) : (
            <Button
              onClick={() => {
                window.location.href =
                  "https://unrefulgently-unitalicized-greta.ngrok-free.dev/auth/google";
              }}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #00FF00 0%, #00ffaa 100%)",
                color: "#000",
                fontFamily: "Fira Code",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                textTransform: "none",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 30px rgba(0, 255, 0, 0.5)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {t("home.cta")}
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
