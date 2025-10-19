import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#000",
        color: "#00ff88",
        fontFamily: "Fira Code",
        textAlign: "center",
      }}
    >
      <Typography variant="h2" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>
        {t("notFound.error")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        {t("notFound.description")}
      </Typography>

      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{
          color: "#00ff88",
          borderColor: "#00ff88",
          "&:hover": { bgcolor: "#00ff8844" },
        }}
      >
        {t("notFound.returnHome")}
      </Button>
    </Box>
  );
};

export default NotFound;
