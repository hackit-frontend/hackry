import React from "react";
import { Box, Typography,  Container } from "@mui/material";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();


  return (
    <Box
      sx={{
        minHeight: "80vh",
        background: "0A0A0A",
        color: "#fff",
        pt: { xs: 4, md: 8 },
        pb: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
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

   
        </Box>

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
      </Container>
    </Box>
  );
};

export default Home;
